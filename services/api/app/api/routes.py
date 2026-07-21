from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import AnalysisReport, get_db, save_report
from app.models.schemas import (
    AnalysisResponse,
    AnalysisSummary,
    ComparisonRequest,
    ComparisonResponse,
    GoogleOAuthRequest,
    ScoreDelta,
    TextGenerationRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
)
from app.services.analyzer import analyze_resume
from app.services.auth import authenticate, create_token, create_user, decode_token, get_user_by_email, upsert_google_user
from app.services.llm import generate_cover_letter, generate_interview_questions
from app.services.parser import extract_resume_text

router = APIRouter()


@router.post("/auth/signup", response_model=TokenResponse)
def signup(payload: UserCreate, db: Session = Depends(get_db)) -> TokenResponse:
    try:
        user = create_user(db, payload.name, payload.email, payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    return TokenResponse(access_token=create_token(payload.email), user=user)


@router.post("/auth/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    user = authenticate(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return TokenResponse(access_token=create_token(payload.email), user=user)


@router.get("/auth/me")
def me(authorization: str | None = Header(default=None), db: Session = Depends(get_db)) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    email = decode_token(authorization.split(" ", 1)[1])
    if not email:
        raise HTTPException(status_code=401, detail="Invalid bearer token")
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": user}


@router.get("/auth/google")
def google_oauth() -> dict:
    return {"status": "Use NextAuth Google provider at /api/auth/signin/google"}


@router.post("/auth/oauth/google", response_model=TokenResponse)
def google_oauth_exchange(
    payload: GoogleOAuthRequest,
    db: Session = Depends(get_db),
    x_oauth_bridge_secret: str | None = Header(default=None),
) -> TokenResponse:
    if x_oauth_bridge_secret != get_settings().oauth_bridge_secret:
        raise HTTPException(status_code=401, detail="Invalid OAuth bridge secret")
    user = upsert_google_user(db, payload.name, payload.email, payload.google_sub, payload.image)
    return TokenResponse(access_token=create_token(payload.email), user=user)


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(resume: UploadFile = File(...), job_description: str = Form(...), db: Session = Depends(get_db)) -> AnalysisResponse:
    if not job_description.strip():
        raise HTTPException(status_code=422, detail="Job description is required")
    try:
        resume_text = await extract_resume_text(resume)
    except ValueError as exc:
        raise HTTPException(status_code=415, detail=str(exc)) from exc
    if len(resume_text.split()) < 40:
        raise HTTPException(status_code=422, detail="Resume text is too short to analyze")
    result = await analyze_resume(resume_text, job_description, resume.filename or "resume")
    save_report(db, result.analysis_id, result.file_name, result.model_dump(), render_report(result))
    return result


@router.get("/reports/{analysis_id}", response_class=PlainTextResponse)
def report(analysis_id: str, db: Session = Depends(get_db)) -> str:
    analysis = db.get(AnalysisReport, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis report not found")
    return analysis.report_markdown


@router.get("/analyses", response_model=list[AnalysisSummary])
def analyses(db: Session = Depends(get_db)) -> list[AnalysisSummary]:
    rows = db.query(AnalysisReport).order_by(AnalysisReport.created_at.desc()).all()
    return [to_summary(row) for row in rows]


@router.get("/analyses/{analysis_id}", response_model=AnalysisResponse)
def analysis_detail(analysis_id: str, db: Session = Depends(get_db)) -> AnalysisResponse:
    row = db.get(AnalysisReport, analysis_id)
    if not row:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return AnalysisResponse.model_validate(row.payload)


@router.delete("/analyses/{analysis_id}")
def delete_analysis(analysis_id: str, db: Session = Depends(get_db)) -> dict:
    row = db.get(AnalysisReport, analysis_id)
    if not row:
        raise HTTPException(status_code=404, detail="Analysis not found")
    db.delete(row)
    db.commit()
    return {"deleted": True, "analysis_id": analysis_id}


@router.post("/analyses/compare", response_model=ComparisonResponse)
def compare_analyses(payload: ComparisonRequest, db: Session = Depends(get_db)) -> ComparisonResponse:
    first_row = db.get(AnalysisReport, payload.analysis_ids[0])
    second_row = db.get(AnalysisReport, payload.analysis_ids[1])
    if not first_row or not second_row:
        raise HTTPException(status_code=404, detail="One or more analyses were not found")

    first = AnalysisResponse.model_validate(first_row.payload)
    second = AnalysisResponse.model_validate(second_row.payload)
    deltas = [
        ScoreDelta(metric="ATS", first=first.scores.ats, second=second.scores.ats, delta=second.scores.ats - first.scores.ats),
        ScoreDelta(metric="Skill Match", first=first.scores.skill_match, second=second.scores.skill_match, delta=second.scores.skill_match - first.scores.skill_match),
        ScoreDelta(metric="Semantic Match", first=first.scores.semantic_similarity, second=second.scores.semantic_similarity, delta=second.scores.semantic_similarity - first.scores.semantic_similarity),
        ScoreDelta(metric="Recruiter Score", first=first.scores.recruiter_impression, second=second.scores.recruiter_impression, delta=second.scores.recruiter_impression - first.scores.recruiter_impression),
    ]
    first_missing = set(first.missing_keywords)
    second_missing = set(second.missing_keywords)
    gained = sorted(first_missing - second_missing)
    lost = sorted(second_missing - first_missing)
    shared = sorted(set(first.matched_keywords) & set(second.matched_keywords))
    ats_delta = second.scores.ats - first.scores.ats
    recommendation = (
        "The second resume version is stronger overall. Keep the new positioning and preserve the keywords that improved."
        if ats_delta > 0
        else "The first resume version performs better. Review the second version for lost keywords, weaker metrics, or reduced role alignment."
        if ats_delta < 0
        else "Both versions are close. Choose the one with stronger recruiter clarity and fewer missing keywords."
    )
    return ComparisonResponse(
        first=to_summary(first_row),
        second=to_summary(second_row),
        score_deltas=deltas,
        gained_keywords=gained[:12],
        lost_keywords=lost[:12],
        shared_keywords=shared[:12],
        recommendation=recommendation,
    )


@router.post("/cover-letter")
def cover_letter(payload: TextGenerationRequest) -> dict:
    return {"cover_letter": generate_cover_letter(payload.resume_text, payload.job_description, payload.tone)}


@router.post("/interview-questions")
def interview_questions(payload: TextGenerationRequest) -> dict:
    gaps = payload.job_description.split()[:5]
    return {"questions": generate_interview_questions(payload.job_description, gaps)}


def render_report(analysis: AnalysisResponse) -> str:
    return f"""# Resume Analysis Report

File: {analysis.file_name}

## Scores

- ATS Score: {analysis.scores.ats}/100
- Skill Match: {analysis.scores.skill_match}%
- Semantic Similarity: {analysis.scores.semantic_similarity}%
- Recruiter Impression: {analysis.scores.recruiter_impression}/100

## Missing Keywords

{", ".join(analysis.missing_keywords) or "None detected"}

## Recommendations

{chr(10).join(f"- {item}" for item in analysis.recommendations)}

## Improved Bullets

{chr(10).join(f"- {item}" for item in analysis.improved_bullets)}
"""


def to_summary(row: AnalysisReport) -> AnalysisSummary:
    analysis = AnalysisResponse.model_validate(row.payload)
    return AnalysisSummary(
        analysis_id=analysis.analysis_id,
        file_name=analysis.file_name,
        created_at=row.created_at.isoformat(),
        ats_score=analysis.scores.ats,
        skill_match=analysis.scores.skill_match,
        semantic_similarity=analysis.scores.semantic_similarity,
        missing_keyword_count=len(analysis.missing_keywords),
        top_missing_keywords=analysis.missing_keywords[:5],
    )

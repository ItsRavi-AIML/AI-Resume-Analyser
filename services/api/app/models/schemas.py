from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class GoogleOAuthRequest(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1)
    google_sub: str = Field(min_length=4)
    image: str | None = None


class ScoreBreakdown(BaseModel):
    ats: int
    skill_match: int
    semantic_similarity: int
    experience_relevance: int
    formatting_quality: int
    recruiter_impression: int
    readability: int


class SectionInsight(BaseModel):
    section: str
    score: int
    summary: str


class AnalysisResponse(BaseModel):
    analysis_id: str
    file_name: str
    scores: ScoreBreakdown
    strengths: list[str]
    weaknesses: list[str]
    missing_keywords: list[str]
    matched_keywords: list[str]
    suggested_skills: list[str]
    recommendations: list[str]
    improved_bullets: list[str]
    section_analysis: list[SectionInsight]
    radar: list[dict]
    skill_gap: list[dict]
    heatmap: list[dict]


class AnalysisSummary(BaseModel):
    analysis_id: str
    file_name: str
    created_at: str
    ats_score: int
    skill_match: int
    semantic_similarity: int
    missing_keyword_count: int
    top_missing_keywords: list[str]


class ComparisonRequest(BaseModel):
    analysis_ids: list[str] = Field(min_length=2, max_length=2)


class ScoreDelta(BaseModel):
    metric: str
    first: int
    second: int
    delta: int


class ComparisonResponse(BaseModel):
    first: AnalysisSummary
    second: AnalysisSummary
    score_deltas: list[ScoreDelta]
    gained_keywords: list[str]
    lost_keywords: list[str]
    shared_keywords: list[str]
    recommendation: str


class TextGenerationRequest(BaseModel):
    resume_text: str
    job_description: str
    tone: str = "confident and concise"

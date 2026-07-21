import math
import re
import uuid
from collections import Counter

import numpy as np
import textstat
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.models.schemas import AnalysisResponse, ScoreBreakdown, SectionInsight
from app.services.llm import generate_recommendations

SKILLS = {
    "python", "typescript", "javascript", "react", "next.js", "fastapi", "node.js", "sql",
    "postgresql", "mongodb", "aws", "docker", "kubernetes", "terraform", "machine learning",
    "nlp", "openai", "gemini", "langchain", "rag", "pandas", "spark", "tableau", "power bi",
    "leadership", "analytics", "stakeholder", "agile", "ci/cd", "rest", "graphql",
}

ACTION_VERBS = {"built", "led", "launched", "improved", "reduced", "increased", "designed", "automated", "optimized"}
STOPWORDS = {"and", "the", "with", "for", "you", "are", "that", "this", "from", "will", "have", "our", "your"}


async def analyze_resume(resume_text: str, job_description: str, file_name: str) -> AnalysisResponse:
    resume = normalize(resume_text)
    job = normalize(job_description)

    matched_skills = sorted(extract_skills(resume) & extract_skills(job))
    missing_skills = sorted(extract_skills(job) - extract_skills(resume))
    jd_keywords = extract_keywords(job_description, limit=28)
    resume_keywords = set(extract_keywords(resume_text, limit=80))
    missing_keywords = [word for word in jd_keywords if word not in resume_keywords][:14]
    matched_keywords = [word for word in jd_keywords if word in resume_keywords][:18]

    tfidf_similarity = calculate_tfidf_similarity(resume_text, job_description)
    semantic_similarity = calculate_semantic_similarity(resume_text, job_description, tfidf_similarity)
    skill_match = percentage(len(matched_skills), max(len(extract_skills(job)), 1))
    formatting = score_formatting(resume_text)
    experience = score_experience(resume_text, job_description)
    readability = max(45, min(96, int(100 - abs(textstat.flesch_reading_ease(resume_text or "resume") - 55) * 0.7)))
    ats = weighted_score([semantic_similarity, skill_match, formatting, experience, readability], [0.32, 0.24, 0.16, 0.18, 0.10])
    recruiter = weighted_score([ats, experience, readability, formatting], [0.42, 0.28, 0.15, 0.15])

    strengths = build_strengths(matched_skills, formatting, experience, semantic_similarity)
    weaknesses = build_weaknesses(missing_keywords, missing_skills, formatting, readability)
    recommendations = await generate_recommendations(resume_text, job_description, missing_keywords + missing_skills)

    scores = ScoreBreakdown(
        ats=ats,
        skill_match=skill_match,
        semantic_similarity=semantic_similarity,
        experience_relevance=experience,
        formatting_quality=formatting,
        recruiter_impression=recruiter,
        readability=readability,
    )

    return AnalysisResponse(
        analysis_id=str(uuid.uuid4()),
        file_name=file_name,
        scores=scores,
        strengths=strengths,
        weaknesses=weaknesses,
        missing_keywords=missing_keywords,
        matched_keywords=matched_keywords,
        suggested_skills=(missing_skills + missing_keywords)[:10],
        recommendations=recommendations,
        improved_bullets=generate_bullets(missing_keywords, matched_skills),
        section_analysis=section_analysis(resume_text),
        radar=[
            {"metric": "ATS", "score": ats},
            {"metric": "Skills", "score": skill_match},
            {"metric": "Semantic", "score": semantic_similarity},
            {"metric": "Experience", "score": experience},
            {"metric": "Format", "score": formatting},
            {"metric": "Readability", "score": readability},
        ],
        skill_gap=[{"name": skill, "matched": skill in matched_skills, "value": 100 if skill in matched_skills else 35} for skill in sorted(extract_skills(job))[:12]],
        heatmap=build_heatmap(resume_text, jd_keywords),
    )


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def extract_skills(text: str) -> set[str]:
    normalized = normalize(text)
    return {skill for skill in SKILLS if skill in normalized}


def extract_keywords(text: str, limit: int) -> list[str]:
    tokens = re.findall(r"[a-zA-Z][a-zA-Z+#./-]{2,}", text.lower())
    tokens = [token.strip("./-") for token in tokens if token not in STOPWORDS and len(token) > 2]
    counts = Counter(tokens)
    return [word for word, _ in counts.most_common(limit)]


def calculate_tfidf_similarity(resume_text: str, job_description: str) -> int:
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=1600)
    matrix = vectorizer.fit_transform([resume_text, job_description])
    return round(float(cosine_similarity(matrix[0], matrix[1])[0][0]) * 100)


def calculate_semantic_similarity(resume_text: str, job_description: str, fallback: int) -> int:
    try:
        from sentence_transformers import SentenceTransformer

        model = SentenceTransformer("all-MiniLM-L6-v2")
        embeddings = model.encode([resume_text[:5000], job_description[:5000]])
        score = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
        return round(float(score) * 100)
    except Exception:
        return max(35, min(94, fallback + 12))


def score_formatting(text: str) -> int:
    has_sections = sum(section in text.lower() for section in ["experience", "education", "skills", "projects", "summary"])
    bullet_count = len(re.findall(r"(^|\n)\s*[-•*]", text))
    length_score = 90 if 350 <= len(text.split()) <= 1100 else 68
    return min(98, int(length_score * 0.45 + min(has_sections * 14, 42) + min(bullet_count * 2, 16)))


def score_experience(resume_text: str, job_description: str) -> int:
    verb_hits = sum(verb in resume_text.lower() for verb in ACTION_VERBS)
    metric_hits = len(re.findall(r"\b\d+[%x]?\b|\$[0-9,.]+", resume_text))
    overlap = len(set(extract_keywords(resume_text, 40)) & set(extract_keywords(job_description, 40)))
    return min(98, 42 + verb_hits * 4 + metric_hits * 4 + overlap)


def percentage(part: int, whole: int) -> int:
    return min(100, round(part / whole * 100))


def weighted_score(values: list[int], weights: list[float]) -> int:
    return round(sum(value * weight for value, weight in zip(values, weights)))


def build_strengths(skills: list[str], formatting: int, experience: int, semantic: int) -> list[str]:
    strengths = []
    if skills:
        strengths.append(f"Strong alignment on core skills: {', '.join(skills[:5])}.")
    if formatting >= 80:
        strengths.append("Resume structure is ATS-friendly with recognizable sections.")
    if experience >= 80:
        strengths.append("Experience bullets show relevant scope, ownership, and measurable signals.")
    if semantic >= 75:
        strengths.append("Resume language is semantically close to the target job description.")
    return strengths or ["The resume has a workable foundation and can improve quickly with targeted edits."]


def build_weaknesses(keywords: list[str], skills: list[str], formatting: int, readability: int) -> list[str]:
    weaknesses = []
    if keywords:
        weaknesses.append(f"Missing high-value job description terms: {', '.join(keywords[:6])}.")
    if skills:
        weaknesses.append(f"Add or substantiate target skills: {', '.join(skills[:5])}.")
    if formatting < 75:
        weaknesses.append("Formatting may be hard for ATS systems to parse consistently.")
    if readability < 70:
        weaknesses.append("Some content may be too dense; tighten bullets and remove filler language.")
    return weaknesses or ["No major weakness detected, but the resume can still benefit from sharper metrics."]


def generate_bullets(gaps: list[str], skills: list[str]) -> list[str]:
    focus = gaps[:3] or skills[:3] or ["cross-functional delivery"]
    return [
        f"Optimized {focus[0]} workflows, improving execution speed by 32% while increasing stakeholder visibility.",
        f"Built scalable {focus[min(1, len(focus)-1)]} capabilities that reduced manual review time and improved quality.",
        f"Led delivery across {focus[min(2, len(focus)-1)]}, translating ambiguous requirements into measurable product outcomes.",
    ]


def section_analysis(text: str) -> list[SectionInsight]:
    lower = text.lower()
    sections = [
        ("Summary", "summary" in lower or "profile" in lower),
        ("Experience", "experience" in lower or "work history" in lower),
        ("Skills", "skills" in lower or "technologies" in lower),
        ("Projects", "projects" in lower),
        ("Education", "education" in lower),
    ]
    return [
        SectionInsight(
            section=name,
            score=88 if present else 52,
            summary="Detected and parseable." if present else "Consider adding this section or making its heading explicit.",
        )
        for name, present in sections
    ]


def build_heatmap(text: str, keywords: list[str]) -> list[dict]:
    lines = [line.strip() for line in text.splitlines() if line.strip()][:10]
    if not lines:
        lines = ["Resume content"]
    return [
        {"line": index + 1, "text": line[:120], "score": min(100, 25 + sum(keyword in line.lower() for keyword in keywords) * 18)}
        for index, line in enumerate(lines)
    ]

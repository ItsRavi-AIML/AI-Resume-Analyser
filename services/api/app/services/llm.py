from app.core.config import get_settings


async def generate_recommendations(resume_text: str, job_description: str, gaps: list[str]) -> list[str]:
    settings = get_settings()
    if settings.openai_api_key:
        return await _openai_recommendations(resume_text, job_description, gaps)
    if settings.gemini_api_key:
        return await _gemini_recommendations(resume_text, job_description, gaps)
    return _fallback_recommendations(gaps)


async def _openai_recommendations(resume_text: str, job_description: str, gaps: list[str]) -> list[str]:
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=get_settings().openai_api_key)
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an expert resume strategist. Return 5 concise ATS recommendations."},
            {"role": "user", "content": f"Resume:\n{resume_text[:6000]}\n\nJob:\n{job_description[:4000]}\n\nKeyword gaps: {', '.join(gaps)}"},
        ],
        temperature=0.4,
    )
    text = response.choices[0].message.content or ""
    return [line.strip("-• 1234567890. ") for line in text.splitlines() if line.strip()][:5]


async def _gemini_recommendations(resume_text: str, job_description: str, gaps: list[str]) -> list[str]:
    import google.generativeai as genai

    genai.configure(api_key=get_settings().gemini_api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = await model.generate_content_async(
        f"Return 5 concise ATS resume recommendations.\nResume:\n{resume_text[:6000]}\nJob:\n{job_description[:4000]}\nGaps:{gaps}"
    )
    return [line.strip("-• 1234567890. ") for line in response.text.splitlines() if line.strip()][:5]


def _fallback_recommendations(gaps: list[str]) -> list[str]:
    top_gaps = ", ".join(gaps[:5]) or "role-specific tools and outcomes"
    return [
        f"Add evidence for missing target keywords: {top_gaps}.",
        "Rewrite bullets to start with strong action verbs and end with measurable business impact.",
        "Move the most relevant skills into a compact skills section near the top of the resume.",
        "Mirror the job description's seniority, tools, and domain language without keyword stuffing.",
        "Add metrics for scope, efficiency, revenue, latency, accuracy, adoption, or cost savings.",
    ]


def generate_cover_letter(resume_text: str, job_description: str, tone: str) -> str:
    return (
        f"Dear Hiring Team,\n\n"
        f"I am excited to apply for this role. My background aligns strongly with the position's emphasis on "
        f"{_extract_focus(job_description)}. Across my experience, I have built measurable outcomes, collaborated "
        f"cross-functionally, and translated complex requirements into reliable delivery.\n\n"
        f"What draws me to this opportunity is the chance to contribute with a {tone} approach while bringing the "
        f"skills reflected in my resume: ownership, technical depth, and product-minded execution.\n\n"
        f"Sincerely,\nYour Name"
    )


def generate_interview_questions(job_description: str, gaps: list[str]) -> list[str]:
    focus = _extract_focus(job_description)
    return [
        f"Describe a project where you used {focus} to deliver a measurable outcome.",
        "Which resume bullet best represents your strongest impact, and how would you defend the metric?",
        f"How would you close your experience gap around {', '.join(gaps[:3]) or 'the role requirements'}?",
        "Tell me about a time you improved a process, system, or customer outcome.",
        "What would you prioritize in your first 30 days in this role?",
    ]


def _extract_focus(text: str) -> str:
    words = [word.strip(".,:;()").lower() for word in text.split() if len(word) > 5]
    return ", ".join(dict.fromkeys(words[:3])) or "the target responsibilities"

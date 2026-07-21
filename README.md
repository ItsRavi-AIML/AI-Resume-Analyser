# AI Resume Analyzer

A production-grade AI resume analysis platform built with Next.js, FastAPI, PostgreSQL-ready persistence, and an NLP pipeline for ATS scoring, skill matching, semantic similarity, recruiter impression, section quality, and AI recommendations.

## Highlights

- Resume upload for PDF and DOCX
- Job description comparison with ATS score, skill match, semantic similarity, and missing keywords
- AI recommendations, stronger bullet rewrites, skill suggestions, readability checks, and recruiter impression scoring
- Premium dark SaaS interface inspired by Linear, Vercel, Stripe, Framer, and Notion
- Animated charts with Recharts, responsive dashboard, drag-and-drop upload, toasts, and loading states
- FastAPI backend with modular services for parsing, NLP scoring, auth, reports, and LLM providers
- JWT auth endpoints and Google OAuth extension point
- Downloadable Markdown analysis reports

## Architecture

```txt
apps/web              Next.js 15 frontend
services/api          FastAPI backend and NLP pipeline
docs                  API and deployment notes
docker-compose.yml    PostgreSQL, API, and web orchestration
```

The analyzer combines deterministic NLP with optional LLM enrichment:

- `pdfplumber` and `python-docx` extract resume text
- spaCy-style token cleanup and TF-IDF keyword scoring identify skill and keyword gaps
- Sentence Transformers are used for semantic similarity when available
- OpenAI or Gemini can generate richer recommendations when API keys are configured
- A local rules engine keeps the app demoable without external AI credentials

## Quick Start

```bash
npm install
npm run install:all
copy .env.example .env
npm run dev
```

Open:

- Web: `http://localhost:3000`
- API docs: `http://localhost:8000/docs`

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
BACKEND_INTERNAL_API_URL=http://localhost:8000/api/v1
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/resume_ai
JWT_SECRET=change-me-in-production
AUTH_SECRET=generate-with-openssl-rand-base64-32
AUTH_URL=http://localhost:3000
OAUTH_BRIDGE_SECRET=change-me-oauth-bridge
OPENAI_API_KEY=
GEMINI_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Google OAuth

The frontend uses NextAuth/Auth.js for Google OAuth and exchanges the verified Google profile with FastAPI for an app JWT.

Add this Google OAuth redirect URI in Google Cloud Console:

```txt
http://localhost:3000/api/auth/callback/google
```

For production, add your deployed callback URL as well:

```txt
https://your-domain.com/api/auth/callback/google
```

Set the same `OAUTH_BRIDGE_SECRET` in both the Next.js and FastAPI environments. This protects the server-to-server exchange endpoint: `POST /api/v1/auth/oauth/google`.

## API

Core endpoints:

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/analyze`
- `GET /api/v1/reports/{analysis_id}`
- `POST /api/v1/cover-letter`
- `POST /api/v1/interview-questions`

See [API documentation](docs/API.md) for request and response examples.

## Deployment

Recommended production deployment:

- Frontend: Vercel
- Backend: Render, Railway, Fly.io, or AWS ECS
- Database: Neon, Supabase Postgres, Railway Postgres, or RDS
- Object storage: S3/R2 for uploaded resumes and generated reports

See [deployment guide](docs/DEPLOYMENT.md).

## Screenshots

Add screenshots of the landing page, upload flow, analysis dashboard, and tips page here after running the app locally.

## Portfolio Notes

This project is intentionally structured like a real SaaS product: typed API clients, reusable UI primitives, modular backend services, clear environment boundaries, and progressive AI enhancement. It is suitable for a GitHub portfolio, recruiter demos, and deployment experiments.

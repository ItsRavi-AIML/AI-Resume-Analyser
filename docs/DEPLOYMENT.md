# Deployment Guide

## Frontend

Deploy `apps/web` to Vercel.

Set:

```env
NEXT_PUBLIC_API_URL=https://your-api.example.com/api/v1
```

## Backend

Deploy `services/api` to Render, Railway, Fly.io, ECS, or Cloud Run.

Install the spaCy model if you want deeper linguistic parsing:

```bash
python -m spacy download en_core_web_sm
```

Set production secrets:

```env
DATABASE_URL=...
JWT_SECRET=...
OPENAI_API_KEY=...
GEMINI_API_KEY=...
```

## Database

Use managed Postgres. The current API is repository-ready and can be extended with Alembic migrations for persistent analysis history, teams, billing, and recruiter mode.

# API Documentation

Base URL: `http://localhost:8000/api/v1`

## Auth

### `POST /auth/signup`

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "strong-password"
}
```

### `POST /auth/login`

```json
{
  "email": "ada@example.com",
  "password": "strong-password"
}
```

Returns a JWT access token and user profile.

### `POST /auth/oauth/google`

Server-to-server endpoint called by NextAuth after Google verifies the user.

Headers:

```http
X-OAuth-Bridge-Secret: your-shared-secret
```

Body:

```json
{
  "email": "ada@example.com",
  "name": "Ada Lovelace",
  "google_sub": "google-user-id",
  "image": "https://lh3.googleusercontent.com/..."
}
```

### `GET /auth/me`

Validates the FastAPI JWT.

```http
Authorization: Bearer <access_token>
```

## Analyze Resume

### `POST /analyze`

Multipart form data:

- `resume`: PDF or DOCX file
- `job_description`: target job description text

Returns scores, missing keywords, suggestions, chart data, section analysis, rewritten bullets, and a report ID.

## Download Report

### `GET /reports/{analysis_id}`

Returns a Markdown report containing the analysis summary and recommendations.

## Extra AI Tools

### `POST /cover-letter`

Generates a targeted cover letter draft from resume text and a job description.

### `POST /interview-questions`

Generates role-specific interview questions from detected gaps and target responsibilities.

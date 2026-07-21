import type { Analysis, AnalysisComparison, AnalysisSummary } from "@/lib/types";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

async function authHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  return session?.backendAccessToken ? { Authorization: `Bearer ${session.backendAccessToken}` } : {};
}

export type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

export async function authenticate(mode: "login" | "signup", payload: AuthPayload) {
  const response = await fetch(`${API_URL}/auth/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Authentication failed" }));
    throw new Error(error.detail ?? "Authentication failed");
  }

  return response.json() as Promise<{ access_token: string; user: { name: string; email: string } }>;
}

export async function analyzeResume(file: File, jobDescription: string): Promise<Analysis> {
  const form = new FormData();
  form.append("resume", file);
  form.append("job_description", jobDescription);

  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: await authHeaders(),
    body: form
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Analysis failed" }));
    throw new Error(error.detail ?? "Analysis failed");
  }

  return response.json();
}

export async function downloadReport(analysisId: string) {
  const response = await fetch(`${API_URL}/reports/${analysisId}`, { headers: await authHeaders() });
  if (!response.ok) throw new Error("Report is not ready yet");
  return response.text();
}

export async function fetchAnalyses(): Promise<AnalysisSummary[]> {
  const response = await fetch(`${API_URL}/analyses`, { cache: "no-store", headers: await authHeaders() });
  if (!response.ok) throw new Error("Could not load resume history");
  return response.json();
}

export async function fetchAnalysis(analysisId: string): Promise<Analysis> {
  const response = await fetch(`${API_URL}/analyses/${analysisId}`, { cache: "no-store", headers: await authHeaders() });
  if (!response.ok) throw new Error("Analysis not found");
  return response.json();
}

export async function deleteAnalysis(analysisId: string): Promise<void> {
  const response = await fetch(`${API_URL}/analyses/${analysisId}`, { method: "DELETE", headers: await authHeaders() });
  if (!response.ok) throw new Error("Could not delete analysis");
}

export async function compareAnalyses(analysisIds: [string, string]): Promise<AnalysisComparison> {
  const response = await fetch(`${API_URL}/analyses/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify({ analysis_ids: analysisIds })
  });
  if (!response.ok) throw new Error("Could not compare analyses");
  return response.json();
}

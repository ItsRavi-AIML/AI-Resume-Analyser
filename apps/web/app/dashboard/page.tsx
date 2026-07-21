"use client";

import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { Button } from "@/components/ui/button";
import { PageShell, SectionHeader } from "@/components/ui/page-shell";
import { Panel } from "@/components/ui/panel";
import type { Analysis } from "@/lib/types";

const demoAnalysis: Analysis = {
  analysis_id: "demo",
  file_name: "senior-ai-engineer-resume.pdf",
  scores: {
    ats: 87,
    skill_match: 82,
    semantic_similarity: 89,
    experience_relevance: 84,
    formatting_quality: 93,
    recruiter_impression: 88,
    readability: 78
  },
  strengths: ["Strong alignment across AI, backend, and product delivery.", "Clear section structure and ATS-friendly formatting.", "Impact-driven bullets show measurable ownership."],
  weaknesses: ["Missing high-value keywords: RAG, evaluation, observability, vector database.", "Add stronger evidence for production AI monitoring and model quality loops."],
  missing_keywords: ["rag", "evaluation", "observability", "vector database", "latency", "guardrails"],
  matched_keywords: ["python", "fastapi", "typescript", "openai", "postgresql", "docker"],
  suggested_skills: ["RAG", "Vector databases", "LLM evaluation", "Observability", "Prompt engineering"],
  recommendations: ["Add a short AI systems summary at the top.", "Quantify model quality, latency, and cost improvements.", "Mirror the job description's production AI language.", "Add deployment and monitoring examples.", "Strengthen seniority signals with mentorship or architecture ownership."],
  improved_bullets: [
    "Designed a RAG evaluation workflow that improved answer quality by 28% while reducing manual review cycles.",
    "Optimized FastAPI inference paths, cutting median latency by 34% across production resume analysis jobs.",
    "Led cross-functional delivery for AI scoring dashboards used by recruiters and career coaches."
  ],
  section_analysis: [
    { section: "Summary", score: 86, summary: "Detected and aligned." },
    { section: "Experience", score: 91, summary: "Strong impact language." },
    { section: "Skills", score: 84, summary: "Relevant but could add target AI terms." }
  ],
  radar: [
    { metric: "ATS", score: 87 },
    { metric: "Skills", score: 82 },
    { metric: "Semantic", score: 89 },
    { metric: "Experience", score: 84 },
    { metric: "Format", score: 93 },
    { metric: "Readability", score: 78 }
  ],
  skill_gap: [
    { name: "Python", matched: true, value: 100 },
    { name: "FastAPI", matched: true, value: 100 },
    { name: "RAG", matched: false, value: 35 },
    { name: "OpenAI", matched: true, value: 100 },
    { name: "Vector DB", matched: false, value: 35 },
    { name: "Postgres", matched: true, value: 100 }
  ],
  heatmap: [
    { line: 1, text: "Senior AI Engineer with 5 years building production ML and web platforms.", score: 91 },
    { line: 2, text: "Built FastAPI services and TypeScript dashboards for resume intelligence.", score: 88 },
    { line: 3, text: "Collaborated with product and design on customer-facing analytics workflows.", score: 69 }
  ]
};

export default function DashboardPage() {
  return (
    <>
      <Navigation />
      <PageShell>
        <SectionHeader
          eyebrow="Demo workspace"
          title="Resume intelligence dashboard"
          copy="Monitor ATS strength, semantic fit, skill coverage, recruiter impression, and improvement opportunities from one polished workspace."
          action={
          <Button asChild>
            <Link href="/upload">Analyze new resume</Link>
          </Button>
          }
        />
        <AnalysisDashboard analysis={demoAnalysis} />
        <Panel className="mt-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Resume history</h2>
              <p className="mt-1 text-sm text-muted">Version comparison and trend analysis hooks are ready for persisted resumes.</p>
            </div>
            <Button asChild variant="secondary">
              <Link href="/history">Open history</Link>
            </Button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {["AI Engineer", "Data Analyst", "Product Manager"].map((role) => (
              <div key={role} className="group rounded-md border border-line bg-white/[0.035] p-4 transition duration-300 hover:-translate-y-1 hover:border-brand/35 hover:bg-brand/[0.04]">
                <div className="text-sm font-medium">{role}</div>
                <div className="mt-2 text-xs text-muted">Version comparison and trend analysis ready for database persistence.</div>
                <div className="mt-4 h-1 rounded-full bg-white/10">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-brand to-cyan transition group-hover:w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </PageShell>
    </>
  );
}

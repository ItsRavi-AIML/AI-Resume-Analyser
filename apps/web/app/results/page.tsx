"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { Button } from "@/components/ui/button";
import { PageShell, SectionHeader } from "@/components/ui/page-shell";
import { Panel } from "@/components/ui/panel";
import type { Analysis } from "@/lib/types";

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem("latest-analysis");
    if (cached) setAnalysis(JSON.parse(cached) as Analysis);
  }, []);

  return (
    <>
      <Navigation />
      <PageShell>
        {analysis ? (
          <>
            <SectionHeader eyebrow={analysis.file_name} title="Analysis results" copy="A recruiter-style breakdown of ATS fit, skill coverage, semantic alignment, and resume improvement opportunities." />
            <AnalysisDashboard analysis={analysis} />
          </>
        ) : (
          <Panel className="mx-auto max-w-xl text-center">
            <h1 className="text-2xl font-semibold">No analysis found</h1>
            <p className="mt-3 text-sm leading-6 text-muted">Run a resume analysis first and your results will appear here.</p>
            <Button asChild className="mt-6">
              <Link href="/upload">Upload resume</Link>
            </Button>
          </Panel>
        )}
      </PageShell>
    </>
  );
}

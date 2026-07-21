"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { Button } from "@/components/ui/button";
import { PageShell, SectionHeader } from "@/components/ui/page-shell";
import { Panel } from "@/components/ui/panel";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { fetchAnalysis } from "@/lib/api";
import type { Analysis } from "@/lib/types";

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        setAnalysis(await fetchAnalysis(id));
      } catch (exception) {
        setError(exception instanceof Error ? exception.message : "Could not load analysis");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [id]);

  return (
    <>
      <Navigation />
      <PageShell>
        <SectionHeader
          eyebrow={analysis?.file_name ?? "Saved analysis"}
          title="Historical analysis"
          copy="A saved analysis loaded from the database, including the original score breakdown, recommendations, heatmap, and report download."
          action={
            <Button asChild variant="secondary">
              <Link href="/history">
                <ArrowLeft size={17} />
                Back to history
              </Link>
            </Button>
          }
        />
        {loading && <DashboardSkeleton />}
        {error && !loading && (
          <Panel className="py-12 text-center">
            <h2 className="text-2xl font-semibold">Analysis not found</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">{error}</p>
            <Button asChild className="mt-6">
              <Link href="/history">Return to history</Link>
            </Button>
          </Panel>
        )}
        {analysis && !loading && <AnalysisDashboard analysis={analysis} />}
      </PageShell>
    </>
  );
}

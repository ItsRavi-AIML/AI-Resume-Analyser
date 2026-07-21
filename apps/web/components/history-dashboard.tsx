"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Calendar, GitCompareArrows, Loader2, Search, Trash2 } from "lucide-react";
import { compareAnalyses, deleteAnalysis, fetchAnalyses } from "@/lib/api";
import type { AnalysisComparison, AnalysisSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Skeleton } from "@/components/ui/skeleton";

export function HistoryDashboard() {
  const [items, setItems] = useState<AnalysisSummary[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [comparison, setComparison] = useState<AnalysisComparison | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void loadHistory();
  }, []);

  async function loadHistory() {
    setLoading(true);
    setError("");
    try {
      setItems(await fetchAnalyses());
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Could not load history");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => `${item.file_name} ${item.top_missing_keywords.join(" ")}`.toLowerCase().includes(needle));
  }, [items, query]);

  function toggleSelected(id: string) {
    setComparison(null);
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      return [...current.slice(-1), id];
    });
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    setError("");
    try {
      await deleteAnalysis(id);
      setItems((current) => current.filter((item) => item.analysis_id !== id));
      setSelected((current) => current.filter((item) => item !== id));
      setComparison(null);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Could not delete analysis");
    } finally {
      setBusyId("");
    }
  }

  async function handleCompare() {
    if (selected.length !== 2) return;
    setError("");
    try {
      setComparison(await compareAnalyses(selected as [string, string]));
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Could not compare analyses");
    }
  }

  if (loading) {
    return (
      <div className="grid gap-5">
        <Skeleton className="h-20" />
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Panel className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-11 w-full rounded-md border border-line bg-black/30 pl-10 pr-3 text-sm outline-none ring-brand/30 transition hover:border-white/18 focus:border-brand/45 focus:ring-4"
            placeholder="Search by file name or missing keyword"
          />
        </div>
        <Button onClick={handleCompare} disabled={selected.length !== 2} variant="secondary">
          <GitCompareArrows size={17} />
          Compare selected
        </Button>
      </Panel>

      {error && <div className="rounded-md border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">{error}</div>}

      {filtered.length === 0 ? (
        <Panel className="py-12 text-center">
          <h2 className="text-2xl font-semibold">No analyses yet</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">Run a resume analysis and it will appear here with comparison, viewing, and deletion controls.</p>
          <Button asChild className="mt-6">
            <Link href="/upload">Analyze resume</Link>
          </Button>
        </Panel>
      ) : (
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }} className="grid gap-4">
          {filtered.map((item) => (
            <HistoryCard
              key={item.analysis_id}
              item={item}
              selected={selected.includes(item.analysis_id)}
              busy={busyId === item.analysis_id}
              onToggle={() => toggleSelected(item.analysis_id)}
              onDelete={() => handleDelete(item.analysis_id)}
            />
          ))}
        </motion.div>
      )}

      {comparison && <ComparisonPanel comparison={comparison} />}
    </div>
  );
}

function HistoryCard({ item, selected, busy, onToggle, onDelete }: { item: AnalysisSummary; selected: boolean; busy: boolean; onToggle: () => void; onDelete: () => void }) {
  const href = `/history/${item.analysis_id}` as Route;
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
      <Panel className={`p-4 transition ${selected ? "border-brand/55 bg-brand/[0.075]" : ""}`}>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={onToggle} className={`h-5 w-5 rounded border transition ${selected ? "border-brand bg-brand" : "border-line bg-white/[0.04] hover:border-brand/50"}`} aria-label="Select analysis for comparison" />
              <h2 className="break-all text-lg font-semibold">{item.file_name}</h2>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1"><Calendar size={14} /> {new Date(item.created_at).toLocaleString()}</span>
              <span>{item.missing_keyword_count} missing keywords</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.top_missing_keywords.length ? item.top_missing_keywords.map((keyword) => (
                <span key={keyword} className="rounded-md border border-line bg-white/[0.04] px-2.5 py-1 text-xs text-muted">{keyword}</span>
              )) : <span className="rounded-md border border-brand/30 bg-brand/10 px-2.5 py-1 text-xs text-brand">No major keyword gaps</span>}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[380px]">
            <MiniScore label="ATS" value={item.ats_score} />
            <MiniScore label="Skills" value={item.skill_match} />
            <MiniScore label="Semantic" value={item.semantic_similarity} />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
          <Button asChild variant="secondary" className="h-10">
            <Link href={href}>
              View analysis
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button onClick={onDelete} disabled={busy} variant="ghost" className="h-10 text-rose hover:text-rose">
            {busy ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
            Delete
          </Button>
        </div>
      </Panel>
    </motion.div>
  );
}

function MiniScore({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-black/20 p-3">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-brand to-cyan" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ComparisonPanel({ comparison }: { comparison: AnalysisComparison }) {
  return (
    <Panel className="p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-brand/10">
          <BarChart3 className="text-brand" size={19} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Comparison mode</h2>
          <p className="text-sm text-muted">{comparison.recommendation}</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {comparison.score_deltas.map((score) => (
          <div key={score.metric} className="rounded-md border border-line bg-white/[0.035] p-4">
            <div className="text-sm text-muted">{score.metric}</div>
            <div className="mt-2 text-2xl font-semibold">{score.second}</div>
            <div className={score.delta >= 0 ? "mt-1 text-sm text-brand" : "mt-1 text-sm text-rose"}>
              {score.delta >= 0 ? "+" : ""}{score.delta} vs first
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <KeywordGroup title="Gained keywords" items={comparison.gained_keywords} tone="brand" />
        <KeywordGroup title="New gaps" items={comparison.lost_keywords} tone="rose" />
        <KeywordGroup title="Shared matches" items={comparison.shared_keywords} tone="cyan" />
      </div>
    </Panel>
  );
}

function KeywordGroup({ title, items, tone }: { title: string; items: string[]; tone: "brand" | "rose" | "cyan" }) {
  const toneClass = tone === "brand" ? "text-brand border-brand/30 bg-brand/10" : tone === "rose" ? "text-rose border-rose/30 bg-rose/10" : "text-cyan border-cyan/30 bg-cyan/10";
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-muted">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.length ? items.map((item) => (
          <span key={item} className={`rounded-md border px-2.5 py-1 text-xs ${toneClass}`}>{item}</span>
        )) : <span className="text-sm text-muted">None</span>}
      </div>
    </div>
  );
}

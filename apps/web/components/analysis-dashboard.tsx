"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Download, FileText, ShieldCheck, Sparkles, Target, Wand2 } from "lucide-react";
import type { Analysis } from "@/lib/types";
import { downloadReport } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { RadarAnalysis, SkillGapChart } from "@/components/analysis-charts";
import { ScoreGauge } from "@/components/score-gauge";

export function AnalysisDashboard({ analysis }: { analysis: Analysis }) {
  const [toast, setToast] = useState("");
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const markdown = await downloadReport(analysis.analysis_id);
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume-analysis-report.md";
      link.click();
      URL.revokeObjectURL(url);
      setToast("Report downloaded");
    } catch {
      setToast("Report unavailable for demo data");
    } finally {
      setDownloading(false);
      window.setTimeout(() => setToast(""), 2600);
    }
  }

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055 } } }} className="space-y-5">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-5 right-5 z-50 rounded-md border border-line bg-[#11131a]/95 px-4 py-3 text-sm shadow-panel backdrop-blur-xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <MotionPanel>
          <ScoreGauge score={analysis.scores.ats} />
          <Button onClick={handleDownload} disabled={downloading} variant="secondary" className="mt-3 w-full">
            <Download size={17} className={downloading ? "animate-bounce" : ""} />
            {downloading ? "Preparing report" : "Download report"}
          </Button>
        </MotionPanel>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Metric icon={Target} label="Skill Match" value={`${analysis.scores.skill_match}%`} />
          <Metric icon={Sparkles} label="Semantic Match" value={`${analysis.scores.semantic_similarity}%`} />
          <Metric icon={ShieldCheck} label="Recruiter Score" value={analysis.scores.recruiter_impression.toString()} />
          <Metric icon={Wand2} label="Experience" value={analysis.scores.experience_relevance.toString()} />
          <Metric icon={ShieldCheck} label="Formatting" value={analysis.scores.formatting_quality.toString()} />
          <Metric icon={Sparkles} label="Readability" value={analysis.scores.readability.toString()} />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <MotionPanel>
          <PanelTitle title="Radar analysis" copy="Weighted scoring across recruiter and ATS signals" />
          <RadarAnalysis analysis={analysis} />
        </MotionPanel>
        <MotionPanel>
          <PanelTitle title="Skill gap visualization" copy="Matched capabilities versus job description gaps" />
          <SkillGapChart analysis={analysis} />
        </MotionPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <InsightList title="Strengths" items={analysis.strengths} />
        <InsightList title="Weaknesses" items={analysis.weaknesses} />
        <InsightList title="AI Suggestions" items={analysis.recommendations} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <MotionPanel>
          <PanelTitle title="Resume heatmap" copy="Line-level relevance signals from the parsed resume" />
          <div className="space-y-3">
            {analysis.heatmap.map((item) => (
              <motion.div whileHover={{ x: 4 }} key={item.line} className="rounded-md border border-line bg-white/[0.03] p-3 transition hover:border-brand/35 hover:bg-brand/[0.045]">
                <div className="mb-2 flex items-center justify-between text-xs text-muted">
                  <span>Line {item.line}</span>
                  <span>{item.score}% relevance</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.score}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-brand to-cyan" />
                </div>
                <p className="mt-3 text-sm leading-6 text-white/85">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </MotionPanel>
        <MotionPanel>
          <PanelTitle title="Improved bullets" copy="Generated examples with stronger action and measurable impact" />
          <div className="space-y-3">
            {analysis.improved_bullets.map((bullet) => (
              <motion.p whileHover={{ y: -2 }} key={bullet} className="rounded-md border border-line bg-black/20 p-3 text-sm leading-6 text-white/85 transition hover:border-cyan/30 hover:bg-cyan/[0.045]">{bullet}</motion.p>
            ))}
          </div>
          <h3 className="mb-3 mt-6 text-sm font-medium text-muted">Suggested skills</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.suggested_skills.map((skill) => (
              <span key={skill} className="rounded-md border border-line bg-white/[0.04] px-3 py-1.5 text-xs transition hover:-translate-y-0.5 hover:border-brand/40 hover:text-brand">{skill}</span>
            ))}
          </div>
        </MotionPanel>
      </div>
    </motion.div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Sparkles; label: string; value: string }) {
  return (
    <MotionPanel className="group p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white/[0.05] transition group-hover:border-brand/40 group-hover:bg-brand/10">
        <Icon size={18} className="text-brand" />
      </div>
      <div className="mt-5 text-3xl font-semibold tracking-normal">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.min(Number.parseInt(value, 10) || 0, 100)}%` }} viewport={{ once: true }} transition={{ duration: 0.85, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-brand via-cyan to-amber" />
      </div>
    </MotionPanel>
  );
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <MotionPanel>
      <PanelTitle title={title} />
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} key={item} className="flex gap-3 rounded-md border border-line bg-white/[0.035] p-3 text-sm leading-6 text-white/85 transition hover:border-white/20 hover:bg-white/[0.06]">
            {title === "Weaknesses" ? <AlertTriangle className="mt-0.5 shrink-0 text-amber" size={16} /> : <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={16} />}
            <span>{item}</span>
          </motion.p>
        ))}
      </div>
    </MotionPanel>
  );
}

function PanelTitle({ title, copy }: { title: string; copy?: string }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-white/[0.05]">
        <FileText size={15} className="text-cyan" />
      </div>
      <div>
        <h2 className="text-lg font-semibold tracking-normal">{title}</h2>
        {copy && <p className="mt-1 text-xs leading-5 text-muted">{copy}</p>}
      </div>
    </div>
  );
}

function MotionPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.42, ease: "easeOut" }}>
      <Panel className={className}>{children}</Panel>
    </motion.div>
  );
}

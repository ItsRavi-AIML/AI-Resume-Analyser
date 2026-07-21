import { CheckCircle2, FileText, Sparkles, Target } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { PageShell, SectionHeader } from "@/components/ui/page-shell";
import { Panel } from "@/components/ui/panel";

const tips = [
  { icon: Target, title: "Match intent, not just words", copy: "Use the job description's nouns and responsibilities, then support them with evidence from your real work." },
  { icon: Sparkles, title: "Rewrite for impact", copy: "Lead with action, include scope, and end with measurable outcomes such as revenue, latency, accuracy, adoption, or time saved." },
  { icon: FileText, title: "Keep ATS structure simple", copy: "Use conventional headings, avoid tables for critical content, and make skills easy to parse." },
  { icon: CheckCircle2, title: "Build versions", copy: "Keep role-specific resume versions and compare how each one performs against different job descriptions." }
];

export default function TipsPage() {
  return (
    <>
      <Navigation />
      <PageShell>
        <SectionHeader eyebrow="Playbook" title="Resume optimization tips" copy="Practical guidance for improving ATS score, recruiter clarity, and interview conversion." />
        <div className="grid gap-5 md:grid-cols-2">
          {tips.map((tip) => (
            <Panel key={tip.title} className="group">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white/[0.05] transition group-hover:border-brand/40 group-hover:bg-brand/10">
                <tip.icon className="text-brand" size={22} />
              </div>
              <h2 className="mt-5 text-xl font-semibold">{tip.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{tip.copy}</p>
            </Panel>
          ))}
        </div>
      </PageShell>
    </>
  );
}

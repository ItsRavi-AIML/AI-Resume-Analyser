"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BrainCircuit, FileSearch, Gauge, Sparkles } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ScoreGauge } from "@/components/score-gauge";

const features = [
  { icon: FileSearch, title: "Resume parsing", copy: "Extract PDF and DOCX content, sections, bullets, skills, metrics, and formatting signals." },
  { icon: BrainCircuit, title: "AI recommendations", copy: "LLM-ready suggestions, rewritten bullets, skill gaps, grammar checks, and ATS optimization." },
  { icon: BarChart3, title: "Recruiter dashboard", copy: "Radar charts, semantic match, heatmap, missing keywords, and downloadable reports." }
];

export default function LandingPage() {
  return (
    <>
      <Navigation />
      <main>
        <section className="metric-grid relative overflow-hidden">
          <div className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-line bg-white/[0.05] px-3 py-2 text-sm text-muted">
                <Sparkles size={16} className="text-brand" />
                AI-powered ATS intelligence for serious job seekers
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-6xl lg:text-7xl">
                Resumind AI
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                Upload a resume, paste a job description, and get a recruiter-grade analysis with ATS scoring, semantic fit, missing keywords, stronger bullets, and a downloadable improvement plan.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-12 px-5">
                  <Link href="/upload">
                    Analyze resume
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="h-12 px-5">
                  <Link href="/dashboard">View dashboard</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} whileHover={{ y: -4 }}>
              <Panel className="relative overflow-hidden p-5">
                <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                  <div>
                    <ScoreGauge score={86} />
                  </div>
                  <div className="space-y-3">
                    {["Semantic match 91%", "Missing keywords 6", "Recruiter impression 88", "Formatting quality 94"].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.08 }}
                        whileHover={{ x: 4 }}
                        className="rounded-md border border-line bg-white/[0.04] p-4 transition hover:border-brand/35 hover:bg-brand/[0.05]"
                      >
                        <div className="flex items-center gap-3 text-sm">
                          <Gauge size={17} className="text-brand" />
                          {item}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Panel>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 lg:grid-cols-3">
          {features.map((feature) => (
            <Panel key={feature.title} className="group">
              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white/[0.05] transition group-hover:border-brand/40 group-hover:bg-brand/10">
                <feature.icon className="text-brand" size={23} />
              </div>
              <h2 className="mt-5 text-xl font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{feature.copy}</p>
            </Panel>
          ))}
        </section>
      </main>
    </>
  );
}

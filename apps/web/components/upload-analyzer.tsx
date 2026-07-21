"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, FileText, Loader2, UploadCloud } from "lucide-react";
import { analyzeResume } from "@/lib/api";
import type { Analysis } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { DashboardSkeleton } from "@/components/ui/skeleton";

export function UploadAnalyzer({ onAnalysis }: { onAnalysis: (analysis: Analysis) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    maxFiles: 1,
    onDrop: (accepted) => {
      setError("");
      setFile(accepted[0] ?? null);
    }
  });

  async function handleAnalyze() {
    if (!file || jobDescription.trim().length < 80) {
      setError("Upload a resume and paste a detailed job description.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await analyzeResume(file, jobDescription);
      onAnalysis(result);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Panel className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}>
          <div
            {...getRootProps()}
            className={`group flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition duration-300 ${
              isDragActive ? "border-brand bg-brand/10 shadow-glow" : "border-line bg-white/[0.03] hover:border-brand/40 hover:bg-white/[0.06]"
            }`}
          >
            <input {...getInputProps()} />
            <motion.div animate={{ y: isDragActive ? -8 : 0, scale: isDragActive ? 1.07 : 1 }} className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg border border-line bg-white/[0.05] transition group-hover:border-brand/40 group-hover:bg-brand/10">
              <UploadCloud className="text-brand" size={34} />
            </motion.div>
            <h2 className="text-xl font-semibold tracking-normal">Drop your resume</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">PDF or DOCX. The analyzer extracts text, detects structure, and compares it against the target role.</p>
            <AnimatePresence>
              {file && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 flex max-w-full items-center gap-2 rounded-md border border-line bg-black/20 px-3 py-2 text-sm">
                  <FileText size={16} className="text-cyan" />
                  <span className="truncate">{file.name}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-medium text-muted">Target job description</label>
            <span className="text-xs text-muted">{jobDescription.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            className="min-h-[280px] resize-none rounded-lg border border-line bg-black/30 p-4 text-sm leading-6 outline-none ring-brand/30 transition placeholder:text-muted/60 hover:border-white/18 focus:border-brand/45 focus:ring-4"
            placeholder="Paste the complete job description here..."
          />
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-md border border-rose/30 bg-rose/10 px-3 py-2 text-sm text-rose">
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <Button onClick={handleAnalyze} disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
            {loading ? "Analyzing resume" : "Run AI analysis"}
          </Button>
        </div>
      </Panel>
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <DashboardSkeleton />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

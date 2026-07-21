"use client";

import { motion } from "framer-motion";

export function ScoreGauge({ score, label = "ATS Score" }: { score: number; label?: string }) {
  const circumference = 2 * Math.PI * 70;
  const progress = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex aspect-square min-h-[220px] items-center justify-center">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r="70" stroke="rgba(255,255,255,0.1)" strokeWidth="14" fill="none" />
        <motion.circle
          cx="90"
          cy="90"
          r="70"
          stroke="url(#scoreGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progress }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#39e6b5" />
            <stop offset="55%" stopColor="#5cc8ff" />
            <stop offset="100%" stopColor="#ffcc66" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-5xl font-semibold tracking-normal">{score}</div>
        <div className="mt-2 text-sm text-muted">{label}</div>
      </div>
    </div>
  );
}

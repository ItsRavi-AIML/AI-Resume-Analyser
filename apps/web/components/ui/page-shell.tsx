"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 ${className}`}
    >
      {children}
    </motion.main>
  );
}

export function SectionHeader({ eyebrow, title, copy, action }: { eyebrow?: string; title: string; copy?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div className="max-w-3xl">
        {eyebrow && <p className="text-sm font-medium text-brand">{eyebrow}</p>}
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white sm:text-4xl lg:text-5xl">{title}</h1>
        {copy && <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base sm:leading-7">{copy}</p>}
      </div>
      {action}
    </div>
  );
}

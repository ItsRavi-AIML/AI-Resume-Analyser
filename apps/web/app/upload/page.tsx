"use client";

import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { UploadAnalyzer } from "@/components/upload-analyzer";
import { PageShell, SectionHeader } from "@/components/ui/page-shell";
import type { Analysis } from "@/lib/types";

export default function UploadPage() {
  const router = useRouter();

  function handleAnalysis(analysis: Analysis) {
    sessionStorage.setItem("latest-analysis", JSON.stringify(analysis));
    router.push("/results");
  }

  return (
    <>
      <Navigation />
      <PageShell>
        <SectionHeader
          eyebrow="Upload workspace"
          title="Analyze a resume"
          copy="Upload a resume and compare it against a real job description for ATS, semantic, keyword, and recruiter-fit insights."
        />
        <UploadAnalyzer onAnalysis={handleAnalysis} />
      </PageShell>
    </>
  );
}

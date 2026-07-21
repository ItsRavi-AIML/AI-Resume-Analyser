import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { HistoryDashboard } from "@/components/history-dashboard";
import { Button } from "@/components/ui/button";
import { PageShell, SectionHeader } from "@/components/ui/page-shell";

export default function HistoryPage() {
  return (
    <>
      <Navigation />
      <PageShell>
        <SectionHeader
          eyebrow="Resume history"
          title="Past analyses"
          copy="Review every saved resume analysis, open previous reports, delete outdated entries, and compare two versions side by side."
          action={
            <Button asChild>
              <Link href="/upload">Analyze new resume</Link>
            </Button>
          }
        />
        <HistoryDashboard />
      </PageShell>
    </>
  );
}

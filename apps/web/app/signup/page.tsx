import { Navigation } from "@/components/navigation";
import { AuthForm } from "@/components/auth-form";
import { PageShell } from "@/components/ui/page-shell";

export default function SignupPage() {
  return (
    <>
      <Navigation />
      <PageShell className="flex min-h-[calc(100vh-68px)] items-center justify-center">
        <AuthForm mode="signup" />
      </PageShell>
    </>
  );
}

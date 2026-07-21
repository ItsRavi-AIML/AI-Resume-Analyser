"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, Chrome, Loader2, Mail, Sparkles } from "lucide-react";
import { authenticate } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    try {
      const result = await authenticate(mode, {
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? "")
      });
      document.cookie = `resume-ai-token=${result.access_token}; path=/; max-age=86400; SameSite=Lax`;
      router.push("/dashboard");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <Panel className="w-full max-w-md p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-md border border-line bg-brand/10">
        <Sparkles className="text-brand" />
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-normal">{isSignup ? "Create your workspace" : "Welcome back"}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        {isSignup ? "Track resume versions, reports, cover letters, and interview prep in one place." : "Sign in to manage resume history, comparisons, recruiter mode, and saved reports."}
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-3">
        {isSignup && <input name="name" className="h-11 w-full rounded-md border border-line bg-black/30 px-3 text-sm outline-none ring-brand/30 transition hover:border-white/18 focus:border-brand/45 focus:ring-4" placeholder="Name" required />}
        <input name="email" className="h-11 w-full rounded-md border border-line bg-black/30 px-3 text-sm outline-none ring-brand/30 transition hover:border-white/18 focus:border-brand/45 focus:ring-4" placeholder="Email" type="email" required />
        <input name="password" className="h-11 w-full rounded-md border border-line bg-black/30 px-3 text-sm outline-none ring-brand/30 transition hover:border-white/18 focus:border-brand/45 focus:ring-4" placeholder="Password" type="password" minLength={8} required />
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-rose/30 bg-rose/10 px-3 py-2 text-sm text-rose">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        <Button className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" size={17} /> : <Mail size={17} />}
          {isSignup ? "Create account" : "Continue with email"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          disabled={googleLoading}
          onClick={async () => {
            setGoogleLoading(true);
            setError("");
            await signIn("google", { callbackUrl: "/dashboard" });
          }}
        >
          {googleLoading ? <Loader2 className="animate-spin" size={17} /> : <Chrome size={17} />}
          {googleLoading ? "Opening Google" : "Continue with Google"}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        {isSignup ? "Already have an account?" : "New here?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"} className="text-brand">
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </Panel>
  );
}

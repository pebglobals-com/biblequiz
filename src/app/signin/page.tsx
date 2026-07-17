"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [banner, setBanner] = useState("");

  useEffect(() => {
    if (searchParams.get("verified") === "1") {
      setBanner("Email verified! You can now sign in.");
    } else if (searchParams.get("error") === "invalid_token") {
      setBanner("This verification link is invalid or has expired.");
    } else if (searchParams.get("error") === "missing_token") {
      setBanner("Missing verification token.");
    } else if (searchParams.get("error") === "server_error") {
      setBanner("Something went wrong. Please try signing up again.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setApiError("Please enter your email");
      return;
    }
    setLoading(true);
    setApiError("");
    setNeedsVerification(false);
    try {
      const res = await fetch("/api/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.needsVerification) {
          setNeedsVerification(true);
          setApiError(data.error);
        } else {
          setApiError(data.error || "Sign in failed");
        }
        return;
      }
      localStorage.setItem("userId", String(data.userId));
      localStorage.setItem("ageBracket", data.ageBracket);
      router.push(`/${data.ageBracket}/dashboard`);
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email.trim()) return;
    setResending(true);
    setResendMsg("");
    try {
      const res = await fetch("/api/users/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResendMsg(data.error || "Failed to resend");
        return;
      }
      setResendMsg("Verification email sent! Check your inbox.");
    } catch {
      setResendMsg("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <Link href="/" className="inline-flex items-center gap-2 text-ink-light hover:text-ink transition-colors mb-8 group">
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mb-2">Welcome back</h1>
          <p className="text-ink-muted text-sm">Enter your email to sign in</p>
        </div>

        {banner && (
          <div className="mb-6 p-4 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 text-sm text-center">
            {banner}
          </div>
        )}

        {apiError && (
          <div className={`mb-6 p-4 rounded-xl text-sm text-center ${
            needsVerification
              ? "bg-amber-50 border border-amber-200 text-amber-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}>
            <p>{apiError}</p>
            {needsVerification && (
              <button
                onClick={handleResend}
                disabled={resending}
                className="mt-3 text-brand-600 font-semibold hover:text-brand-700 underline underline-offset-2"
              >
                {resending ? "Sending..." : "Resend verification email"}
              </button>
            )}
            {needsVerification && resendMsg && (
              <p className="text-sm mt-2 text-green-700">{resendMsg}</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setApiError(""); }}
              className="w-full px-4 py-3 rounded-xl border border-surface-border bg-surface-card text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-lg rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-ink-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-600 font-semibold hover:text-brand-700 underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 -z-10 bg-surface">
        <div className="absolute inset-0 bg-dots-light" />
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
      </div>
      <Suspense fallback={
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-8 sm:p-10">
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-brand-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </div>
        </div>
      }>
        <SignInForm />
      </Suspense>
    </div>
  );
}

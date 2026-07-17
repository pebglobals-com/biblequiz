"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    branch: "",
    phone: "",
    email: "",
    age_bracket: "junior" as "junior" | "senior",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  function validate() {
    const e: Record<string, string> = {};
    if (!form.first_name.trim()) e.first_name = "First name is required";
    if (!form.last_name.trim()) e.last_name = "Last name is required";
    if (!form.branch.trim()) e.branch = "Branch is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (form.phone && !/^[\d\s\-+()]{7,}$/.test(form.phone)) e.phone = "Invalid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || "Signup failed");
        return;
      }
      setSubmittedEmail(form.email);
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!submittedEmail) return;
    setResending(true);
    setResendMsg("");
    try {
      const res = await fetch("/api/users/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: submittedEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResendMsg(data.error || "Failed to resend");
        return;
      }
      setResendMsg("Verification email resent!");
    } catch {
      setResendMsg("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  if (submittedEmail) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="fixed inset-0 -z-10 bg-surface">
          <div className="absolute inset-0 bg-dots-light" />
          <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
        </div>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-8 sm:p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-bold text-ink mb-2">Check your email</h1>
            <p className="text-ink-muted text-sm mb-6">
              We sent a verification link to <span className="font-semibold text-ink">{submittedEmail}</span>
            </p>
            <div className="bg-brand-50 rounded-xl p-4 mb-6 text-sm text-brand-700 border border-brand-100">
              <p className="font-semibold mb-1">Didn&apos;t receive the email?</p>
              <p>Check your spam folder, or click below to resend.</p>
            </div>
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? "Sending..." : "Resend verification email"}
            </button>
            {resendMsg && (
              <p className={`text-sm mt-3 ${resendMsg === "Verification email resent!" ? "text-green-700" : "text-red-600"}`}>
                {resendMsg}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 -z-10 bg-surface">
        <div className="absolute inset-0 bg-dots-light" />
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
      </div>

      <div className="w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2 text-ink-light hover:text-ink transition-colors mb-8 group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-ink mb-2">
              Join <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">Bible Quiz</span>
            </h1>
            <p className="text-ink-muted text-sm">Start your faith journey today</p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">First Name</label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => update("first_name", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border bg-surface-card text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200 ${errors.first_name ? "ring-2 ring-red-500 border-red-500" : "border-surface-border"}`}
                  placeholder="John"
                />
                {errors.first_name && <p className="text-red-600 text-xs mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => update("last_name", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border bg-surface-card text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200 ${errors.last_name ? "ring-2 ring-red-500 border-red-500" : "border-surface-border"}`}
                  placeholder="Doe"
                />
                {errors.last_name && <p className="text-red-600 text-xs mt-1">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Branch</label>
              <input
                type="text"
                value={form.branch}
                onChange={(e) => update("branch", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border bg-surface-card text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200 ${errors.branch ? "ring-2 ring-red-500 border-red-500" : "border-surface-border"}`}
                placeholder="Your church branch"
              />
              {errors.branch && <p className="text-red-600 text-xs mt-1">{errors.branch}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border bg-surface-card text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200 ${errors.email ? "ring-2 ring-red-500 border-red-500" : "border-surface-border"}`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border bg-surface-card text-ink placeholder:text-ink-light focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all duration-200 ${errors.phone ? "ring-2 ring-red-500 border-red-500" : "border-surface-border"}`}
                  placeholder="+1234567890"
                />
                {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-3">Age Category</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => update("age_bracket", "junior")}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                    form.age_bracket === "junior"
                      ? "border-brand-500 bg-brand-50 shadow-sm"
                      : "border-surface-border bg-white hover:border-ink-light"
                  }`}
                >
                  <div className="text-2xl mb-1">🧒</div>
                  <div className={`font-semibold text-sm ${form.age_bracket === "junior" ? "text-brand-700" : "text-ink-muted"}`}>
                    Junior Category
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => update("age_bracket", "senior")}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                    form.age_bracket === "senior"
                      ? "border-brand-500 bg-brand-50 shadow-sm"
                      : "border-surface-border bg-white hover:border-ink-light"
                  }`}
                >
                  <div className="text-2xl mb-1">🧑</div>
                  <div className={`font-semibold text-sm ${form.age_bracket === "senior" ? "text-brand-700" : "text-ink-muted"}`}>
                    Senior Category
                  </div>
                </button>
              </div>
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
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Start Learning
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

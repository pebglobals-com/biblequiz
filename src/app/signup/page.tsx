"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
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
      localStorage.setItem("userId", String(data.userId));
      localStorage.setItem("ageBracket", data.ageBracket);
      router.push(`/${data.ageBracket}/dashboard`);
    } catch {
      setApiError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0b1120]" />
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] rounded-full bg-gradient-radial from-bible-500/15 to-transparent blur-3xl" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] rounded-full bg-gradient-radial from-purple-500/15 to-transparent blur-3xl" />
      </div>

      <div className="w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className="glass rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">📖</div>
            <h1 className="text-3xl font-extrabold text-white mb-2">
              Join <span className="bg-gradient-to-r from-bible-400 to-purple-400 bg-clip-text text-transparent">Bible Quiz</span>
            </h1>
            <p className="text-gray-400">Start your faith journey today</p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => update("first_name", e.target.value)}
                  className={`input-field ${errors.first_name ? "ring-2 ring-red-500" : ""}`}
                  placeholder="John"
                />
                {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => update("last_name", e.target.value)}
                  className={`input-field ${errors.last_name ? "ring-2 ring-red-500" : ""}`}
                  placeholder="Doe"
                />
                {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Branch</label>
              <input
                type="text"
                value={form.branch}
                onChange={(e) => update("branch", e.target.value)}
                className={`input-field ${errors.branch ? "ring-2 ring-red-500" : ""}`}
                placeholder="Your church branch"
              />
              {errors.branch && <p className="text-red-400 text-xs mt-1">{errors.branch}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={`input-field ${errors.email ? "ring-2 ring-red-500" : ""}`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={`input-field ${errors.phone ? "ring-2 ring-red-500" : ""}`}
                  placeholder="+1234567890"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Age Category</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => update("age_bracket", "junior")}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                    form.age_bracket === "junior"
                      ? "border-bible-500 bg-gradient-to-r from-bible-500/20 to-purple-500/20 shadow-lg shadow-bible-500/10"
                      : "border-white/5 glass hover:border-white/20"
                  }`}
                >
                  <div className="text-2xl mb-1">🧒</div>
                  <div className={`font-semibold text-sm ${form.age_bracket === "junior" ? "text-white" : "text-gray-400"}`}>
                    Junior Category
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => update("age_bracket", "senior")}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                    form.age_bracket === "senior"
                      ? "border-bible-500 bg-gradient-to-r from-bible-500/20 to-purple-500/20 shadow-lg shadow-bible-500/10"
                      : "border-white/5 glass hover:border-white/20"
                  }`}
                >
                  <div className="text-2xl mb-1">🧑</div>
                  <div className={`font-semibold text-sm ${form.age_bracket === "senior" ? "text-white" : "text-gray-400"}`}>
                    Senior Category
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-bible-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-bible-600/25 hover:shadow-bible-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

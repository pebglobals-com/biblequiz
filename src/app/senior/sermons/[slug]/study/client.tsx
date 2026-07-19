"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SermonData {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  age_bracket: string;
  created_at: string;
}

export default function SeniorStudyClient({ slug }: { slug: string }) {
  const router = useRouter();

  const [userId, setUserId] = useState<number | null>(null);
  const [sermon, setSermon] = useState<SermonData | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [marking, setMarking] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    if (!uid) {
      router.push("/signup");
      return;
    }
    setUserId(Number(uid));
  }, [router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/sermons?age=senior");
        const data = await res.json();
        const found = (data.sermons || []).find((s: SermonData) => s.slug === slug);
        setSermon(found || null);

        if (found && userId) {
          const progRes = await fetch(`/api/users/${userId}/progress`);
          const progData = await progRes.json();
          const prog = (progData.progress || []).find(
            (p: any) => p.sermon_id === found.id && p.completed
          );
          if (prog) setAlreadyCompleted(true);
        }
      } catch (err) {
        console.error("Failed to load sermon:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, userId]);

  async function markComplete() {
    if (!sermon || !userId || marking) return;
    setMarking(true);
    try {
      const res = await fetch(`/api/users/${userId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sermonId: sermon.id, completed: 1 }),
      });
      if (res.ok) {
        setDone(true);
        setAlreadyCompleted(true);
      }
    } catch (err) {
      console.error("Failed to mark complete:", err);
    } finally {
      setMarking(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="skeleton h-5 w-40 mb-6" />
          <div className="skeleton h-64 rounded-2xl mb-4" />
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-2xl font-bold text-ink mb-2">Topic Not Found</h1>
          <p className="text-ink-muted mb-6">This topic doesn&apos;t exist or has been moved.</p>
          <Link href="/senior/dashboard" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const bracket = "senior";

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 -z-10 bg-surface">
        <div className="absolute inset-0 bg-dots-light" />
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href={`/${bracket}/dashboard`}
          className="inline-flex items-center gap-2 text-ink-muted hover:text-brand-600 transition-colors mb-6 group animate-in"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <article className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden animate-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <div className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-8 sm:p-12">
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                  {sermon.category}
                </span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                  🧑 Senior
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                {sermon.title}
              </h1>
              <p className="mt-3 text-white/70 text-sm">
                {new Date(sermon.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="space-y-6 text-ink leading-relaxed text-lg font-sans">
              {sermon.content.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-surface-border">
              {done || alreadyCompleted ? (
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-green-50 border border-green-200">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-green-800 font-bold text-lg">
                        {done ? "Completed!" : "Already Completed"}
                      </p>
                      <p className="text-green-600 text-sm">Great job studying God&apos;s Word!</p>
                    </div>
                  </div>
                  <div>
                    <Link
                      href={`/${bracket}/dashboard`}
                      className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={markComplete}
                    disabled={marking}
                    className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {marking ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Marking...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Mark as Complete
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

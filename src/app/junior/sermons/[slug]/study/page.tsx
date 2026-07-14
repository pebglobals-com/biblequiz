"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function JuniorStudyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

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
        const res = await fetch("/api/sermons?age=junior");
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
      <div className="min-h-screen bg-[#0b1120]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="skeleton h-5 w-40 mb-6" />
          <div className="skeleton h-64 rounded-3xl mb-4" />
          <div className="skeleton h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-2xl font-bold text-white mb-2">Sermon Not Found</h1>
          <p className="text-gray-400 mb-6">This sermon doesn&apos;t exist or has been moved.</p>
          <Link href="/junior/dashboard" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const bracket = "junior";

  return (
    <div className="min-h-screen bg-[#0b1120] relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-gradient-radial from-bible-500/10 to-transparent blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href={`/${bracket}/dashboard`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group animate-in"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <article className="glass rounded-3xl overflow-hidden border border-white/5 animate-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <div className="relative bg-gradient-to-br from-bible-600 via-purple-600 to-bible-700 p-8 sm:p-12">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                  {sermon.category}
                </span>
                <span className="px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-sm font-medium text-blue-200">
                  🧒 Junior
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
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
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              {sermon.content.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {/* Completion section */}
            <div className="mt-12 pt-8 border-t border-white/5">
              {done || alreadyCompleted ? (
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-emerald-300 font-bold text-lg">
                        {done ? "Completed!" : "Already Completed"}
                      </p>
                      <p className="text-emerald-400/70 text-sm">Great job studying God&apos;s Word!</p>
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
                    className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

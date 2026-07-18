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
}

interface ProgressData {
  sermon_id: number;
  completed: number;
  questions_done: number;
}

export default function SeniorDashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [sermons, setSermons] = useState<SermonData[]>([]);
  const [progress, setProgress] = useState<ProgressData[]>([]);
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
    if (!userId) return;
    async function fetchData() {
      try {
        const [sermonsRes, progressRes] = await Promise.all([
          fetch("/api/sermons?age=senior"),
          fetch(`/api/users/${userId}/progress`),
        ]);
        const sermonsData = await sermonsRes.json();
        const progressData = await progressRes.json();
        setSermons(sermonsData.sermons || []);
        setProgress(progressData.progress || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const progMap = new Map(progress.map((p) => [p.sermon_id, p]));
  const completedCount = sermons.filter((s) => progMap.get(s.id)?.completed).length;
  const allDone = sermons.length > 0 && completedCount === sermons.length;
  const bracket = "senior";

  function getProg(sermonId: number) {
    return progMap.get(sermonId);
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-surface">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="skeleton-title mb-8" />
          <div className="skeleton h-20 rounded-2xl mb-8" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl mb-4" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-surface">
        <div className="absolute inset-0 bg-dots-light" />
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-ink-light hover:text-ink transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                🧑 Senior Dashboard
              </h1>
              <p className="text-ink-muted text-sm mt-1">Study topics and prepare for the quiz</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-5 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 text-xl">
                📊
              </div>
              <div>
                <p className="text-2xl font-extrabold text-ink">{completedCount} of {sermons.length}</p>
                <p className="text-sm text-ink-muted">topics completed</p>
              </div>
            </div>
            <div className="w-full sm:w-48 h-3 rounded-full bg-brand-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
                style={{ width: sermons.length ? `${(completedCount / sermons.length) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {sermons.map((sermon, idx) => {
            const prog = getProg(sermon.id);
            const isCompleted = prog?.completed === 1;
            const quizReady = prog?.completed === 1 && prog?.questions_done === 1;
            return (
              <div
                key={sermon.id}
                className="bg-white rounded-2xl border border-surface-border shadow-sm p-5 hover:shadow-md hover:border-brand-200 transition-all duration-300"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display text-lg font-bold text-ink truncate">
                        {sermon.title}
                      </h3>
                      <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 font-medium">
                        {sermon.category}
                      </span>
                    </div>
                    <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed">
                      {sermon.content.slice(0, 150)}...
                    </p>
                  </div>
                  {isCompleted && (
                    <div className="shrink-0">
                      <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-surface-border">
                  <Link
                    href={`/${bracket}/sermons/${sermon.slug}/study`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Read Topic
                  </Link>
                  {quizReady ? (
                    <Link
                      href={`/quiz/play?age=${bracket}&ids=${sermon.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-700 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Take Quiz
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-muted text-ink-light font-semibold text-sm rounded-xl cursor-not-allowed">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Take Quiz
                    </span>
                  )}
                  <Link
                    href={`/${bracket}/questions/${sermon.id}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-surface-border text-ink-muted font-semibold text-sm rounded-xl hover:border-ink-light hover:text-ink transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                    </svg>
                    Study Q&A
                  </Link>
                </div>
              </div>
            );
          })}

          {sermons.length === 0 && (
            <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-ink-muted font-medium">No topics available yet</p>
              <p className="text-ink-light text-sm mt-1">Check back soon for new content</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-6 text-center">
          {allDone ? (
            <Link
              href={`/${bracket}/quiz`}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-700 text-white font-bold text-lg rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Quiz Challenge!
            </Link>
          ) : (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 text-brand-700 text-sm font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Complete all {sermons.length} topics to unlock the final quiz
              </div>
              <div className="w-full max-w-xs mx-auto h-2 rounded-full bg-brand-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
                  style={{ width: sermons.length ? `${(completedCount / sermons.length) * 100}%` : "0%" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SermonData {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt?: string;
  content: string;
  age_bracket: string;
}

interface ProgressData {
  sermon_id: number;
  completed: number;
}

export default function JuniorDashboard() {
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
          fetch("/api/sermons?age=junior"),
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

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.sermon_id));
  const completedCount = sermons.filter((s) => completedIds.has(s.id)).length;
  const allDone = sermons.length > 0 && completedCount === sermons.length;
  const bracket = "junior";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="skeleton-title mb-8" />
          <div className="skeleton h-20 rounded-2xl mb-8" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-24 rounded-2xl mb-4" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-radial from-bible-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-radial from-purple-500/10 to-transparent blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-in">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                🧒 Junior Dashboard
              </h1>
              <p className="text-gray-400 text-sm mt-1">Study sermons and prepare for the quiz</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="glass rounded-2xl p-5 border border-white/5 mb-8 animate-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bible-500 to-purple-500 flex items-center justify-center text-white text-xl">
                📊
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{completedCount} of {sermons.length}</p>
                <p className="text-sm text-gray-400">sermons completed</p>
              </div>
            </div>
            <div className="w-full sm:w-48 h-3 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-bible-500 to-purple-500 transition-all duration-500"
                style={{ width: sermons.length ? `${(completedCount / sermons.length) * 100}%` : "0%" }}
              />
            </div>
          </div>
        </div>

        {/* Sermon list */}
        <div className="space-y-4 mb-8">
          {sermons.map((sermon, idx) => {
            const isCompleted = completedIds.has(sermon.id);
            return (
              <Link
                key={sermon.id}
                href={`/${bracket}/sermons/${sermon.slug}/study`}
                className="block group"
              >
                <div
                  className={`glass rounded-2xl p-5 border transition-all duration-300 hover:border-bible-500/30 hover:shadow-lg hover:shadow-bible-500/5 hover:-translate-y-0.5 ${
                    isCompleted ? "border-emerald-500/20" : "border-white/5"
                  }`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white truncate group-hover:text-bible-300 transition-colors">
                          {sermon.title}
                        </h3>
                        <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-bible-500/20 text-bible-300 font-medium">
                          {sermon.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                        {sermon.content.slice(0, 150)}...
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {isCompleted ? (
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-bible-500/10 border border-white/5 flex items-center justify-center group-hover:bg-bible-500/20 transition-colors">
                          <span className="text-bible-400 text-sm font-semibold group-hover:scale-110 transition-transform">Study</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {sermons.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center border border-white/5">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-400 font-medium">No sermons available yet</p>
              <p className="text-gray-500 text-sm mt-1">Check back soon for new content</p>
            </div>
          )}
        </div>

        {/* Start Quiz button */}
        <div className="glass rounded-2xl p-6 border border-white/5 text-center">
          {allDone ? (
            <Link
              href={`/${bracket}/quiz`}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Quiz Challenge!
            </Link>
          ) : (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Complete all {sermons.length} sermons to unlock the quiz
              </div>
              <div className="w-full max-w-xs mx-auto h-2 rounded-full bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-bible-500 to-purple-500 transition-all duration-500"
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

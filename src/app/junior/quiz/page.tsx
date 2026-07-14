"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SermonData {
  id: number;
  title: string;
}

interface ProgressData {
  sermon_id: number;
  completed: number;
}

export default function JuniorQuizGate() {
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
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.sermon_id));
  const completedCount = sermons.filter((s) => completedIds.has(s.id)).length;
  const allDone = sermons.length > 0 && completedCount === sermons.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="skeleton h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] relative overflow-hidden flex items-center justify-center px-4">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-radial from-bible-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-radial from-purple-500/10 to-transparent blur-3xl" />
      </div>

      <div className="max-w-lg w-full">
        {allDone ? (
          <div className="glass rounded-3xl p-10 border border-emerald-500/20 text-center animate-scale-in">
            <div className="text-6xl mb-6 animate-float">🏆</div>
            <h1 className="text-3xl font-extrabold text-white mb-3">Ready for the Quiz!</h1>
            <p className="text-gray-400 mb-8">
              You&apos;ve completed all {sermons.length} study sessions. Now challenge yourself!
            </p>
            <Link
              href={`/quiz/play?age=junior&ids=${sermons.map(s => s.id).join(",")}`}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Quiz
            </Link>
          </div>
        ) : (
          <div className="glass rounded-3xl p-10 border border-white/5 text-center animate-scale-in">
            <div className="text-6xl mb-6 animate-float-slow">🔒</div>
            <h1 className="text-3xl font-extrabold text-white mb-3">Complete All Studies First</h1>
            <p className="text-gray-400 mb-2">
              You need to complete all {sermons.length} study sessions to unlock the quiz.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              {completedCount} of {sermons.length} completed
            </p>

            <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden mb-8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-bible-500 to-purple-500 transition-all duration-500"
                style={{ width: sermons.length ? `${(completedCount / sermons.length) * 100}%` : "0%" }}
              />
            </div>

            <Link
              href="/junior/dashboard"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SermonData {
  id: number;
  title: string;
}

export default function SeniorQuizGate() {
  const [sermons, setSermons] = useState<SermonData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/sermons?age=senior");
        const data = await res.json();
        setSermons(data.sermons || []);
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
        <div className="glass rounded-3xl p-10 border border-emerald-500/20 text-center animate-scale-in">
          <div className="text-6xl mb-6 animate-float">🏆</div>
          <h1 className="text-3xl font-extrabold text-white mb-3">Ready for the Quiz!</h1>
          <p className="text-gray-400 mb-8">
            Challenge yourself with {sermons.length > 0 ? `${sermons.length} ` : ""}study topics from the Senior category.
          </p>
          <Link
            href="/quiz/play?age=senior"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

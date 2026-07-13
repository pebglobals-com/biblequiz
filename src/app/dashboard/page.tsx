"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AgeToggle from "@/components/AgeToggle";
import SermonIngestion from "@/components/SermonIngestion";
import type { AgeBracket, Sermon } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const [ageBracket, setAgeBracket] = useState<AgeBracket>("junior");
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSermons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sermons?age=${ageBracket}`);
      const data = await res.json();
      setSermons(data.sermons || []);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch sermons:", err);
    } finally {
      setLoading(false);
    }
  }, [ageBracket]);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  function handleIngested(sermon: Sermon) {
    setSermons((prev) => [sermon, ...prev]);
    fetchSermons();
  }

  async function handleGenerateQuestions(sermonId: number) {
    try {
      await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sermonId }),
      });
      fetchSermons();
    } catch (err) {
      console.error("Failed to generate questions:", err);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <AgeToggle value={ageBracket} onChange={setAgeBracket} />
      </div>

      <SermonIngestion ageBracket={ageBracket} onIngested={handleIngested} />

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-blue-600">{stats.totalSermons}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Sermons</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-purple-600">{stats.totalQuestions}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Questions</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-green-600">{stats.juniorSermons}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Junior</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-orange-600">{stats.seniorSermons}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Senior</p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          {ageBracket === "junior" ? "Junior" : "Senior"} Sermons & Topics
        </h2>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : sermons.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No sermons yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Add a URL or paste text above to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sermons.map((sermon) => (
              <div
                key={sermon.id}
                className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">{sermon.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        sermon.age_bracket === "junior"
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                      }`}>
                        {sermon.age_bracket}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span>Category: {sermon.category}</span>
                      <span>{new Date(sermon.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                      {sermon.content.slice(0, 200)}...
                    </p>
                  </div>
                  <button
                    onClick={() => handleGenerateQuestions(sermon.id)}
                    className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
                    title="Generate questions from this sermon"
                  >
                    Generate Qs
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

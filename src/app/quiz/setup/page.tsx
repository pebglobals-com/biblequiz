"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AgeToggle from "@/components/AgeToggle";
import type { AgeBracket, Sermon } from "@/types";

export default function QuizSetupPage() {
  const router = useRouter();
  const [ageBracket, setAgeBracket] = useState<AgeBracket>("junior");
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/sermons?age=${ageBracket}`);
        const data = await res.json();
        setSermons(data.sermons || []);
        setSelectedIds(new Set());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [ageBracket]);

  useEffect(() => {
    async function fetchCount() {
      if (selectedIds.size === 0) {
        setQuestionCount(0);
        return;
      }
      try {
        const ids = Array.from(selectedIds).join(",");
        const res = await fetch(`/api/questions?age=${ageBracket}&sermonIds=${ids}`);
        const data = await res.json();
        setQuestionCount(data.total || 0);
      } catch {
        setQuestionCount(0);
      }
    }
    fetchCount();
  }, [selectedIds, ageBracket]);

  function toggleSermon(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedIds.size === sermons.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sermons.map((s) => s.id)));
    }
  }

  function startQuiz() {
    if (selectedIds.size === 0) return;
    const params = new URLSearchParams({
      ids: Array.from(selectedIds).join(","),
      age: ageBracket,
    });
    router.push(`/quiz/play?${params}`);
  }

  return (
    <div className="animate-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Setup Your Quiz</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Select sermons to quiz yourself on</p>
      </div>

      <div className="mb-6">
        <AgeToggle value={ageBracket} onChange={setAgeBracket} />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-16 rounded-xl" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      ) : sermons.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">No sermons available</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Go to Dashboard to add sermons first</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={selectAll}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                selectedIds.size === sermons.length
                  ? "bg-gradient-to-r from-bible-500 to-purple-500 text-white shadow-lg shadow-bible-500/30"
                  : "glass text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {selectedIds.size === sermons.length ? "Deselect All" : "Select All"}
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-bold text-bible-600 dark:text-bible-400">{selectedIds.size}</span> selected
              </span>
              {questionCount > 0 && (
                <span className="text-sm px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium">
                  {questionCount} questions
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-3 mb-8">
            {sermons.map((sermon, idx) => {
              const isSelected = selectedIds.has(sermon.id);
              return (
                <label
                  key={sermon.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-bible-500 bg-gradient-to-r from-bible-50 to-purple-50 dark:from-bible-900/20 dark:to-purple-900/20 shadow-lg shadow-bible-500/10"
                      : "border-gray-200 dark:border-gray-700/50 glass hover:border-bible-300 dark:hover:border-bible-700 hover:shadow-md"
                  }`}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${
                    isSelected
                      ? "bg-bible-500 border-bible-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSermon(sermon.id)}
                    className="sr-only"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{sermon.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{sermon.category}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                    sermon.age_bracket === "junior"
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      : "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                  }`}>
                    {sermon.age_bracket}
                  </span>
                </label>
              );
            })}
          </div>

          <button
            onClick={startQuiz}
            disabled={selectedIds.size === 0 || questionCount === 0}
            className="w-full py-4 btn-success text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {questionCount > 0
              ? `Start Quiz (${questionCount} questions)`
              : "Select sermons to begin"}
          </button>
        </>
      )}
    </div>
  );
}

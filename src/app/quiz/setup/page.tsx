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
    <div>
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Setup Your Quiz</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Select sermons to quiz yourself on</p>

      <div className="mb-6">
        <AgeToggle value={ageBracket} onChange={setAgeBracket} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading sermons...</div>
      ) : sermons.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No sermons available</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">Go to Dashboard to add sermons first</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={selectAll}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                selectedIds.size === sermons.length
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {selectedIds.size === sermons.length ? "Deselect All" : "Select All"}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedIds.size} selected | {questionCount} questions available
            </p>
          </div>

          <div className="grid gap-3 mb-6">
            {sermons.map((sermon) => (
              <label
                key={sermon.id}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedIds.has(sermon.id)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(sermon.id)}
                  onChange={() => toggleSermon(sermon.id)}
                  className="w-5 h-5 rounded accent-blue-600 shrink-0"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{sermon.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{sermon.category}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  sermon.age_bracket === "junior"
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                }`}>
                  {sermon.age_bracket}
                </span>
              </label>
            ))}
          </div>

          <button
            onClick={startQuiz}
            disabled={selectedIds.size === 0 || questionCount === 0}
            className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold text-lg rounded-xl transition-colors shadow-md"
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

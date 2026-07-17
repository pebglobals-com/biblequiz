"use client";

import { useState } from "react";

interface Result {
  question_id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  selected_answer: string | null;
  is_correct: boolean | null;
  sermon_title: string;
}

interface Recommendation {
  topic: string;
  reason: string;
  sermon_id: number;
}

interface ResultsDashboardProps {
  score: number;
  total: number;
  results: Result[];
  recommendations: Recommendation[];
  ageBracket: string;
  sermonTitle?: string;
}

export default function ResultsDashboard({
  score,
  total,
  results,
  recommendations,
  ageBracket,
}: ResultsDashboardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  function getGrade() {
    if (percentage >= 90) return { label: "Excellent!", color: "text-green-700 dark:text-emerald-400", bg: "from-emerald-500 to-green-700" };
    if (percentage >= 70) return { label: "Good Job!", color: "text-blue-600 dark:text-blue-400", bg: "from-blue-500 to-purple-500" };
    if (percentage >= 50) return { label: "Keep Trying!", color: "text-amber-600 dark:text-amber-400", bg: "from-amber-500 to-orange-500" };
    return { label: "Study More!", color: "text-red-600 dark:text-red-400", bg: "from-red-500 to-rose-500" };
  }

  const grade = getGrade();

  function exportReport() {
    const date = new Date().toLocaleDateString("en-US");
    let md = `# Bible Quiz Report\n\n`;
    md += `**Date:** ${date}\n`;
    md += `**Age Group:** ${ageBracket === "junior" ? "Junior (5-12)" : "Senior (13-22)"}\n`;
    md += `**Score:** ${score}/${total} (${percentage}%)\n\n`;
    md += `## Results Breakdown\n\n`;

    results.forEach((r, i) => {
      const status = r.is_correct === true ? "Correct" : r.is_correct === false ? "Incorrect" : "Time's Up";
      md += `### Question ${i + 1}: ${status}\n`;
      md += `- ${r.question_text}\n`;
      md += `- Your answer: ${r.selected_answer || "No answer"}\n`;
      md += `- Correct answer: ${r.correct_answer}\n`;
      md += `- Topic: ${r.sermon_title}\n\n`;
    });

    if (recommendations.length > 0) {
      md += `## Recommended Study Materials\n\n`;
      recommendations.forEach((r) => {
        md += `- **${r.topic}**: ${r.reason}\n`;
      });
    }

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bible-quiz-${date.replace(/\//g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function getStatusIcon(is_correct: boolean | null) {
    if (is_correct === true) return "✅";
    if (is_correct === false) return "❌";
    return "⏰";
  }

  return (
    <div className="max-w-3xl mx-auto animate-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold mb-2">
          <span className="text-gradient">Quiz Complete!</span>
        </h1>
        <p className={`text-2xl font-bold ${grade.color}`}>{grade.label}</p>
      </div>

      <div className="card p-8 mb-6">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={`url(#scoreGradient)`}
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="currentColor" className="dark:fill-white font-extrabold">
                {percentage}%
              </text>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="rounded-xl p-4 bg-gradient-to-b from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800">
            <p className="text-3xl font-extrabold text-green-700">{score}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Correct</p>
          </div>
          <div className="rounded-xl p-4 bg-gradient-to-b from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800">
            <p className="text-3xl font-extrabold text-red-600">{total - score}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Incorrect</p>
          </div>
          <div className="rounded-xl p-4 bg-gradient-to-b from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-3xl font-extrabold text-bible-600">{total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn-secondary"
          >
            <span className="flex items-center gap-1.5">
              {showDetails ? "Hide Details" : "View Details"}
            </span>
          </button>
          <button
            onClick={exportReport}
            className="btn-primary"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </span>
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-3 mb-6">
          {results.map((r, i) => (
            <div
              key={i}
              className={`card p-5 border-2 animate-in ${
                r.is_correct === true
                  ? "border-emerald-200 dark:border-emerald-800"
                  : "border-red-200 dark:border-red-800"
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{getStatusIcon(r.is_correct)}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{r.question_text}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Topic: {r.sermon_title}</p>
                  <div className="mt-2 text-sm">
                    {r.selected_answer ? (
                      <p>Your answer: <span className={r.is_correct ? "text-green-700 font-medium" : "text-red-600 font-medium line-through"}>{r.selected_answer}</span></p>
                    ) : (
                      <p className="text-orange-600 font-medium">No answer (time expired)</p>
                    )}
                    {r.is_correct !== true && (
                      <p className="text-green-700 font-medium mt-0.5">Correct answer: {r.correct_answer}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">🎯</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Smart Recommendations</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Based on your incorrect answers, the AI suggests reviewing these topics:
          </p>
          <div className="space-y-3">
            {recommendations.map((r, i) => (
              <div key={i} className="p-5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800">
                <p className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
                  <span>📚</span>
                  {r.topic}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1 ml-7">{r.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

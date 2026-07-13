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
    if (percentage >= 90) return { label: "Excellent!", color: "text-green-600 dark:text-green-400" };
    if (percentage >= 70) return { label: "Good Job!", color: "text-blue-600 dark:text-blue-400" };
    if (percentage >= 50) return { label: "Keep Trying!", color: "text-yellow-600 dark:text-yellow-400" };
    return { label: "Study More!", color: "text-red-600 dark:text-red-400" };
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
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className={`text-2xl font-bold ${grade.color}`}>{grade.label}</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={percentage >= 70 ? "#22c55e" : percentage >= 50 ? "#eab308" : "#ef4444"}
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
              />
              <text x="18" y="20.5" textAnchor="middle" fontSize="8" fill="currentColor" className="dark:fill-white font-bold">
                {percentage}%
              </text>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-600">{score}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
            <p className="text-2xl font-bold text-red-600">{total - score}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <p className="text-2xl font-bold text-blue-600">{total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-colors"
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>
          <button
            onClick={exportReport}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
          >
            Export Report
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-3 mb-6">
          {results.map((r, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border-2 ${
                r.is_correct === true
                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                  : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">{getStatusIcon(r.is_correct)}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{r.question_text}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Topic: {r.sermon_title}</p>
                  <div className="mt-2 text-sm">
                    {r.selected_answer ? (
                      <p>Your answer: <span className={r.is_correct ? "text-green-600 font-medium" : "text-red-600 font-medium line-through"}>{r.selected_answer}</span></p>
                    ) : (
                      <p className="text-orange-600 font-medium">No answer (time expired)</p>
                    )}
                    {r.is_correct !== true && (
                      <p className="text-green-600 font-medium mt-0.5">Correct answer: {r.correct_answer}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-bold mb-4">Smart Recommendations</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Based on your incorrect answers, the AI suggests reviewing these topics:
          </p>
          <div className="space-y-3">
            {recommendations.map((r, i) => (
              <div key={i} className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <p className="font-semibold text-amber-800 dark:text-amber-200">{r.topic}</p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{r.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

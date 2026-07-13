"use client";

import type { AgeBracket } from "@/types";

interface AgeToggleProps {
  value: AgeBracket;
  onChange: (val: AgeBracket) => void;
}

export default function AgeToggle({ value, onChange }: AgeToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 glass rounded-2xl p-1.5 shadow-sm">
      <button
        onClick={() => onChange("junior")}
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          value === "junior"
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
            : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-white/5"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span>🧒</span>
          Junior (5-12)
        </span>
      </button>
      <button
        onClick={() => onChange("senior")}
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          value === "senior"
            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
            : "text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-white/5"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span>🧑</span>
          Senior (13-22)
        </span>
      </button>
    </div>
  );
}

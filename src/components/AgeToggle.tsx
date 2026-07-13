"use client";

import type { AgeBracket } from "@/types";

interface AgeToggleProps {
  value: AgeBracket;
  onChange: (val: AgeBracket) => void;
}

export default function AgeToggle({ value, onChange }: AgeToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
      <button
        onClick={() => onChange("junior")}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
          value === "junior"
            ? "bg-blue-500 text-white shadow-md"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        Junior (5-12)
      </button>
      <button
        onClick={() => onChange("senior")}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
          value === "senior"
            ? "bg-purple-600 text-white shadow-md"
            : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        Senior (13-22)
      </button>
    </div>
  );
}

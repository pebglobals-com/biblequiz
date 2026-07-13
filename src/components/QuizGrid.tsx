"use client";

interface QuizGridProps {
  total: number;
  currentIndex: number | null;
  answered: Record<number, boolean | null>;
  onSelect: (index: number) => void;
  disabled: boolean;
}

export default function QuizGrid({ total, currentIndex, answered, onSelect, disabled }: QuizGridProps) {
  const cols = total <= 10 ? 5 : total <= 20 ? 5 : 6;
  const gridCols = {
    5: "grid-cols-5",
    6: "grid-cols-6",
  }[cols] || "grid-cols-5";

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Questions
        </h4>
      </div>
      <div className={`grid ${gridCols} gap-2`}>
        {Array.from({ length: total }, (_, i) => {
          const status = answered[i];
          const isActive = currentIndex === i;

          let style = "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700";
          if (isActive) style = "ring-2 ring-bible-500 bg-gradient-to-br from-bible-50 to-purple-50 dark:from-bible-900/30 dark:to-purple-900/30 text-bible-700 dark:text-bible-300 font-bold shadow-lg shadow-bible-500/20";
          if (status === true) style = "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-500/30";
          if (status === false) style = "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-lg shadow-red-500/30";

          return (
            <button
              key={i}
              onClick={() => !disabled && onSelect(i)}
              disabled={disabled}
              className={`w-full aspect-square rounded-xl text-sm font-bold flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 ${style}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 rounded bg-gradient-to-br from-emerald-400 to-emerald-500" /> Correct
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 rounded bg-gradient-to-br from-red-400 to-red-500" /> Incorrect
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700" /> Unanswered
        </span>
      </div>
    </div>
  );
}

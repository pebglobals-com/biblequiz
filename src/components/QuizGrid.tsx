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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
        Questions
      </h4>
      <div className={`grid ${gridCols} gap-2`}>
        {Array.from({ length: total }, (_, i) => {
          const status = answered[i];
          const isActive = currentIndex === i;

          let bg = "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300";
          if (isActive) bg = "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold";
          if (status === true) bg = "bg-green-500 text-white hover:bg-green-600";
          if (status === false) bg = "bg-red-500 text-white hover:bg-red-600";

          return (
            <button
              key={i}
              onClick={() => !disabled && onSelect(i)}
              disabled={disabled}
              className={`w-full aspect-square rounded-lg text-sm font-bold flex items-center justify-center transition-all ${bg}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-green-500 inline-block" /> Correct
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-500 inline-block" /> Incorrect
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700 inline-block" /> Unanswered
        </span>
      </div>
    </div>
  );
}

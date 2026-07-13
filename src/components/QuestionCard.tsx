"use client";

import { useEffect, useRef, useState } from "react";

interface QuestionCardProps {
  question: {
    id: number;
    question_text: string;
    options: string[];
  };
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  correctAnswer?: string;
  showFeedback: boolean;
  onAnswer: (answer: string) => void;
  onTtsDone: () => void;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  isCorrect,
  correctAnswer,
  showFeedback,
  onAnswer,
  onTtsDone,
}: QuestionCardProps) {
  const [reading, setReading] = useState(true);
  const readCountRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setReading(false);
      onTtsDone();
      return;
    }

    cancelledRef.current = false;
    readCountRef.current = 0;
    setReading(true);

    window.speechSynthesis.cancel();

    function speak() {
      if (cancelledRef.current) return;
      const utterance = new SpeechSynthesisUtterance(question.question_text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => {
        readCountRef.current++;
        if (readCountRef.current < 2 && !cancelledRef.current) {
          setTimeout(speak, 400);
        } else {
          setReading(false);
          onTtsDone();
        }
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    const timer = setTimeout(speak, 600);

    return () => {
      cancelledRef.current = true;
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, [question.id]);

  useEffect(() => {
    if (!showFeedback || !correctAnswer) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const wasIncorrect = selectedAnswer && selectedAnswer !== correctAnswer;
    const wasTimeout = !selectedAnswer;

    if (wasIncorrect || wasTimeout) {
      const utterance = new SpeechSynthesisUtterance(
        `The correct answer is: ${correctAnswer}`
      );
      utterance.rate = 0.85;
      setTimeout(() => window.speechSynthesis.speak(utterance), 300);
    }
  }, [showFeedback, correctAnswer, selectedAnswer]);

  if (reading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-bible-400 to-purple-500 animate-pulse-soft opacity-20" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-bible-100 to-purple-100 dark:from-bible-900/50 dark:to-purple-900/50 flex items-center justify-center">
              <svg className="w-10 h-10 text-bible-600 dark:text-bible-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse font-medium">Reading question aloud...</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">(2x)</p>
        </div>
      </div>
    );
  }

  const optionLabels = ["A", "B", "C", "D"];

  function getOptionStyle(option: string) {
    if (!showFeedback) {
      return selectedAnswer === option
        ? "border-bible-500 bg-gradient-to-r from-bible-50 to-purple-50 dark:from-bible-900/30 dark:to-purple-900/30 ring-2 ring-bible-500 shadow-lg shadow-bible-500/20"
        : "border-gray-200 dark:border-gray-600 glass hover:border-bible-400 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]";
    }

    if (option === correctAnswer) {
      return "border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 ring-2 ring-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-lg shadow-emerald-500/20";
    }

    if (option === selectedAnswer && selectedAnswer !== correctAnswer) {
      return "border-red-500 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 ring-2 ring-red-500 text-red-800 dark:text-red-200 shadow-lg shadow-red-500/20";
    }

    return "border-gray-200 dark:border-gray-600 opacity-50";
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-relaxed">
        {question.question_text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => !showFeedback && onAnswer(option)}
            disabled={showFeedback}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${getOptionStyle(option)}`}
          >
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-200 ${
              showFeedback && option === correctAnswer
                ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-md"
                : showFeedback && option === selectedAnswer && selectedAnswer !== correctAnswer
                ? "bg-gradient-to-br from-red-400 to-red-500 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}>
              {optionLabels[idx]}
            </span>
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className={`mt-6 p-5 rounded-xl text-center transition-all duration-300 animate-in ${
          isCorrect === true
            ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-800"
            : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 border border-red-200 dark:border-red-800"
        }`}>
          <div className="text-3xl mb-2">
            {isCorrect === true ? "🎉" : isCorrect === null ? "⏰" : "😔"}
          </div>
          <p className="text-xl font-bold">
            {isCorrect === true ? "Correct!" : isCorrect === null ? "Time's Up!" : "Incorrect"}
          </p>
        </div>
      )}
    </div>
  );
}

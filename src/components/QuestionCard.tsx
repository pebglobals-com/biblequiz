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
          <div className="inline-block p-4 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <svg className="w-10 h-10 text-blue-600 dark:text-blue-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse">Reading question aloud...</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">(2x)</p>
        </div>
      </div>
    );
  }

  const optionLabels = ["A", "B", "C", "D"];

  function getOptionStyle(option: string) {
    if (!showFeedback) {
      return selectedAnswer === option
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500"
        : "border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800";
    }

    if (option === correctAnswer) {
      return "border-green-500 bg-green-50 dark:bg-green-900/30 ring-2 ring-green-500 text-green-800 dark:text-green-200";
    }

    if (option === selectedAnswer && selectedAnswer !== correctAnswer) {
      return "border-red-500 bg-red-50 dark:bg-red-900/30 ring-2 ring-red-500 text-red-800 dark:text-red-200";
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
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              showFeedback && option === correctAnswer
                ? "bg-green-500 text-white"
                : showFeedback && option === selectedAnswer && selectedAnswer !== correctAnswer
                ? "bg-red-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}>
              {optionLabels[idx]}
            </span>
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className={`mt-6 p-4 rounded-xl text-center text-lg font-bold ${
          isCorrect === true
            ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200"
            : "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
        }`}>
          {isCorrect === true ? "Correct!" : isCorrect === null ? "Time's Up!" : "Incorrect"}
        </div>
      )}
    </div>
  );
}

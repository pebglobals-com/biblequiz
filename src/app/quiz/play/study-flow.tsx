"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const READING_SECS = 10;

interface StudyQuestionData {
  id: number;
  sermon_id: number;
  question_text: string;
  answer_text: string;
  created_at: string;
}

interface StudyFlowProps {
  questions?: StudyQuestionData[];
  age?: string;
}

type Phase = "intro" | "reading" | "revealed";

export default function StudyFlow({ questions: propQuestions, age }: StudyFlowProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerSec, setTimerSec] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [localQuestions, setLocalQuestions] = useState<StudyQuestionData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const questions = propQuestions ?? localQuestions ?? [];

  useEffect(() => {
    if (propQuestions) return;
    setLoading(true);
    fetch(`/api/study-questions?age=${age || "junior"}`)
      .then((r) => r.json())
      .then((data) => setLocalQuestions(data.questions || []))
      .catch(() => setLocalQuestions([]))
      .finally(() => setLoading(false));
  }, [propQuestions, age]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (duration: number, nextPhase: Phase) => {
      clearTimer();
      setTimerSec(duration);
      const id = setInterval(() => {
        setTimerSec((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            timerRef.current = null;
            setTimeout(() => setPhase(nextPhase), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      timerRef.current = id;
    },
    [clearTimer]
  );

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handleStart = useCallback(() => {
    setSessionComplete(false);
    setCurrentIndex(0);
    setPhase("reading");
    startTimer(READING_SECS, "revealed");
  }, [startTimer]);

  const handleReveal = useCallback(() => {
    clearTimer();
    setPhase("revealed");
  }, [clearTimer]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setSessionComplete(true);
      setPhase("intro");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setPhase("reading");
    startTimer(READING_SECS, "revealed");
  }, [currentIndex, questions.length, startTimer]);

  const handleQuit = useCallback(() => {
    clearTimer();
    setSessionComplete(false);
    setPhase("intro");
    setCurrentIndex(0);
  }, [clearTimer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin mx-auto" />
          <p className="text-ink-muted">Loading study questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ink-muted">No study questions found.</p>
        <button
          onClick={() => window.history.back()}
          className="btn-primary mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (phase === "intro") {
    const totalQuestions = questions.length;

    return (
      <div className="max-w-xl mx-auto text-center py-12 space-y-6">
        <h2 className="text-2xl font-bold text-ink">Study Mode</h2>

        {sessionComplete && (
          <div className="card-base p-6 space-y-2">
            <p className="text-lg font-semibold text-ink">Session Complete</p>
            <p className="text-4xl font-bold text-brand-600">
              {totalQuestions}
              <span className="text-ink-muted text-2xl"> questions reviewed</span>
            </p>
          </div>
        )}

        <div className="card-base p-4 text-left text-sm space-y-2">
          <p className="font-medium text-ink">How it works:</p>
          <ul className="list-disc list-inside space-y-1 text-ink-muted">
            <li>
              You have <strong className="text-ink">{READING_SECS} seconds</strong>{" "}
              to read each question and think about the answer.
            </li>
            <li>
              Then the answer is revealed so you can study it.
            </li>
            <li>
              You can also tap <strong className="text-ink">Reveal Answer</strong> early.
            </li>
            <li>
              Review all {totalQuestions} questions to complete the session.
            </li>
          </ul>
        </div>

        <button onClick={handleStart} className="btn-primary">
          {sessionComplete ? "Start New Session" : "Start Study Session"}
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isReading = phase === "reading";
  const isRevealed = phase === "revealed";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top bar: quit, timer, progress */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleQuit}
          className="flex items-center gap-2 px-4 py-2 text-sm text-ink-muted hover:text-ink transition-colors rounded-xl"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Quit
        </button>

        {isReading && (
          <div className="flex items-center gap-2 text-sm font-mono tabular-nums">
            <span className="text-ink-muted">Read:</span>
            <span className="text-lg font-bold text-ink">{timerSec}s</span>
          </div>
        )}

        <span className="text-sm text-ink-muted">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Question card */}
      <div className="card-base p-6">
        <div className="space-y-4">
          <p className="text-sm text-ink-muted font-medium">
            Question {currentIndex + 1}
          </p>
          <p className="text-lg font-medium leading-relaxed text-ink">
            {currentQuestion.question_text}
          </p>
        </div>
      </div>

      {/* Reading phase */}
      {isReading && (
        <div className="text-center py-8 space-y-4">
          <p className="text-lg font-medium text-ink">
            Read the question and think about your answer
          </p>
          <button onClick={handleReveal} className="btn-primary">
            Reveal Answer
          </button>
        </div>
      )}

      {/* Revealed phase */}
      {isRevealed && (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-2">
              Answer
            </p>
            <p className="text-base font-medium text-emerald-800 dark:text-emerald-200 leading-relaxed">
              {currentQuestion.answer_text}
            </p>
          </div>

          <button onClick={handleNext} className="btn-primary w-full justify-center">
            {currentIndex + 1 >= questions.length
              ? "Complete Session"
              : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
}

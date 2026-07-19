"use client";

import { useRef, useState, useEffect, useCallback } from "react";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const READING_SECS = 10;
const ANSWERING_SECS = 25;

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

type Phase = "intro" | "reading" | "answering" | "revealed";

export default function StudyFlow({ questions: propQuestions, age }: StudyFlowProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerSec, setTimerSec] = useState(0);
  const [selfCorrect, setSelfCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [localQuestions, setLocalQuestions] = useState<StudyQuestionData[] | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<StudyQuestionData[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rawQuestions = propQuestions ?? localQuestions ?? [];
  const questions = (phase !== "intro" && sessionQuestions.length > 0)
    ? sessionQuestions
    : rawQuestions;

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
    if (phase === "answering") {
      startTimer(ANSWERING_SECS, "revealed");
    }
  }, [phase, startTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handleStart = useCallback(() => {
    const source = propQuestions ?? localQuestions ?? [];
    if (source.length === 0) return;
    setSessionQuestions(shuffle(source));
    setSessionComplete(false);
    setCurrentIndex(0);
    setSelfCorrect(false);
    setCorrectCount(0);
    setPhase("reading");
    startTimer(READING_SECS, "answering");
  }, [startTimer, propQuestions, localQuestions]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setSessionComplete(true);
      setPhase("intro");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelfCorrect(false);
    setPhase("reading");
    startTimer(READING_SECS, "answering");
  }, [currentIndex, questions.length, startTimer]);

  const handleQuit = useCallback(() => {
    clearTimer();
    setSessionComplete(false);
    setSessionQuestions([]);
    setPhase("intro");
    setCurrentIndex(0);
    setSelfCorrect(false);
    setCorrectCount(0);
  }, [clearTimer]);

  const handleSelfGrade = useCallback(
    (correct: boolean) => {
      setSelfCorrect(correct);
      if (correct) setCorrectCount((c) => c + 1);
    },
    []
  );

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
              {correctCount}
              <span className="text-ink-muted text-2xl">
                /{totalQuestions}
              </span>
            </p>
            <p className="text-sm text-ink-muted">
              {totalQuestions > 0
                ? `${Math.round((correctCount / totalQuestions) * 100)}% correct`
                : ""}
            </p>
          </div>
        )}

        <div className="card-base p-4 text-left text-sm space-y-2">
          <p className="font-medium text-ink">How it works:</p>
          <ul className="list-disc list-inside space-y-1 text-ink-muted">
            <li>
              You have <strong className="text-ink">{READING_SECS} seconds</strong>{" "}
              to read each question.
            </li>
            <li>
              Then you have{" "}
              <strong className="text-ink">{ANSWERING_SECS} seconds</strong>{" "}
              to think about the answer.
            </li>
            <li>
              The correct answer is revealed — grade yourself honestly.
            </li>
            <li>At the end you get your total score.</li>
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
  const isAnswering = phase === "answering";
  const isRevealed = phase === "revealed";

  function CircularTimer({ seconds, total }: { seconds: number; total: number }) {
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    const progress = seconds / total;
    const offset = circumference * (1 - progress);
    const urgent = seconds <= 5;

    return (
      <div className="relative w-28 h-28">
        <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-surface-border"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-300 ${
              urgent ? "text-red-500" : "text-brand-500"
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-2xl font-bold font-mono ${
              urgent ? "text-red-500" : "text-ink"
            }`}
          >
            {seconds}s
          </span>
        </div>
      </div>
    );
  }

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

        {isAnswering && (
          <CircularTimer seconds={timerSec} total={ANSWERING_SECS} />
        )}

        <span className="text-sm text-ink-muted">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Question card */}
      <div
        className={`card-base p-6 ${
          isReading ? "border-brand-500" : ""
        }`}
      >
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
        <div className="text-center py-8 space-y-3">
          <p className="text-lg font-medium text-ink">
            Read the question carefully
          </p>
          <p className="text-sm text-ink-muted">
            You will have {ANSWERING_SECS} seconds to think after the timer.
          </p>
        </div>
      )}

      {/* Answering phase */}
      {isAnswering && (
        <div className="text-center py-8 space-y-3">
          <p className="text-lg font-medium text-ink">
            Think about your answer
          </p>
          <p className="text-sm text-ink-muted">
            The correct answer will be shown when the timer ends.
          </p>
        </div>
      )}

      {/* Revealed phase */}
      {isRevealed && (
        <div className="space-y-4">
          {/* Answer card */}
          <div className="rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-2">
              Answer
            </p>
            <p className="text-base font-medium text-emerald-800 dark:text-emerald-200 leading-relaxed">
              {currentQuestion.answer_text}
            </p>
          </div>

          {/* Self-grade buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleSelfGrade(true)}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 border-2 ${
                selfCorrect === true
                  ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                  : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:shadow-sm"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                I Was Correct
              </span>
            </button>
            <button
              onClick={() => handleSelfGrade(false)}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 border-2 ${
                selfCorrect === false
                  ? "bg-red-500 text-white border-red-600 shadow-md"
                  : "bg-white text-red-700 border-red-300 hover:bg-red-50 hover:shadow-sm"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                I Was Incorrect
              </span>
            </button>
          </div>

          <button onClick={handleNext} className="btn-primary w-full justify-center">
            {currentIndex + 1 >= questions.length
              ? "See Results"
              : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
}

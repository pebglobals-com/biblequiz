"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface StudyQuestion {
  id: number;
  sermon_id: number;
  question_text: string;
  answer_text: string;
}

interface AnswerRec {
  questionId: number;
  selfCorrect: boolean;
}

type Phase = "loading" | "intro" | "resume" | "playing" | "revealed" | "done" | "aborted";

const TIMER_SECONDS = 25;

const STORAGE_KEY_PREFIX = "studyQuiz_";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function speak(text: string, onEnd?: () => void) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  u.pitch = 1;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
}

function playCelebration() {
  try {
    const ctx = new AudioContext();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.2;
      osc.frequency.value = freq;
      osc.type = "sine";
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.2);
    });
  } catch {}
}

interface SavedState {
  sessionId: string;
  questionIds: number[];
  answers: AnswerRec[];
  currentIndex: number;
  age: string;
}

export default function StudyFlow({ age }: { age: string }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<StudyQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRec[]>([]);
  const [timerSec, setTimerSec] = useState(TIMER_SECONDS);
  const [savedState, setSavedState] = useState<SavedState | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const webAudioRef = useRef<AudioContext | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const storageKey = userId ? STORAGE_KEY_PREFIX + userId : "";

  const q = questions[currentIndex];
  const score = answers.filter((a) => a.selfCorrect).length;
  const isLast = currentIndex >= questions.length - 1;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/study-questions?age=" + age);
        const data = await res.json() as { questions?: StudyQuestion[] };
        const shuffled = shuffle(data.questions || []);
        setQuestions(shuffled);
        if (shuffled.length === 0) {
          setPhase("done");
          return;
        }
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed: SavedState = JSON.parse(saved);
          if (parsed.questionIds.length > 0 && parsed.currentIndex < parsed.questionIds.length) {
            setSavedState(parsed);
            setPhase("resume");
            return;
          }
        }
        setPhase("intro");
      } catch {
        setPhase("done");
      }
    }
    load();
  }, [age, storageKey]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  function startTimer() {
    setTimerSec(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimerSec((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function beginQuiz(resumeIndex: number, resumeAnswers: AnswerRec[]) {
    setCurrentIndex(resumeIndex);
    setAnswers(resumeAnswers);
    setPhase("playing");
    setTimeout(() => {
      speak(questions[resumeIndex].question_text);
      startTimer();
    }, 300);
  }

  function handleStart() {
    localStorage.removeItem(storageKey);
    beginQuiz(0, []);
  }

  function handleResume() {
    if (!savedState) return;
    const qIds = savedState.questionIds;
    const shuffled = [...questions];
    const qMap = new Map(shuffled.map((sq) => [sq.id, sq]));
    const reorder = qIds.map((id) => qMap.get(id)).filter(Boolean) as StudyQuestion[];
    setQuestions(reorder);
    setSavedState(null);
    beginQuiz(savedState.currentIndex, savedState.answers);
  }

  function handleRestart() {
    localStorage.removeItem(storageKey);
    setSavedState(null);
    const res = shuffle(questions);
    setQuestions(res);
    beginQuiz(0, []);
  }

  function handleTimerExpire() {
    setPhase("revealed");
    speak(questions[currentIndex].answer_text);
    playCelebration();
  }

  function handleSelfGrade(correct: boolean) {
    const updated = [...answers];
    updated[currentIndex] = { questionId: q.id, selfCorrect: correct };
    setAnswers(updated);
  }

  function handleNext() {
    if (isLast) {
      finishQuiz();
    } else {
      setCurrentIndex((i) => i + 1);
      setPhase("playing");
      setTimeout(() => {
        speak(questions[currentIndex + 1].question_text);
        startTimer();
      }, 300);
    }
  }

  function handleAbort() {
    if (timerRef.current) clearInterval(timerRef.current);
    window.speechSynthesis.cancel();
    saveProgress(true);
    setPhase("aborted");
  }

  function saveProgress(aborted: boolean) {
    const state: SavedState = {
      sessionId: "sq_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9),
      questionIds: questions.map((sq) => sq.id),
      answers,
      currentIndex,
      age,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageBracket: age,
          answers: answers.map((a) => ({
            questionId: a.questionId,
            selectedAnswer: a.selfCorrect ? "self_correct" : "self_wrong",
          })),
          sermonIds: [...new Set(questions.map((q) => q.sermon_id))],
        }),
      }).catch(() => {});
    } catch {}
  }

  async function finishQuiz() {
    if (timerRef.current) clearInterval(timerRef.current);
    window.speechSynthesis.cancel();
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageBracket: age,
          answers: answers.map((a) => ({
            questionId: a.questionId,
            selectedAnswer: a.selfCorrect ? "self_correct" : "self_wrong",
          })),
          sermonIds: [...new Set(questions.map((q) => q.sermon_id))],
        }),
      });
      const data = await res.json();
      localStorage.removeItem(storageKey);
      setPhase("done");
    } catch {
      setPhase("done");
    }
  }

  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="skeleton h-48 rounded-2xl mb-6" />
          <div className="skeleton h-8 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-surface">
        <div className="fixed inset-0 -z-10 bg-surface">
          <div className="absolute inset-0 bg-dots-light" />
          <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
        </div>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-10">
            <div className="text-6xl mb-6">🎙️</div>
            <h1 className="font-display text-3xl font-bold text-ink mb-4">
              {age === "junior" ? "🧒 Junior" : "🧑 Senior"} Quiz
            </h1>
            <p className="text-ink-muted text-lg mb-8 leading-relaxed">
              You&apos;ll have <strong className="text-ink">{TIMER_SECONDS} seconds</strong> to answer each question
              out loud. The question will be read to you, then the correct answer is revealed when time runs out.
              Grade yourself honestly at the end.
            </p>
            <div className="space-y-3 text-left bg-brand-50 rounded-xl p-5 mb-8 text-sm text-ink-muted">
              <div className="flex items-start gap-3">
                <span className="text-brand-600 font-bold shrink-0">1</span>
                <span>Question is read aloud — listen carefully</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-600 font-bold shrink-0">2</span>
                <span>Speak your answer out loud within {TIMER_SECONDS} seconds</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-600 font-bold shrink-0">3</span>
                <span>The correct answer is revealed and read back to you</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-600 font-bold shrink-0">4</span>
                <span>Grade yourself: <strong>Got it right</strong> or <strong>Got it wrong</strong></span>
              </div>
            </div>
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-bold text-lg rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Quiz
            </button>
            <p className="text-ink-light text-xs mt-4">{questions.length} questions</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "resume" && savedState) {
    const pct = Math.round((savedState.currentIndex / savedState.questionIds.length) * 100);
    const sc = savedState.answers.filter((a) => a.selfCorrect).length;
    return (
      <div className="min-h-screen bg-surface">
        <div className="fixed inset-0 -z-10 bg-surface">
          <div className="absolute inset-0 bg-dots-light" />
          <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
        </div>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-10">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="font-display text-2xl font-bold text-ink mb-3">Incomplete Quiz</h2>
            <p className="text-ink-muted mb-2">
              You were {pct}% done — {sc} of {savedState.questionIds.length} answered.
            </p>
            <p className="text-ink-light text-sm mb-8">Would you like to continue where you left off?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleResume}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
              >
                Continue
              </button>
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-surface-border text-ink-muted font-semibold rounded-xl hover:border-ink-light hover:text-ink transition-all duration-200"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "aborted") {
    return (
      <div className="min-h-screen bg-surface">
        <div className="fixed inset-0 -z-10 bg-surface">
          <div className="absolute inset-0 bg-dots-light" />
          <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
        </div>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-10">
            <div className="text-5xl mb-4">⏸️</div>
            <h2 className="font-display text-2xl font-bold text-ink mb-3">Progress Saved</h2>
            <p className="text-ink-muted mb-2">
              You can pick up where you left off anytime.
            </p>
            <p className="text-ink-light text-sm mb-8">
              {score} of {answers.length} correct so far.
            </p>
            <Link
              href={"/" + age + "/dashboard"}
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    const totalQ = questions.length;
    const attempted = answers.length;
    const pct = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
    return (
      <div className="min-h-screen bg-surface">
        <div className="fixed inset-0 -z-10 bg-surface">
          <div className="absolute inset-0 bg-dots-light" />
          <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
        </div>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-10 text-center">
            <div className="text-6xl mb-4">{pct >= 70 ? "🎉" : pct >= 40 ? "👍" : "💪"}</div>
            <h1 className="font-display text-3xl font-bold text-ink mb-2">Quiz Complete!</h1>
            <p className="text-ink-muted mb-8">Here&apos;s how you did</p>

            <div className="flex items-center justify-center gap-8 mb-8">
              <div>
                <p className="text-4xl font-extrabold text-ink">{score}</p>
                <p className="text-sm text-ink-muted">Correct</p>
              </div>
              <div className="w-px h-12 bg-surface-border" />
              <div>
                <p className="text-4xl font-extrabold text-ink">{totalQ - score}</p>
                <p className="text-sm text-ink-muted">Incorrect</p>
              </div>
              <div className="w-px h-12 bg-surface-border" />
              <div>
                <p className="text-4xl font-extrabold text-ink">{pct}%</p>
                <p className="text-sm text-ink-muted">Score</p>
              </div>
            </div>

            <div className="w-full h-3 rounded-full bg-brand-100 overflow-hidden mb-8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
                style={{ width: pct + "%" }}
              />
            </div>

            {answers.length > 0 && (
              <div className="text-left space-y-3 mb-8 max-h-64 overflow-y-auto">
                {questions.map((sq, i) => {
                  const ans = answers.find((a) => a.questionId === sq.id);
                  if (!ans) return null;
                  return (
                    <div key={sq.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-muted">
                      <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                        ans.selfCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {ans.selfCorrect ? "✓" : "✗"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink truncate">{sq.question_text}</p>
                        <p className="text-xs text-ink-muted mt-0.5">Answer: {sq.answer_text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Link
              href={"/" + age + "/dashboard"}
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!q) return null;

  const hasGraded = answers.some((a) => a.questionId === q.id);
  const selfGrade = answers.find((a) => a.questionId === q.id);

  return (
    <div className="min-h-screen bg-surface">
      <div className="fixed inset-0 -z-10 bg-surface">
        <div className="absolute inset-0 bg-dots-light" />
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
              {currentIndex + 1}
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                Question {currentIndex + 1} of {questions.length}
              </p>
              <div className="w-32 h-1.5 rounded-full bg-brand-100 mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleAbort}
            className="text-sm text-ink-muted hover:text-red-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Abort
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-surface-border shadow-sm p-8 sm:p-10">
          {phase === "playing" && (
            <>
              <div className="text-center mb-8">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#EDE9FE" strokeWidth="6" />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none" stroke="#7C3AED"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(timerSec / TIMER_SECONDS) * 264} 264`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${timerSec <= 5 ? "text-red-500" : "text-brand-600"}`}>
                      {timerSec}
                    </span>
                  </div>
                </div>
                <p className="text-ink-muted text-sm">Seconds remaining</p>
              </div>

              <div className="bg-surface-muted rounded-xl p-6 mb-4">
                <p className="text-lg text-ink leading-relaxed font-medium">
                  {q.question_text}
                </p>
              </div>
            </>
          )}

          {phase === "revealed" && (
            <>
              <div className="text-center mb-6">
                <div className="text-5xl mb-2">🎉</div>
                <h2 className="font-display text-2xl font-bold text-ink">Time&apos;s Up!</h2>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-2">Correct Answer</p>
                <p className="text-lg text-green-800 leading-relaxed font-medium">
                  {q.answer_text}
                </p>
              </div>

              <div className="bg-surface-muted rounded-xl p-4 mb-6">
                <p className="text-xs text-ink-muted font-semibold uppercase tracking-wide mb-1">Question</p>
                <p className="text-ink">{q.question_text}</p>
              </div>

              {!hasGraded && (
                <p className="text-center text-ink-muted text-sm mb-4">How did you do?</p>
              )}

              <div className="flex gap-3 justify-center mb-6">
                {!hasGraded ? (
                  <>
                    <button
                      onClick={() => handleSelfGrade(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Got it right
                    </button>
                    <button
                      onClick={() => handleSelfGrade(false)}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-surface-border text-ink-muted font-semibold rounded-xl hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Got it wrong
                    </button>
                  </>
                ) : (
                  <div className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold ${
                    selfGrade?.selfCorrect ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {selfGrade?.selfCorrect ? "✅ Marked correct" : "❌ Marked incorrect"}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-surface-border">
                <span className="text-sm text-ink-muted">Score: {score}/{answers.length || "—"}</span>
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {isLast ? "See Results" : "Next Question"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import QuestionCard from "@/components/QuestionCard";
import QuizGrid from "@/components/QuizGrid";
import Timer from "@/components/Timer";
import ResultsDashboard from "@/components/ResultsDashboard";

interface QuizQuestion {
  id: number;
  question_text: string;
  options: string[];
  sermon_id: number;
  correct_answer?: string;
}

interface AnswerRecord {
  questionId: number;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

interface ResultData {
  sessionId: string;
  score: number;
  total: number;
  results: any[];
}

function QuizPlayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ids = searchParams.get("ids") || "";
  const age = searchParams.get("age") || "junior";

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, AnswerRecord>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [timerRunning, setTimerRunning] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [ttsDone, setTtsDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const feedbackPendingRef = useRef(false);
  const webAudioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      if (!ids) return;
      try {
        const res = await fetch(`/api/questions?age=${age}&sermonIds=${ids}&withAnswers=true`);
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [ids, age]);

  function playSound(type: "correct" | "wrong" | "tick") {
    try {
      if (!webAudioRef.current) webAudioRef.current = new AudioContext();
      const ctx = webAudioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.3;

      if (type === "correct") {
        osc.frequency.value = 523.25;
        osc.type = "sine";
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          gain2.gain.value = 0.3;
          osc2.frequency.value = 659.25;
          osc2.type = "sine";
          osc2.start();
          osc2.stop(ctx.currentTime + 0.3);
        }, 150);
      } else if (type === "wrong") {
        osc.frequency.value = 200;
        osc.type = "sawtooth";
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {}
  }

  function handleSelectQuestion(index: number) {
    if (showFeedback || quizDone || submitting) return;
    setTtsDone(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(null);
    setCorrectAnswer("");
    setTimerRunning(false);
    feedbackPendingRef.current = false;
    setCurrentIndex(index);
  }

  function handleTtsDone() {
    setTtsDone(true);
    setTimerRunning(true);
  }

  function handleAnswer(answer: string) {
    if (showFeedback || quizDone || submitting) return;
    const q = questions[currentIndex!];
    const correct = answer === getCorrectAnswer(q.id);
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setCorrectAnswer(getCorrectAnswer(q.id));
    setShowFeedback(true);
    setTimerRunning(false);

    setAnswers((prev) => ({
      ...prev,
      [currentIndex!]: { questionId: q.id, selectedAnswer: answer, isCorrect: correct },
    }));

    playSound(correct ? "correct" : "wrong");
    feedbackPendingRef.current = false;
  }

  function handleTimerExpire() {
    if (showFeedback || quizDone || submitting) return;
    const q = questions[currentIndex!];
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCorrectAnswer(getCorrectAnswer(q.id));
    setShowFeedback(true);
    setTimerRunning(false);

    setAnswers((prev) => ({
      ...prev,
      [currentIndex!]: { questionId: q.id, selectedAnswer: null, isCorrect: null },
    }));

    playSound("wrong");
    feedbackPendingRef.current = false;
  }

  function getCorrectAnswer(questionId: number): string {
    return questions.find((q) => q.id === questionId)?.correct_answer || "";
  }

  async function handleSubmitQuiz() {
    if (submitting) return;
    setSubmitting(true);
    setQuizDone(true);
    setCurrentIndex(null);

    const answerList = Object.values(answers).filter((a) => a.questionId);

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ageBracket: age,
          answers: answerList.map((a) => ({
            questionId: a.questionId,
            selectedAnswer: a.selectedAnswer,
          })),
          sermonIds: ids.split(",").map(Number),
        }),
      });
      const data = await res.json();
      setResultData(data);

      if (data.sessionId) {
        const recRes = await fetch("/api/quiz/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: data.sessionId }),
        });
        const recData = await recRes.json();
        setRecommendations(recData.recommendations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-bible-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!ids || questions.length === 0) {
    return (
      <div className="card p-16 text-center animate-in">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">No questions available for selected topics</p>
        <button onClick={() => router.push("/quiz/setup")} className="btn-primary">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Setup
          </span>
        </button>
      </div>
    );
  }

  if (quizDone && resultData) {
    return (
      <ResultsDashboard
        score={resultData.score}
        total={resultData.total}
        results={resultData.results}
        recommendations={recommendations}
        ageBracket={age}
      />
    );
  }

  const currentQuestion = currentIndex !== null ? questions[currentIndex] : null;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  function handleNextQuestion() {
    let next = -1;
    for (let i = 0; i < questions.length; i++) {
      if (!answers[i]) {
        next = i;
        break;
      }
    }
    if (next !== -1) {
      handleSelectQuestion(next);
    }
  }

  function handleFeedbackComplete() {
    if (!feedbackPendingRef.current) {
      feedbackPendingRef.current = true;
      const currentQ = currentIndex;
      if (currentQ !== null && answers[currentQ]) {
        const a = answers[currentQ];
        if (a.selectedAnswer === null) {
        }
      }
    }
  }

  return (
    <div className="animate-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {age === "junior" ? "🧒 Junior Quiz" : "🧑 Senior Quiz"}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-32 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-bible-500 to-purple-500 transition-all duration-300"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {answeredCount}/{questions.length}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {allAnswered && (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="btn-success"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Submit Quiz
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {currentQuestion ? (
            <div className="card p-6 sm:p-8">
              <div className="mb-5">
                <Timer duration={15} running={timerRunning} onExpire={handleTimerExpire} />
              </div>

              <QuestionCard
                key={currentIndex}
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                isCorrect={isCorrect}
                correctAnswer={correctAnswer}
                showFeedback={showFeedback}
                onAnswer={handleAnswer}
                onTtsDone={handleTtsDone}
              />

              <div className="flex justify-between mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => {
                    setCurrentIndex(null);
                    setTtsDone(false);
                    setTimerRunning(false);
                    setShowFeedback(false);
                  }}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Back to Grid
                  </span>
                </button>
                <div className="flex gap-2">
                  {showFeedback && !allAnswered && (
                    <button
                      onClick={handleNextQuestion}
                      className="btn-primary"
                    >
                      <span className="flex items-center gap-2">
                        Next Question
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  )}
                  {showFeedback && allAnswered && (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitting}
                      className="btn-success"
                    >
                      {submitting ? "Submitting..." : "Submit Quiz"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-16 text-center">
              <div className="text-6xl mb-4 animate-float">📖</div>
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Select a Question</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Click a number from the grid to begin
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <QuizGrid
            total={questions.length}
            currentIndex={currentIndex}
            answered={(() => {
              const map: Record<number, boolean | null> = {};
              for (const [idx, answer] of Object.entries(answers)) {
                map[Number(idx)] = answer.isCorrect;
              }
              return map;
            })()}
            onSelect={handleSelectQuestion}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}

export default function QuizPlayPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-bible-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <QuizPlayContent />
    </Suspense>
  );
}

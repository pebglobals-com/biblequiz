"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

export default function QuizPlayPage() {
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
    return <div className="text-center py-20 text-gray-500">Loading questions...</div>;
  }

  if (!ids || questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No questions available for selected topics</p>
        <button onClick={() => router.push("/quiz/setup")} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Back to Setup
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {age === "junior" ? "Junior Quiz" : "Senior Quiz"}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {answeredCount}/{questions.length} answered
          </span>
          {allAnswered && (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {currentQuestion ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
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

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => {
                    setCurrentIndex(null);
                    setTtsDone(false);
                    setTimerRunning(false);
                    setShowFeedback(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back to Grid
                </button>
                {showFeedback && !allAnswered && (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                  >
                    Next Question
                  </button>
                )}
                {showFeedback && allAnswered && (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={submitting}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors"
                  >
                    {submitting ? "Submitting..." : "Submit Quiz"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-5xl mb-4">📖</div>
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Select a Question</h2>
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

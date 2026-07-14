import { createDb } from "../../lib/db";

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const db = createDb(env.DB || null);
    const { questionId, selectedAnswer } = await request.json();
    if (!questionId) {
      return new Response(JSON.stringify({ error: "questionId required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const allQuestions = await db.questions.getAll();
    const question = allQuestions.find((q: any) => q.id === questionId);
    if (!question) {
      return new Response(JSON.stringify({ error: "Question not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ isCorrect: selectedAnswer === question.correct_answer, correctAnswer: question.correct_answer }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

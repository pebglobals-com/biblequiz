import { createDb } from "../../lib/db";

export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  try {
    const db = createDb(env.DB || null);
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("sessionId");
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const session = await db.quizSessions.getById(sessionId);
    if (!session) {
      return new Response(JSON.stringify({ error: "Session not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    const answers = await db.quizAnswers.getBySession(sessionId);
    const allQuestions = await db.questions.getAll();
    const results = answers.map((a: any) => {
      const q = allQuestions.find((qq: any) => qq.id === a.question_id);
      let isCorrect = a.is_correct;
      if (typeof isCorrect === "number") isCorrect = isCorrect === 1 ? true : isCorrect === 0 ? false : null;
      return {
        question_id: a.question_id,
        question_text: q?.question_text || "Unknown",
        options: q?.options || [],
        correct_answer: q?.correct_answer || "",
        selected_answer: a.selected_answer,
        is_correct: isCorrect,
        sermon_title: "Unknown",
      };
    });
    return new Response(JSON.stringify({ sessionId, score: session.score, total: session.total, results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const db = createDb(env.DB || null);
    const { ageBracket, answers, sermonIds } = await request.json();

    if (!ageBracket || !answers || !Array.isArray(answers)) {
      return new Response(JSON.stringify({ error: "ageBracket and answers array required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const sermonIdsStr = (sermonIds || []).join(",");

    const session = await db.quizSessions.create({
      session_id: sessionId,
      age_bracket: ageBracket,
      sermon_ids: sermonIdsStr,
      score: 0,
      total: answers.length,
      completed_at: null,
    });

    let score = 0;
    const results: any[] = [];
    const allQuestions = await db.questions.getAll();

    for (const answer of answers) {
      const question = allQuestions.find((q: any) => q.id === answer.questionId);
      if (!question) continue;

      const isCorrect = answer.selectedAnswer === question.correct_answer;
      if (isCorrect) score++;

      await db.quizAnswers.create({
        session_id: sessionId,
        question_id: question.id,
        selected_answer: answer.selectedAnswer || null,
        is_correct: isCorrect ? 1 : 0,
        timestamp: new Date().toISOString(),
      });

      const sermon = await db.sermons.getById(question.sermon_id);

      results.push({
        question_id: question.id,
        question_text: question.question_text,
        options: question.options,
        correct_answer: question.correct_answer,
        selected_answer: answer.selectedAnswer || null,
        is_correct: answer.selectedAnswer ? isCorrect : null,
        sermon_title: sermon?.title || "Unknown",
      });
    }

    await db.quizSessions.update(sessionId, { score, completed_at: new Date().toISOString() });

    return new Response(JSON.stringify({ sessionId, score, total: answers.length, results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

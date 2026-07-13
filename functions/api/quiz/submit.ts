import { db } from "../../lib/db";

export async function onRequestPost({ request }: { request: Request }) {
  try {
    const { ageBracket, answers, sermonIds } = await request.json();

    if (!ageBracket || !answers || !Array.isArray(answers)) {
      return new Response(
        JSON.stringify({ error: "ageBracket and answers array required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const sermonIdsStr = (sermonIds || []).join(",");

    const session = db.quizSessions.create({
      session_id: sessionId,
      age_bracket: ageBracket,
      sermon_ids: sermonIdsStr,
      score: 0,
      total: answers.length,
      completed_at: null,
    });

    let score = 0;
    const results: any[] = [];

    for (const answer of answers) {
      const question = db.questions
        .getAll()
        .find((q) => q.id === answer.questionId);

      if (!question) continue;

      const isCorrect = answer.selectedAnswer === question.correct_answer;
      if (isCorrect) score++;

      db.quizAnswers.create({
        session_id: sessionId,
        question_id: question.id,
        selected_answer: answer.selectedAnswer || null,
        is_correct: isCorrect ? 1 : 0,
        timestamp: new Date().toISOString(),
      });

      const sermon = db.sermons.getById(question.sermon_id);

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

    db.quizSessions.update(sessionId, {
      score,
      completed_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ sessionId, score, total: answers.length, results }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

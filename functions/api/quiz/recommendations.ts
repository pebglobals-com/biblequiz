import { createDb } from "../../lib/db";
import { getRecommendations } from "../../lib/ai";

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const apiKey = env.OPENCODE_API_KEY || "";
    const db = createDb(env.DB || null);
    const { sessionId } = await request.json();

    if (!sessionId) {
      return new Response(JSON.stringify({ error: "sessionId required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const session = await db.quizSessions.getById(sessionId);
    if (!session) {
      return new Response(JSON.stringify({ error: "Session not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    const answers = await db.quizAnswers.getBySession(sessionId);
    const failedQuestionIds = answers.filter((a) => !a.is_correct).map((a) => a.question_id);

    const allQuestions = await db.questions.getAll();
    const failedQuestions = allQuestions
      .filter((q) => failedQuestionIds.includes(q.id))
      .map((q) => {
        const sermon = db.sermons.getById(q.sermon_id);
        return { question_text: q.question_text, sermon_title: "Unknown" };
      });

    const allSermons = (await db.sermons.getAll()).map((s) => ({ id: s.id, title: s.title, category: s.category }));

    // Resolve sermon titles for failed questions
    for (const fq of failedQuestions) {
      const q = allQuestions.find((q) => q.question_text === fq.question_text);
      if (q) {
        const sermon = await db.sermons.getById(q.sermon_id);
        if (sermon) fq.sermon_title = sermon.title;
      }
    }

    let recommendations: any[] = [];
    if (failedQuestions.length > 0 && allSermons.length > 0) {
      recommendations = await getRecommendations(failedQuestions, allSermons, apiKey);
    }

    return new Response(JSON.stringify({ recommendations, failedCount: failedQuestions.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

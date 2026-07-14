import { createDb } from "../../lib/db";
import { generateQuestions } from "../../lib/ai";

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const apiKey = env.OPENCODE_API_KEY || "";
    const db = createDb(env.DB || null);
    const { sermonId } = await request.json();

    if (!sermonId) {
      return new Response(JSON.stringify({ error: "sermonId is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const sermon = await db.sermons.getById(sermonId);
    if (!sermon) {
      return new Response(JSON.stringify({ error: "Sermon not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    const existing = await db.questions.getBySermon(sermonId);
    if (existing.length >= 5) {
      return new Response(JSON.stringify({ message: "Questions already exist", count: existing.length }), { headers: { "Content-Type": "application/json" } });
    }

    const questions = await generateQuestions(sermon.content, sermon.age_bracket, apiKey);
    const valid = questions.filter((q) => q.question_text && q.options?.length === 4 && q.correct_answer);

    if (valid.length > 0) {
      await db.questions.createMany(valid.map((q) => ({
        sermon_id: sermonId,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        age_bracket: sermon.age_bracket,
      })));
    }

    return new Response(JSON.stringify({ generated: valid.length }), { headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

import { createDb } from "../lib/db";

export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  try {
    const url = new URL(request.url);
    const sermonId = parseInt(url.searchParams.get("sermonId") || "");
    if (!sermonId) {
      return new Response(JSON.stringify({ error: "sermonId required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const db = createDb(env.DB || null);
    const questions = await db.studyQuestions.getBySermon(sermonId);
    return new Response(JSON.stringify({ questions }), { headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

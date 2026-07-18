import { createDb } from "../../lib/db";

export async function onRequest({ request, env }: { request: Request; env: any }) {
  const db = createDb(env.DB || null);
  const url = new URL(request.url);

  try {
    if (request.method === "GET") {
      const sermonId = parseInt(url.searchParams.get("sermonId") || "");
      if (!sermonId) return new Response(JSON.stringify({ error: "sermonId required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const questions = await db.studyQuestions.getBySermon(sermonId);
      return new Response(JSON.stringify({ questions }), { headers: { "Content-Type": "application/json" } });
    }

    if (request.method === "POST") {
      const body = await request.json();
      if (!body.sermon_id || !body.question_text || !body.answer_text) {
        return new Response(JSON.stringify({ error: "sermon_id, question_text, answer_text required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
      const question = await db.studyQuestions.create({
        sermon_id: body.sermon_id,
        question_text: body.question_text,
        answer_text: body.answer_text,
      });
      return new Response(JSON.stringify({ question }), { status: 201, headers: { "Content-Type": "application/json" } });
    }

    if (request.method === "PUT") {
      const id = parseInt(url.searchParams.get("id") || "");
      if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const body = await request.json();
      const question = await db.studyQuestions.update(id, {
        question_text: body.question_text,
        answer_text: body.answer_text,
        sermon_id: body.sermon_id,
      });
      if (!question) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ question }), { headers: { "Content-Type": "application/json" } });
    }

    if (request.method === "DELETE") {
      const id = parseInt(url.searchParams.get("id") || "");
      if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      await db.studyQuestions.delete(id);
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Request failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

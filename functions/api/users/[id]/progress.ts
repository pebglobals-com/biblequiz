import { createDb } from "../../../lib/db";

export async function onRequestGet({ request, env, params }: { request: Request; env: any; params: any }) {
  const db = createDb(env.DB || null);
  const userId = parseInt(params.id, 10);
  if (isNaN(userId)) {
    return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const user = await db.users.getById(userId);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }
  const progress = await db.progress.getAll(userId);
  return new Response(JSON.stringify({ progress, ageBracket: user.age_bracket }), { headers: { "Content-Type": "application/json" } });
}

export async function onRequestPost({ request, env, params }: { request: Request; env: any; params: any }) {
  const db = createDb(env.DB || null);
  const userId = parseInt(params.id, 10);
  if (isNaN(userId)) {
    return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const user = await db.users.getById(userId);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }
  try {
    const body = await request.json();
    const { sermonId, completed, questionsDone } = body;
    if (!sermonId) {
      return new Response(JSON.stringify({ error: "Missing sermonId" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const result = await db.progress.upsert({ user_id: userId, sermon_id: sermonId, completed, questions_done: questionsDone });
    return new Response(JSON.stringify({ progress: result }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Progress update error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

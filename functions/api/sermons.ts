import { createDb } from "../lib/db";

export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  const url = new URL(request.url);
  const age = url.searchParams.get("age") || undefined;
  const db = createDb(env.DB || null);
  const sermons = await db.sermons.getAll(age);
  const stats = await db.stats.getCounts();
  return new Response(JSON.stringify({ sermons, stats }), {
    headers: { "Content-Type": "application/json" },
  });
}

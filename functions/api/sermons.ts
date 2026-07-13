import { db } from "../lib/db";

export async function onRequestGet({ request }: { request: Request }) {
  const url = new URL(request.url);
  const age = url.searchParams.get("age") || undefined;
  const sermons = db.sermons.getAll(age);
  const stats = db.stats.getCounts();
  return new Response(JSON.stringify({ sermons, stats }), {
    headers: { "Content-Type": "application/json" },
  });
}

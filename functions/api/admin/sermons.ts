import { createDb, toSlug } from "../../lib/db";

export async function onRequest({ request, env }: { request: Request; env: any }) {
  const db = createDb(env.DB || null);
  const url = new URL(request.url);

  try {
    if (request.method === "GET") {
      const sermons = await db.sermons.getAll();
      return new Response(JSON.stringify({ sermons }), { headers: { "Content-Type": "application/json" } });
    }

    if (request.method === "POST") {
      const body = await request.json();
      const slug = body.slug || toSlug(body.title);
      const sermon = await db.sermons.create({
        title: body.title,
        slug,
        source_url: body.source_url || "",
        content: body.content || "",
        excerpt: body.excerpt || "",
        age_bracket: body.age_bracket,
        category: body.category || "",
      });
      return new Response(JSON.stringify({ sermon }), { status: 201, headers: { "Content-Type": "application/json" } });
    }

    if (request.method === "PUT") {
      const id = parseInt(url.searchParams.get("id") || "");
      if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const body = await request.json();
      const sermon = await db.sermons.update(id, {
        title: body.title,
        slug: body.slug,
        source_url: body.source_url,
        content: body.content,
        excerpt: body.excerpt,
        age_bracket: body.age_bracket,
        category: body.category,
      });
      if (!sermon) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ sermon }), { headers: { "Content-Type": "application/json" } });
    }

    if (request.method === "DELETE") {
      const id = parseInt(url.searchParams.get("id") || "");
      if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      await db.sermons.delete(id);
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Request failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

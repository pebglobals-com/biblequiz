import { createDb } from "../../lib/db";

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const db = createDb(env.DB || null);
    const body = await request.json();
    const { first_name, last_name, branch, phone, email, age_bracket } = body;

    if (!first_name || !last_name || !branch || !email || !age_bracket) {
      return new Response(JSON.stringify({ error: "Missing required fields: first_name, last_name, branch, email, age_bracket" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (!["junior", "senior"].includes(age_bracket)) {
      return new Response(JSON.stringify({ error: "age_bracket must be 'junior' or 'senior'" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const user = await db.users.create({
      first_name,
      last_name,
      branch,
      phone: phone || "",
      email,
      age_bracket,
    });

    return new Response(JSON.stringify({ userId: user.id, ageBracket: user.age_bracket }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

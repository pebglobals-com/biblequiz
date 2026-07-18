import { createDb } from "../../lib/db";
import { verifyPassword } from "../../lib/password";

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const db = createDb(env.DB || null);
    const body = await request.json();
    const { email, password } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    if (!password) {
      return new Response(JSON.stringify({ error: "Password is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const user = await db.users.findByEmail(email);
    if (!user) {
      return new Response(JSON.stringify({ error: "No account found with this email" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    if (!user.email_verified) {
      return new Response(JSON.stringify({ error: "Please verify your email before signing in", needsVerification: true }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    if (!user.password_hash) {
      return new Response(JSON.stringify({ error: "This account was created before passwords were required. Please sign up again with a password." }), { status: 403, headers: { "Content-Type": "application/json" } });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ userId: user.id, ageBracket: user.age_bracket, firstName: user.first_name }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Signin error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

import { createDb } from "./lib/db";

export async function onRequestGet({ request, env }: { request: Request; env: any }) {
  try {
    const db = createDb(env.DB || null);
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response(null, { status: 302, headers: { Location: "/signin?error=missing_token" } });
    }

    const user = await db.users.findByVerificationToken(token);
    if (!user) {
      return new Response(null, { status: 302, headers: { Location: "/signin?error=invalid_token" } });
    }

    await db.users.updateVerification(user.id);

    return new Response(null, { status: 302, headers: { Location: "/signin?verified=1" } });
  } catch (err) {
    console.error("Verify error:", err);
    return new Response(null, { status: 302, headers: { Location: "/signin?error=server_error" } });
  }
}

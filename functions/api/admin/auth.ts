export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const { password } = await request.json();
    const adminPassword = env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return new Response(JSON.stringify({ success: false, error: "Admin password not configured" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    if (password === adminPassword) {
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify({ success: false, error: "Invalid password" }), { status: 401, headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ success: false, error: "Invalid request" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
}

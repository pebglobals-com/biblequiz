import { createDb } from "../../lib/db";
import { Resend } from "resend";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const db = createDb(env.DB || null);
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const user = await db.users.findByEmail(email);
    if (!user) {
      return new Response(JSON.stringify({ error: "No account found with this email" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    if (user.email_verified) {
      return new Response(JSON.stringify({ error: "This email is already verified. Please sign in." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const newToken = generateToken();
    await db.users.setToken(user.id, newToken);

    const origin = new URL(request.url).origin;
    const verifyUrl = `${origin}/verify?token=${newToken}`;

    try {
      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Bible Quiz <noreply@talent-loop.org>",
        to: email,
        subject: "Resend: Verify your email - Bible Quiz Guide",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h1 style="color: #1C1917;">Verify your email</h1>
            <p style="color: #78716C;">Hi ${user.first_name}, here's a new verification link.</p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 14px 28px; background: #7C3AED; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 16px 0;">Verify Email</a>
            <p style="color: #A8A29E; font-size: 13px;">Or paste this link into your browser:<br/>${verifyUrl}</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
      return new Response(JSON.stringify({ error: "Failed to send email. Please try again later." }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ message: "Verification email sent" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Resend verification error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

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
    const { first_name, last_name, branch, phone, email, age_bracket } = body;

    if (!first_name || !last_name || !branch || !email || !age_bracket) {
      return new Response(JSON.stringify({ error: "Missing required fields: first_name, last_name, branch, email, age_bracket" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    if (!["junior", "senior"].includes(age_bracket)) {
      return new Response(JSON.stringify({ error: "age_bracket must be 'junior' or 'senior'" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const existing = await db.users.findByEmail(email);
    if (existing) {
      return new Response(JSON.stringify({ error: "An account with this email already exists" }), { status: 409, headers: { "Content-Type": "application/json" } });
    }

    const verificationToken = generateToken();

    const user = await db.users.create({
      first_name,
      last_name,
      branch,
      phone: phone || "",
      email,
      age_bracket,
      email_verified: 0,
      verification_token: verificationToken,
    });

    const origin = new URL(request.url).origin;
    const verifyUrl = `${origin}/verify?token=${verificationToken}`;

    try {
      const resend = new Resend(env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Bible Quiz <noreply@biblequizguide.com>",
        to: email,
        subject: "Verify your email - Bible Quiz Guide",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h1 style="color: #1C1917;">Welcome to Bible Quiz Guide!</h1>
            <p style="color: #78716C;">Hi ${first_name}, thanks for signing up. Please verify your email address to get started.</p>
            <a href="${verifyUrl}" style="display: inline-block; padding: 14px 28px; background: #7C3AED; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 16px 0;">Verify Email</a>
            <p style="color: #A8A29E; font-size: 13px;">Or paste this link into your browser:<br/>${verifyUrl}</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
    }

    return new Response(JSON.stringify({ userId: user.id, ageBracket: user.age_bracket, message: "Please check your email to verify your account" }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

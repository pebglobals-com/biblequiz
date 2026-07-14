import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { first_name, last_name, branch, phone, email, age_bracket } = body;

    if (!first_name || !last_name || !branch || !email || !age_bracket) {
      return NextResponse.json(
        { error: "Missing required fields: first_name, last_name, branch, email, age_bracket" },
        { status: 400 }
      );
    }

    if (!["junior", "senior"].includes(age_bracket)) {
      return NextResponse.json(
        { error: "age_bracket must be 'junior' or 'senior'" },
        { status: 400 }
      );
    }

    const user = db.users.create({
      first_name,
      last_name,
      branch,
      phone: phone || "",
      email,
      age_bracket,
    });

    return NextResponse.json({ userId: user.id, ageBracket: user.age_bracket }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

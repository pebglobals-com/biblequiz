import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }
  const user = db.users.getById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const progress = db.progress.getAll(userId);
  return NextResponse.json({ progress, ageBracket: user.age_bracket });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }
  const user = db.users.getById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  try {
    const body = await request.json();
    const { sermonId, completed } = body;
    if (!sermonId || completed === undefined) {
      return NextResponse.json({ error: "Missing sermonId or completed" }, { status: 400 });
    }
    const result = db.progress.upsert({ user_id: userId, sermon_id: sermonId, completed });
    return NextResponse.json({ progress: result });
  } catch (err) {
    console.error("Progress update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

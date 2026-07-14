import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { questionId, selectedAnswer } = await request.json();
    if (!questionId) {
      return NextResponse.json({ error: "questionId required" }, { status: 400 });
    }

    const question = db.questions.getAll().find((q) => q.id === questionId);
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({
      isCorrect: selectedAnswer === question.correct_answer,
      correctAnswer: question.correct_answer,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

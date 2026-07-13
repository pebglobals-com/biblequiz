import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateQuestions } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { sermonId } = await req.json();

    if (!sermonId) {
      return NextResponse.json({ error: "sermonId is required" }, { status: 400 });
    }

    const sermon = db.sermons.getById(sermonId);
    if (!sermon) {
      return NextResponse.json({ error: "Sermon not found" }, { status: 404 });
    }

    const existing = db.questions.getBySermon(sermonId);
    if (existing.length >= 5) {
      return NextResponse.json({ message: "Questions already exist", count: existing.length });
    }

    const questions = await generateQuestions(sermon.content, sermon.age_bracket);
    const valid = questions.filter(
      (q) => q.question_text && q.options?.length === 4 && q.correct_answer
    );

    if (valid.length > 0) {
      db.questions.createMany(
        valid.map((q) => ({
          sermon_id: sermonId,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          age_bracket: sermon.age_bracket,
        }))
      );
    }

    return NextResponse.json({ generated: valid.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const age = req.nextUrl.searchParams.get("age") || undefined;
  const sermonIdsParam = req.nextUrl.searchParams.get("sermonIds");
  const withAnswers = req.nextUrl.searchParams.get("withAnswers") === "true";
  const sermonIds = sermonIdsParam
    ? sermonIdsParam.split(",").map(Number).filter(Boolean)
    : undefined;

  let questions = db.questions.getAll(age, sermonIds);

  const result = questions.map((q) => ({
    id: q.id,
    question_text: q.question_text,
    options: q.options,
    sermon_id: q.sermon_id,
    ...(withAnswers ? { correct_answer: q.correct_answer } : {}),
  }));

  return NextResponse.json({ questions: result, total: result.length });
}

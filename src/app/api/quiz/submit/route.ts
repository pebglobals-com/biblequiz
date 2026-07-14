import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId");
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }
    const session = db.quizSessions.getById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    const answers = db.quizAnswers.getBySession(sessionId);
    const results = answers.map((a) => {
      const q = db.questions.getAll().find((qq) => qq.id === a.question_id);
      const s = q ? db.sermons.getById(q.sermon_id) : undefined;
      let isCorrect: boolean | null = a.is_correct as any;
      if (typeof isCorrect === "number") isCorrect = isCorrect === 1 ? true : isCorrect === 0 ? false : null;
      return {
        question_id: a.question_id,
        question_text: q?.question_text || "Unknown",
        options: q?.options || [],
        correct_answer: q?.correct_answer || "",
        selected_answer: a.selected_answer,
        is_correct: isCorrect,
        sermon_title: s?.title || "Unknown",
      };
    });
    return NextResponse.json({ sessionId, score: session.score, total: session.total, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ageBracket, answers, sermonIds } = await request.json();

    if (!ageBracket || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "ageBracket and answers array required" },
        { status: 400 }
      );
    }

    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const sermonIdsStr = (sermonIds || []).join(",");

    const session = db.quizSessions.create({
      session_id: sessionId,
      age_bracket: ageBracket,
      sermon_ids: sermonIdsStr,
      score: 0,
      total: answers.length,
      completed_at: null,
    });

    let score = 0;
    const results: any[] = [];

    for (const answer of answers) {
      const question = db.questions
        .getAll()
        .find((q) => q.id === answer.questionId);

      if (!question) continue;

      const isCorrect = answer.selectedAnswer === question.correct_answer;
      if (isCorrect) score++;

      db.quizAnswers.create({
        session_id: sessionId,
        question_id: question.id,
        selected_answer: answer.selectedAnswer || null,
        is_correct: isCorrect ? 1 : 0,
        timestamp: new Date().toISOString(),
      });

      const sermon = db.sermons.getById(question.sermon_id);

      results.push({
        question_id: question.id,
        question_text: question.question_text,
        options: question.options,
        correct_answer: question.correct_answer,
        selected_answer: answer.selectedAnswer || null,
        is_correct: answer.selectedAnswer ? isCorrect : null,
        sermon_title: sermon?.title || "Unknown",
      });
    }

    db.quizSessions.update(sessionId, {
      score,
      completed_at: new Date().toISOString(),
    });

    return NextResponse.json({ sessionId, score, total: answers.length, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

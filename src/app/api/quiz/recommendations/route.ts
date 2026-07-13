import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getRecommendations } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const session = db.quizSessions.getById(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const answers = db.quizAnswers.getBySession(sessionId);
    const failedQuestionIds = answers
      .filter((a) => !a.is_correct)
      .map((a) => a.question_id);

    const allQuestions = db.questions.getAll();
    const failedQuestions = allQuestions
      .filter((q) => failedQuestionIds.includes(q.id))
      .map((q) => {
        const sermon = db.sermons.getById(q.sermon_id);
        return {
          question_text: q.question_text,
          sermon_title: sermon?.title || "Unknown",
        };
      });

    const allSermons = db.sermons.getAll().map((s) => ({
      id: s.id,
      title: s.title,
      category: s.category,
    }));

    let recommendations: any[] = [];

    if (failedQuestions.length > 0 && allSermons.length > 0) {
      recommendations = await getRecommendations(failedQuestions, allSermons);
    }

    return NextResponse.json({ recommendations, failedCount: failedQuestions.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

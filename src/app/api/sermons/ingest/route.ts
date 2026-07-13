import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categorizeContent, generateQuestions } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { url, ageBracket, text } = await req.json();

    if (!ageBracket || !["junior", "senior"].includes(ageBracket)) {
      return NextResponse.json({ error: "Valid ageBracket (junior/senior) is required" }, { status: 400 });
    }

    let content = text || "";

    if (url && !text) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();

        const textMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
        if (textMatch) {
          content = textMatch
            .map((p: string) => p.replace(/<[^>]*>/g, "").trim())
            .filter((t: string) => t.length > 20)
            .join("\n\n");
        }

        if (!content || content.length < 50) {
          content = html
            .replace(/<[^>]*>/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 10000);
        }
      } catch (err: any) {
        return NextResponse.json({ error: `Failed to fetch URL: ${err.message}` }, { status: 400 });
      }
    }

    if (!content || content.length < 20) {
      return NextResponse.json({ error: "Insufficient content. Provide valid URL or text." }, { status: 400 });
    }

    const categorized = await categorizeContent(content, ageBracket);
    const title = categorized.title;
    const category = categorized.category;
    const adjustedContent = categorized.adjustedContent;

    const sermon = db.sermons.create({
      title,
      source_url: url || "",
      content: adjustedContent,
      age_bracket: ageBracket,
      category,
    });

    const questions = await generateQuestions(adjustedContent, ageBracket);
    const validQuestions = questions.filter(
      (q) => q.question_text && q.options?.length === 4 && q.correct_answer
    );

    if (validQuestions.length > 0) {
      db.questions.createMany(
        validQuestions.map((q) => ({
          sermon_id: sermon.id,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          age_bracket: ageBracket,
        }))
      );
    }

    return NextResponse.json({
      sermon,
      questionsGenerated: validQuestions.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Ingestion failed" }, { status: 500 });
  }
}

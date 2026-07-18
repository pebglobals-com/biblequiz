import { createDb, toSlug } from "../../lib/db";
import { categorizeContent, generateQuestions } from "../../lib/ai";

export async function onRequestPost({ request, env }: { request: Request; env: any }) {
  try {
    const apiKey = env.OPENCODE_API_KEY || "";
    const db = createDb(env.DB || null);
    const { url, ageBracket, text } = await request.json();

    if (!ageBracket || !["junior", "senior"].includes(ageBracket)) {
      return new Response(JSON.stringify({ error: "Valid ageBracket (junior/senior) is required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    let content = text || "";

    if (url && !text) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        const textMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
        if (textMatch) {
          content = textMatch.map((p: string) => p.replace(/<[^>]*>/g, "").trim()).filter((t: string) => t.length > 20).join("\n\n");
        }
        if (!content || content.length < 50) {
          content = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 10000);
        }
      } catch (err: any) {
        return new Response(JSON.stringify({ error: `Failed to fetch URL: ${err.message}` }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
    }

    if (!content || content.length < 20) {
      return new Response(JSON.stringify({ error: "Insufficient content. Provide valid URL or text." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const categorized = await categorizeContent(content, ageBracket, apiKey);
    const sermon = await db.sermons.create({
      title: categorized.title,
      slug: toSlug(categorized.title),
      source_url: url || "",
      content: categorized.adjustedContent,
      excerpt: "",
      age_bracket: ageBracket,
      category: categorized.category,
    });

    const questions = await generateQuestions(categorized.adjustedContent, ageBracket, apiKey);
    const validQuestions = questions.filter((q) => q.question_text && q.options?.length === 4 && q.correct_answer);

    if (validQuestions.length > 0) {
      await db.questions.createMany(validQuestions.map((q) => ({
        sermon_id: sermon.id,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        age_bracket: ageBracket,
      })));
    }

    return new Response(JSON.stringify({ sermon, questionsGenerated: validQuestions.length }), { headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Ingestion failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

import { db } from "../lib/db";

export async function onRequestGet({ request }: { request: Request }) {
  const url = new URL(request.url);
  const age = url.searchParams.get("age") || undefined;
  const sermonIdsParam = url.searchParams.get("sermonIds");
  const withAnswers = url.searchParams.get("withAnswers") === "true";
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

  return new Response(JSON.stringify({ questions: result, total: result.length }), {
    headers: { "Content-Type": "application/json" },
  });
}

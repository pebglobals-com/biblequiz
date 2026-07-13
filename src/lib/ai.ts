const OPENCODE_API_URL = "https://api.opencode.ai/v1/chat/completions";
const MODEL = "deepseek-v4-flash";

function getApiKey(): string {
  const key = process.env.OPENCODE_API_KEY;
  if (!key) throw new Error("OPENCODE_API_KEY environment variable is not set");
  return key;
}

async function callAI(prompt: string, system?: string): Promise<string> {
  const apiKey = getApiKey();
  const res = await fetch(OPENCODE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        ...(system ? [{ role: "system" as const, content: system }] : []),
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenCode API error (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

function extractJSON(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text.trim();
}

export async function categorizeContent(
  text: string,
  ageBracket: "junior" | "senior"
): Promise<{
  title: string;
  category: string;
  adjustedContent: string;
}> {
  const level = ageBracket === "junior" ? "ages 5-12 (simple vocabulary, short sentences)" : "ages 13-22 (appropriate for teens, nuanced concepts)";
  const prompt = `Analyze the following Bible sermon/text and:
1. Suggest a concise title (max 6 words)
2. Categorize it into one of: Faith, Prayer, Love, Wisdom, Salvation, Discipleship, Prophecy, Grace, Worship, Service
3. Adjust the text for readability level: ${level}

Return ONLY a JSON object with keys: title, category, adjustedContent

TEXT:
${text.slice(0, 8000)}`;

  const response = await callAI(prompt);
  try {
    const parsed = JSON.parse(extractJSON(response));
    return {
      title: parsed.title || "Untitled Sermon",
      category: parsed.category || "Faith",
      adjustedContent: parsed.adjustedContent || text,
    };
  } catch {
    return {
      title: "Untitled Sermon",
      category: "Faith",
      adjustedContent: text,
    };
  }
}

export async function generateQuestions(
  text: string,
  ageBracket: "junior" | "senior"
): Promise<{ question_text: string; options: string[]; correct_answer: string }[]> {
  const level = ageBracket === "junior"
    ? "children ages 5-12 (use simple language, clear concepts, short questions)"
    : "teenagers/young adults ages 13-22 (thought-provoking, moderately challenging)";

  const systemPrompt = `You are a Bible quiz question generator. Generate multiple-choice questions based on the provided sermon text.
Each question must have exactly 4 options with one correct answer. Return a JSON array of objects with keys: question_text, options (array of 4 strings), correct_answer (the exact correct option string).
Generate exactly 8 questions for ${level}. Ensure questions test comprehension of the text.`;

  const prompt = `Generate 8 multiple-choice Bible quiz questions from this sermon text:\n\n${text.slice(0, 8000)}`;

  const response = await callAI(prompt, systemPrompt);
  try {
    const cleaned = extractJSON(response);
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

export async function getRecommendations(
  failedQuestions: { question_text: string; sermon_title: string }[],
  allSermons: { id: number; title: string; category: string }[]
): Promise<{ topic: string; reason: string; sermon_id: number }[]> {
  const failedList = failedQuestions.map((f) => `- "${f.question_text}" (from: ${f.sermon_title})`).join("\n");
  const availableTopics = allSermons.map((s) => `${s.id}: ${s.title} [${s.category}]`).join("\n");

  const prompt = `A student failed these quiz questions:\n${failedList}\n\nAvailable study materials:\n${availableTopics}\n\nRecommend up to 3 specific topics/sermons the student should review to improve. For each, explain WHY it helps with the specific mistakes.

Return a JSON array of objects with keys: topic (the sermon title), reason (specific explanation), sermon_id (the numeric ID). Only use IDs that exist in the available materials list.`;

  const response = await callAI(prompt);
  try {
    return JSON.parse(extractJSON(response));
  } catch {
    return [];
  }
}

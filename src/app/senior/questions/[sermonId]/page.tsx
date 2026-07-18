import SeniorQuestionsClient from "./client";
import { SermonData } from "@/lib/mockData";

export async function generateStaticParams() {
  const ids = SermonData.filter((s) => s.age_bracket === "senior").map((s) => ({ sermonId: String(s.id) }));
  ids.push({ sermonId: "placeholder" });
  return ids;
}

export default async function SeniorQuestionsPage({ params }: { params: Promise<{ sermonId: string }> }) {
  const { sermonId } = await params;
  return <SeniorQuestionsClient sermonId={sermonId} />;
}

import JuniorQuestionsClient from "./client";
import { SermonData } from "@/lib/mockData";

export function generateStaticParams() {
  return SermonData.filter((s) => s.age_bracket === "junior").map((s) => ({ sermonId: String(s.id) }));
}

export default async function JuniorQuestionsPage({ params }: { params: Promise<{ sermonId: string }> }) {
  const { sermonId } = await params;
  return <JuniorQuestionsClient sermonId={sermonId} />;
}

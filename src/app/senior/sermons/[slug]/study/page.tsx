import SeniorStudyClient from "./client";
import { SermonData } from "@/lib/mockData";

export async function generateStaticParams() {
  return SermonData.filter((s) => s.age_bracket === "senior").map((s) => ({ slug: s.slug }));
}

export default async function SeniorStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SeniorStudyClient slug={slug} />;
}

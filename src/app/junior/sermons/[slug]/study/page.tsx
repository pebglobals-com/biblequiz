import JuniorStudyClient from "./client";
import { SermonData } from "@/lib/mockData";

export async function generateStaticParams() {
  return SermonData.filter((s) => s.age_bracket === "junior").map((s) => ({ slug: s.slug }));
}

export default async function JuniorStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <JuniorStudyClient slug={slug} />;
}

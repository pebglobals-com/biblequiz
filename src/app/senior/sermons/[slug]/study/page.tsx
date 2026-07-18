import SeniorStudyClient from "./client";
import { SermonData } from "@/lib/mockData";

export async function generateStaticParams() {
  const slugs = SermonData.filter((s) => s.age_bracket === "senior").map((s) => ({ slug: s.slug }));
  slugs.push({ slug: "placeholder" });
  return slugs;
}

export default async function SeniorStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SeniorStudyClient slug={slug} />;
}

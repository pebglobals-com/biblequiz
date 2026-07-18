import JuniorStudyClient from "./client";
import { SermonData } from "@/lib/mockData";

export async function generateStaticParams() {
  const slugs = SermonData.filter((s) => s.age_bracket === "junior").map((s) => ({ slug: s.slug }));
  slugs.push({ slug: "placeholder" });
  return slugs;
}

export default async function JuniorStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <JuniorStudyClient slug={slug} />;
}

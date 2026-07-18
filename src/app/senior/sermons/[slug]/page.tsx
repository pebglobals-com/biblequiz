import SeniorSermonArticleClient from "./client";
import { SermonData } from "@/lib/mockData";

export async function generateStaticParams() {
  const slugs = SermonData.filter((s) => s.age_bracket === "senior").map((s) => ({ slug: s.slug }));
  slugs.push({ slug: "placeholder" });
  return slugs;
}

export default async function SeniorSermonArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SeniorSermonArticleClient slug={slug} />;
}

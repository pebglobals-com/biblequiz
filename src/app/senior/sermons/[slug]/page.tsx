import SeniorSermonArticleClient from "./client";

export async function generateStaticParams() { return [{ slug: "placeholder" }]; }

export default async function SeniorSermonArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SeniorSermonArticleClient slug={slug} />;
}

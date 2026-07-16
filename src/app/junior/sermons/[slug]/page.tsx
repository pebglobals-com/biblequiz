import JuniorSermonArticleClient from "./client";

export async function generateStaticParams() { return [{ slug: "placeholder" }]; }

export default async function JuniorSermonArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <JuniorSermonArticleClient slug={slug} />;
}

import JuniorStudyClient from "./client";

export async function generateStaticParams() { return [{ slug: "placeholder" }]; }

export default async function JuniorStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <JuniorStudyClient slug={slug} />;
}

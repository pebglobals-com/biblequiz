import SeniorStudyClient from "./client";

export async function generateStaticParams() { return [{ slug: "placeholder" }]; }

export default async function SeniorStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SeniorStudyClient slug={slug} />;
}

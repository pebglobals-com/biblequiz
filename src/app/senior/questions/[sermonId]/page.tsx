import SeniorQuestionsClient from "./client";

export async function generateStaticParams() { return [{ sermonId: "placeholder" }]; }

export default async function SeniorQuestionsPage({ params }: { params: Promise<{ sermonId: string }> }) {
  const { sermonId } = await params;
  return <SeniorQuestionsClient sermonId={sermonId} />;
}

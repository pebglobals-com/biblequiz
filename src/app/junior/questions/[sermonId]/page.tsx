import JuniorQuestionsClient from "./client";

export function generateStaticParams() {
  return [{ sermonId: "placeholder" }];
}

export default async function JuniorQuestionsPage({ params }: { params: Promise<{ sermonId: string }> }) {
  const { sermonId } = await params;
  return <JuniorQuestionsClient sermonId={sermonId} />;
}

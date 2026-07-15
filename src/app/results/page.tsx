"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ResultsDashboard from "@/components/ResultsDashboard";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("sessionId");
  const age = searchParams.get("age") || "junior";

  const [data, setData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    const sid: string = sessionId;

    async function fetchResults() {
      try {
        const res = await fetch(`/api/quiz/submit?sessionId=${encodeURIComponent(sid)}`);
        const result = await res.json();
        setData(result);

        const recRes = await fetch("/api/quiz/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid }),
        });
        const recData = await recRes.json();
        setRecommendations(recData.recommendations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [sessionId]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading results...</div>;
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">No results found</p>
        <button onClick={() => router.push("/quiz/setup")} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          Take a Quiz
        </button>
      </div>
    );
  }

  return (
    <ResultsDashboard
      score={data.score}
      total={data.total}
      results={data.results || []}
      recommendations={recommendations}
      ageBracket={age}
    />
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-bible-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

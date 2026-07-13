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

    async function fetchResults() {
      try {
        const res = await fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const result = await res.json();
        setData(result);

        const recRes = await fetch("/api/quiz/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
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
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

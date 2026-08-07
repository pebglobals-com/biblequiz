"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SermonData {
  id: number;
  title: string;
  slug: string;
  category: string;
  content: string;
  age_bracket: string;
  created_at: string;
}

export default function JuniorStudyClient({ slug }: { slug: string }) {
  const [sermon, setSermon] = useState<SermonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/sermons?age=junior");
        const data = await res.json();
        const found = (data.sermons || []).find((s: SermonData) => s.slug === slug);
        setSermon(found || null);
      } catch (err) {
        console.error("Failed to load sermon:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="skeleton h-5 w-40 mb-6" />
          <div className="skeleton h-64 rounded-2xl mb-4" />
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-2xl font-bold text-ink mb-2">Sermon Not Found</h1>
          <p className="text-ink-muted mb-6">This sermon doesn&apos;t exist or has been moved.</p>
          <Link href="/junior/dashboard" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const bracket = "junior";

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 -z-10 bg-surface">
        <div className="absolute inset-0 bg-dots-light" />
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href={`/${bracket}/dashboard`}
          className="inline-flex items-center gap-2 text-ink-muted hover:text-brand-600 transition-colors mb-6 group animate-in"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <article className="bg-white rounded-2xl border border-surface-border shadow-sm overflow-hidden animate-in" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
          <div className="relative bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-8 sm:p-12">
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                  {sermon.category}
                </span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                  🧒 Junior
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
                {sermon.title}
              </h1>
              <p className="mt-3 text-white/70 text-sm">
                {new Date(sermon.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="space-y-6 text-ink leading-relaxed text-lg font-sans">
              {sermon.content.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-surface-border">
              <div className="text-center space-y-4">
                <p className="text-ink-muted text-sm">
                  Deepen your understanding with study questions, then test your knowledge with a quiz.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/${bracket}/questions/${sermon.id}`}
                    className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Continue to Study Questions
                  </Link>
                  <Link
                    href={`/${bracket}/dashboard`}
                    className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

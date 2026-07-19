"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SermonData {
  id: number;
  title: string;
  slug: string;
  content: string;
  age_bracket: string;
  category: string;
  created_at: string;
}

export default function JuniorSermonArticleClient({ slug }: { slug: string }) {
  const [sermon, setSermon] = useState<SermonData | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/sermons?age=junior");
        const data = await res.json();
        const found = (data.sermons || []).find((s: SermonData) => s.slug === slug);
        setSermon(found || null);
        if (found) {
          const qRes = await fetch(`/api/questions?age=junior&sermonIds=${found.id}`);
          const qData = await qRes.json();
          setQuestionCount(qData.total || 0);
        }
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="skeleton h-4 w-32 mb-6" />
          <div className="skeleton h-64 rounded-2xl mb-8" />
          <div className="skeleton h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sermon Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This sermon doesn't exist or has been moved.</p>
          <Link href="/junior/sermons" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Sermons
          </Link>
        </div>
      </div>
    );
  }

  const excerpt = sermon.content.split('\n')[0].substring(0, 200) || sermon.content.substring(0, 200);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/junior" className="flex items-center gap-2">
                <svg className="w-8 h-8 text-bible-600 dark:text-bible-400" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M40 80L340 80C356.569 80 370 93.4315 370 110L370 402C370 418.569 356.569 432 340 432L40 432C23.4315 432 10 418.569 10 402L10 110C10 93.4315 23.4315 80 40 80Z" stroke="currentColor" strokeWidth="20" fill="none"/>
                  <path d="M340 80L380 80C396.569 80 410 93.4315 410 110L410 402C410 418.569 396.569 432 380 432L340 432" stroke="currentColor" strokeWidth="20" fill="none" opacity="0.3"/>
                  <path d="M190 150L190 362" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round"/>
                  <path d="M130 256L250 256" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round"/>
                </svg>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  <span className="text-bible-600 dark:text-bible-400">Youth Bible Quiz</span> Junior
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-6">
                <Link href="/junior" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-bible-600 dark:hover:text-bible-400 transition-colors">Home</Link>
                <Link href="/junior/sermons" className="px-3 py-2 rounded-lg text-sm font-medium bg-bible-50 dark:bg-bible-900/30 text-bible-700 dark:text-bible-300">Sermons</Link>
                <Link href="/junior/questions" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-bible-600 dark:hover:text-bible-400 transition-colors">Q & A</Link>
                <Link href="/junior/quiz" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-bible-600 dark:hover:text-bible-400 transition-colors">Quiz</Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/junior" className="text-gray-500 dark:text-gray-400 hover:text-bible-600 dark:hover:text-bible-400">Junior</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            <Link href="/junior/sermons" className="text-gray-500 dark:text-gray-400 hover:text-bible-600 dark:hover:text-bible-400">Sermons</Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">{sermon.title}</span>
          </nav>

          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-blue-500 via-bible-600 to-purple-700">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                    {sermon.category}
                  </span>
                  <span className="px-3 py-1.5 bg-blue-500/20 backdrop-blur-sm rounded-full text-sm font-medium text-blue-200">
                    Ages 5-12
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{sermon.title}</h1>
                <p className="mt-3 text-blue-100 text-lg max-w-2xl">{excerpt}</p>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              <div className="text-gray-500 dark:text-gray-400 mb-8">
                <span className="font-medium">Published: </span>
                {new Date(sermon.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {sermon.content.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-lg">{paragraph}</p>
                  ))}
                </div>
              </div>

              {questionCount > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-bible-50 to-purple-50 dark:from-bible-900/20 dark:to-purple-900/20 rounded-2xl mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-bible-500 to-purple-500 flex items-center justify-center text-white">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.5-3.112 2.99C9.678 13.116 12 14 12 14v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4c0-2.757 2.772-4 7.228-4 1.25 0 2.366.423 3.204 1.138M8 15v-1c0-1.183.534-2.154 1.404-2.748A23.068 23.068 0 0112 10c1.718 0 3.405.39 4.596 1.048.87.594 1.404 1.565 1.404 2.748v1" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Study Questions Available</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">{questionCount} Q&A pairs to help you learn</p>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/junior/questions/${sermon.id}`}
                      className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-3"
                    >
                      <span>Go to Questions & Answers</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/junior/sermons" className="btn-secondary px-8 py-3 text-center">
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Sermons
                  </Link>
                  <Link href="/junior/quiz" className="btn-primary px-8 py-3 text-center">
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Take a Quiz
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Youth Bible Quiz Guide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

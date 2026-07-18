"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Sermon {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  age_bracket: string;
  category: string;
  created_at: string;
}

export default function JuniorSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sermons?age=junior")
      .then(r => r.json())
      .then(d => setSermons(d.sermons || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const juniorSermons = sermons;

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
                  <span className="text-bible-600 dark:text-bible-400">Bible Quiz</span> Junior
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-6">
                <Link href="/junior" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-bible-600 dark:hover:text-bible-400 transition-colors">Home</Link>
                <Link href="/junior/sermons" className="px-3 py-2 rounded-lg text-sm font-medium bg-bible-50 dark:bg-bible-900/30 text-bible-700 dark:text-bible-300">Sermons</Link>
                <Link href="/junior/questions" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-bible-600 dark:hover:text-bible-400 transition-colors">Q & A</Link>
                <Link href="/junior/quiz" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-bible-600 dark:hover:text-bible-400 transition-colors">Quiz</Link>
              </div>
            </div>
            <Link href="/junior/quiz" className="bg-gradient-to-r from-bible-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-bible-500/25 hover:shadow-bible-500/40 hover:scale-[1.02] transition-all duration-200 hidden sm:block">
              Start Quiz
            </Link>
          </div>
        </nav>
      </header>

      <main className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <nav className="flex items-center gap-2 text-sm mb-6">
              <Link href="/junior" className="text-gray-500 dark:text-gray-400 hover:text-bible-600 dark:hover:text-bible-400">Junior</Link>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              <span className="text-gray-900 dark:text-white font-medium">Sermons & Articles</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Sermons & Articles</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl">Explore age-appropriate Bible lessons and stories for young hearts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {juniorSermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading...</div>
          ) : juniorSermons.length === 0 && (
            <div className="text-center py-20">
              <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Sermons Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Check back soon for new Bible lessons!</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Bible Quiz Guide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

interface SermonCardProps {
  sermon: any;
}

function SermonCard({ sermon }: SermonCardProps) {
  return (
    <Link href={`/junior/sermons/${sermon.slug}`} className="block group">
      <div className="card-hover h-full overflow-hidden bg-white dark:bg-gray-800">
        <div className="aspect-video relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 overflow-hidden">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              Read Article
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
              {sermon.category}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-bible-600 dark:group-hover:text-bible-400 transition-colors line-clamp-2">
            {sermon.title}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
            {sermon.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(sermon.created_at).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-1 text-bible-600 dark:text-bible-400 font-medium text-sm group-hover:gap-2 transition-all">
              <span>Read More</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
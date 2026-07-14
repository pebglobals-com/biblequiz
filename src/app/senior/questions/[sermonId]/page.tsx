"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { SermonData, QuestionData } from "@/lib/mockData";

export default function SeniorQuestionsPage() {
  const params = useParams();
  const sermonId = parseInt(params.sermonId as string);
  
  const sermon = SermonData.find(s => s.id === sermonId && s.age_bracket === "senior");
  const questions = QuestionData.filter(q => q.sermon_id === sermonId && q.age_bracket === "senior");

  if (!sermon) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Topic Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This topic doesn't exist or has been moved.</p>
          <Link href="/senior/questions" className="text-bible-600 dark:text-bible-400 hover:underline">Back to Q&A</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/senior" className="flex items-center gap-2">
                <svg className="w-8 h-8 text-bible-600 dark:text-bible-400" viewBox="0 0 512 512" fill="currentColor">
                  <path d="M40 80L340 80C356.569 80 370 93.4315 370 110L370 402C370 418.569 356.569 432 340 432L40 432C23.4315 432 10 418.569 10 402L10 110C10 93.4315 23.4315 80 40 80Z" stroke="currentColor" strokeWidth="20" fill="none"/>
                  <path d="M340 80L380 80C396.569 80 410 93.4315 410 110L410 402C410 418.569 396.569 432 380 432L340 432" stroke="currentColor" strokeWidth="20" fill="none" opacity="0.3"/>
                  <path d="M190 150L190 362" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round"/>
                  <path d="M130 256L250 256" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round"/>
                </svg>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  <span className="text-bible-600 dark:text-bible-400">Bible Quiz</span> Senior
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-6">
                <Link href="/senior/sermons" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-bible-600 dark:hover:text-bible-400 transition-colors">Sermons</Link>
                <Link href="/senior/questions" className="px-3 py-2 rounded-lg text-sm font-medium bg-bible-50 dark:bg-bible-900/30 text-bible-700 dark:text-bible-300">Q & A</Link>
                <Link href="/senior/quiz" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-bible-600 dark:hover:text-bible-400 transition-colors">Quiz</Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            href={`/senior/sermons/${sermon.slug}`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-bible-600 dark:hover:text-bible-400 transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Article
          </Link>
          
          <div className="bg-gradient-to-r from-bible-50 to-purple-50 dark:from-bible-900/20 dark:to-purple-900/20 rounded-2xl p-6 sm:p-8 border border-bible-100 dark:border-bible-900/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs px-3 py-1.5 rounded-full bg-bible-100 dark:bg-bible-900/50 text-bible-700 dark:text-bible-300 font-medium">
                {sermon.category}
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-medium">
                Ages 13-22
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">{sermon.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Study {questions.length} questions and answers to master this topic.
            </p>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❓</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Questions Yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Questions for this topic will appear here once generated.</p>
            <Link href="/senior/sermons" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Browse Topics
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Questions & Answers ({questions.length})
              </h2>
            </div>

            {questions.map((question, index) => (
              <div 
                key={question.id} 
                className="card-hover p-6 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-bible-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Q: {question.question_text}
                    </h3>
                    <div className="space-y-2 ml-14">
                      {question.options.map((option, optIndex) => (
                        <div 
                          key={optIndex}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            option === question.correct_answer
                              ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-800"
                              : "bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
                          }`}
                        >
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                            option === question.correct_answer
                              ? "bg-emerald-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          }`}>
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className={`font-medium ${
                            option === question.correct_answer
                              ? "text-emerald-800 dark:text-emerald-200"
                              : "text-gray-700 dark:text-gray-300"
                          }`}>
                            {option}
                            {option === question.correct_answer && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                                ✓ Correct
                              </span>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/senior/sermons/${sermon.slug}`}
              className="btn-secondary px-8 py-3 text-center"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Read the Article
            </Link>
            <Link 
              href="/senior/quiz"
              className="btn-primary px-8 py-3 text-center"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Take a Quiz
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Bible Quiz Guide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
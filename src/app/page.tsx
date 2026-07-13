import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="text-6xl mb-6">📖</div>
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        Bible Quiz Guide
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Learn the Bible through interactive quizzes tailored for your age group.
        AI-powered questions from real sermons and topics.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-md"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/quiz/setup"
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-md"
        >
          Start Quiz
        </Link>
      </div>
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-bold mb-1">Age-Appropriate</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Junior (5-12) and Senior (13-22) tracks</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-2">🤖</div>
          <h3 className="font-bold mb-1">AI-Powered</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Smart Q&A generation and recommendations</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-bold mb-1">Detailed Analytics</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track progress and get study tips</p>
        </div>
      </div>
    </div>
  );
}

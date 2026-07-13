import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center relative">
      <div className="absolute inset-0 bg-gradient-radial from-bible-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative animate-in" style={{ animationDelay: "0.1s" }}>
        <div className="text-7xl mb-6 animate-float">📖</div>
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight">
          <span className="text-gradient">Bible Quiz</span>
          <br />
          <span className="text-gray-800 dark:text-gray-200">Guide</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-10 leading-relaxed">
          Learn the Bible through interactive quizzes tailored for your age group.
          AI-powered questions from real sermons and topics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="btn-primary text-lg">
            <span className="flex items-center gap-2">
              Go to Dashboard
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <Link href="/quiz/setup" className="btn-success text-lg">
            <span className="flex items-center gap-2">
              Start Quiz
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full relative animate-in" style={{ animationDelay: "0.3s" }}>
        <FeatureCard
          icon="🎯"
          title="Age-Appropriate"
          desc="Junior (5-12) and Senior (13-22) tracks"
          delay="0ms"
        />
        <FeatureCard
          icon="🤖"
          title="AI-Powered"
          desc="Smart Q&A generation and recommendations"
          delay="100ms"
        />
        <FeatureCard
          icon="📊"
          title="Detailed Analytics"
          desc="Track progress and get study tips"
          delay="200ms"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: string; title: string; desc: string; delay: string }) {
  return (
    <div
      className="card-hover p-6 text-center group"
      style={{ animationDelay: delay }}
    >
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
  );
}

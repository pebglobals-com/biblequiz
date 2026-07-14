"use client";

import Link from "next/link";
import { SermonData, QuestionData } from "@/lib/mockData";

export default function SeniorHomePage() {
  const seniorSermons = SermonData.filter(s => s.age_bracket === "senior");
  const seniorQuestions = QuestionData.filter(q => q.age_bracket === "senior");
  const uniqueSermonsWithQuestions = [...new Map(seniorQuestions.map(q => [q.sermon_id, q])).values()];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
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
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/senior/sermons" className="text-gray-600 dark:text-gray-300 hover:text-bible-600 dark:hover:text-bible-400 font-medium transition-colors">Sermons</Link>
              <Link href="/senior/questions" className="text-gray-600 dark:text-gray-300 hover:text-bible-600 dark:hover:text-bible-400 font-medium transition-colors">Q & A</Link>
              <Link href="/senior/quiz" className="bg-gradient-to-r from-bible-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-bible-500/25 hover:shadow-bible-500/40 hover:scale-[1.02] transition-all duration-200">Start Quiz</Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative bg-gradient-to-br from-bible-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20 lg:py-28">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-3.997V6h3.997v28zm-20 0V6h4v28H16zm20-24v4h-2V6h4v-2h-2zm-20 0V6h2v-2h-2zm-4 4v2H2V10h2zm0 4v2H2V14h2zm0 4v2H2V18h2zm0 4v2H2V22h2zm0 4v2H2V26h2zm0 4v2H2V30h2zm0 4v2H2V34h2zm0 4v2H2V38h2zm0 4v2H2V42h2zm0 4v2H2V46h2zm0 4v2H2v-2h2zm4-36v2h-2V10h2zm0 4v2h-2V14h2zm0 4v2h-2V18h2zm0 4v2h-2V22h2zm0 4v2h-2V26h2zm0 4v2h-2V30h2zm0 4v2h-2V34h2zm0 4v2h-2V38h2zm0 4v2h-2V42h2zm0 4v2h-2V46h2z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          <div className="absolute inset-0 bg-gradient-radial from-bible-500/10 via-transparent to-transparent" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Ages 13-22 • Deep & Challenging Bible Study
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                Welcome to <span className="bg-gradient-to-r from-bible-600 to-purple-600 bg-clip-text text-transparent">Senior Bible Quiz</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Engage with deep theological topics, apologetics, worldview studies, and challenging quizzes designed for maturing faith and critical thinking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/senior/sermons" className="btn-primary text-lg px-8 py-4">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Browse Topics
                  </span>
                </Link>
                <Link href="/senior/quiz" className="btn-secondary text-lg px-8 py-4 border-2 border-bible-500 text-bible-700 dark:text-bible-300 hover:bg-bible-50 dark:hover:bg-bible-900/20">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Take a Quiz
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent" />
        </section>

        <section className="py-20 lg:py-28 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Explore Senior Categories</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Choose your learning path</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CategoryNavCard
                title="Sermons & Articles"
                description="In-depth theological studies, apologetics, and biblical worldview articles"
                icon={<BookOpenIcon className="w-10 h-10" />}
                href="/senior/sermons"
                stats={[
                  { label: "Topics", value: seniorSermons.length },
                  { label: "Categories", value: [...new Set(seniorSermons.map(s => s.category))].length }
                ]}
                gradient="from-bible-500 to-purple-500"
                bgGradient="from-bible-50 to-purple-50 dark:from-bible-900/20 dark:to-purple-900/10"
              />
              <CategoryNavCard
                title="Questions & Answers"
                description="Study Q&A pairs for each topic to deepen understanding and retention"
                icon={<HelpCircleIcon className="w-10 h-10" />}
                href="/senior/questions"
                stats={[
                  { label: "Q&A Pairs", value: seniorQuestions.length },
                  { label: "Topics Covered", value: uniqueSermonsWithQuestions.length }
                ]}
                gradient="from-purple-500 to-pink-500"
                bgGradient="from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/10"
              />
              <CategoryNavCard
                title="Bible Quiz"
                description="Test your knowledge with timed quizzes from the Q&A you studied"
                icon={<TrophyIcon className="w-10 h-10" />}
                href="/senior/quiz"
                stats={[
                  { label: "Questions", value: seniorQuestions.length },
                  { label: "Modes", value: "Timed & Practice" }
                ]}
                gradient="from-emerald-500 to-teal-500"
                bgGradient="from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10"
              />
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Featured Topics</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Deep studies for growing in faith and knowledge</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seniorSermons.slice(0, 6).map((sermon) => (
                <SermonPreviewCard key={sermon.id} sermon={sermon} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/senior/sermons" className="btn-secondary text-lg px-8 py-3">
                View All Topics
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Theological Depth"
                description="Explore rich theological topics including the Trinity, atonement, sanctification, and biblical doctrine with intellectual rigor."
                icon={<BrainIcon className="w-8 h-8" />}
              />
              <FeatureCard
                title="Apologetics Training"
                description="Learn to defend your faith with evidence-based arguments for God's existence, Bible reliability, and the resurrection."
                icon={<ShieldIcon className="w-8 h-8" />}
              />
              <FeatureCard
                title="Worldview Formation"
                description="Develop a robust biblical worldview to navigate cultural challenges, ethical dilemmas, and competing philosophies."
                icon={<CompassIcon className="w-8 h-8" />}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-xl mb-4 hover:text-bible-400 transition-colors">
            <svg className="w-8 h-8 text-bible-400" viewBox="0 0 512 512" fill="currentColor">
              <path d="M40 80L340 80C356.569 80 370 93.4315 370 110L370 402C370 418.569 356.569 432 340 432L40 432C23.4315 432 10 418.569 10 402L10 110C10 93.4315 23.4315 80 40 80Z" stroke="currentColor" strokeWidth="20" fill="none"/>
              <path d="M340 80L380 80C396.569 80 410 93.4315 410 110L410 402C410 418.569 396.569 432 380 432L340 432" stroke="currentColor" strokeWidth="20" fill="none" opacity="0.3"/>
              <path d="M190 150L190 362" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round"/>
              <path d="M130 256L250 256" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round"/>
            </svg>
            Bible Quiz Guide
          </Link>
          <p className="text-sm">&copy; {new Date().getFullYear()} Bible Quiz Guide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

interface CategoryNavCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  stats: { label: string; value: number | string }[];
  gradient: string;
  bgGradient: string;
}

function CategoryNavCard({ title, description, icon, href, stats, gradient, bgGradient }: CategoryNavCardProps) {
  return (
    <Link href={href} className="block group">
      <div className={`card-hover p-8 h-full relative overflow-hidden bg-gradient-to-br ${bgGradient} border border-transparent group-hover:border-bible-300 dark:group-hover:border-bible-700`}>
        <div className="absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
        
        <div className="relative">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-bible-600 dark:group-hover:text-bible-400 transition-colors">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-bible-600 dark:text-bible-400 font-semibold group-hover:gap-3 transition-all duration-300">
            <span>Explore</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface SermonPreviewCardProps {
  sermon: any;
}

function SermonPreviewCard({ sermon }: SermonPreviewCardProps) {
  return (
    <Link href={`/senior/sermons/${sermon.slug}`} className="block group">
      <div className="card-hover h-full overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-bible-500 to-purple-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              Read Article
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-medium">
              {sermon.category}
            </span>
          </div>
          
          <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-bible-600 dark:group-hover:text-bible-400 transition-colors line-clamp-2">
            {sermon.title}
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
            {sermon.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(sermon.created_at).toLocaleDateString()}
            </span>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-bible-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 57-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="card p-8 text-center group">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-bible-500 to-purple-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

// Icons
function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function HelpCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.734-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function CompassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  );
}
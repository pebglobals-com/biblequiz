"use client";

import BibleIcon from "@/components/BibleIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  {
    id: "junior",
    title: "Junior",
    emoji: "🧒",
    age: "Ages 5-12",
    desc: "Fun & engaging Bible learning with simple stories, colorful topics, and friendly quizzes.",
    gradient: "from-blue-500 to-purple-500",
    bgGradient: "from-blue-50 to-purple-50",
    border: "hover:border-blue-300",
    text: "text-blue-700",
  },
  {
    id: "senior",
    title: "Senior",
    emoji: "🧑",
    age: "Ages 13-22",
    desc: "Deep & challenging Bible study with theology, apologetics, and critical thinking quizzes.",
    gradient: "from-bible-600 to-purple-600",
    bgGradient: "from-bible-50 to-purple-50",
    border: "hover:border-bible-300",
    text: "text-bible-700",
  },
];

export default function ChooseCategoryPage() {
  const router = useRouter();

  function choose(bracket: string) {
    localStorage.setItem("ageBracket", bracket);
    router.push(`/${bracket}/dashboard`);
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-surface">
        <div className="absolute inset-0 bg-dots-light" />
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-14">
          <div className="mb-6 flex justify-center">
            <BibleIcon className="w-16 h-16 rounded-2xl" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink mb-4 text-balance">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              Category
            </span>
          </h1>
          <p className="text-ink-muted max-w-xl mx-auto text-base sm:text-lg">
            Pick the age group that fits you best. You can switch categories anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((c, i) => (
            <button
              key={c.id}
              onClick={() => choose(c.id)}
              className="card-hover p-8 text-left bg-gradient-to-br ${c.bgGradient} border border-surface-border group animate-in"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {c.emoji}
                </div>
                <svg
                  className="w-6 h-6 text-ink-light group-hover:text-brand-600 group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              <span
                className={`inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full ${c.text} font-semibold`}
              >
                {c.age}
              </span>

              <h2 className="font-display text-2xl font-bold text-ink mt-3 mb-2">
                {c.title}
              </h2>
              <p className="text-ink-muted text-sm leading-relaxed mb-6">{c.desc}</p>

              <span className={`inline-flex items-center gap-2 font-semibold ${c.text} text-sm`}>
                Enter {c.title} Dashboard
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="text-sm text-ink-light hover:text-brand-600 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

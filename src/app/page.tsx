"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const verses = [
  { text: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.", ref: "John 3:16" },
  { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" },
  { text: "Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.", ref: "Proverbs 3:5-6" },
  { text: "But those who wait on the Lord shall renew their strength; they shall mount up with wings like eagles.", ref: "Isaiah 40:31" },
  { text: "Therefore, if anyone is in Christ, he is a new creation; old things have passed away; behold, all things have become new.", ref: "2 Corinthians 5:17" },
];

const features = [
  {
    id: "quiz",
    title: "Smart Quiz",
    desc: "Challenge yourself with AI-powered quizzes tailored to your learning pace and knowledge level.",
    featured: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    id: "study",
    title: "Study Sermons",
    desc: "Read and understand God's Word through age-appropriate sermons and articles.",
    featured: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    id: "practice",
    title: "Practice Questions",
    desc: "Test your knowledge on each topic with curated Q&A sessions for all skill levels.",
    featured: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    id: "progress",
    title: "Track Progress",
    desc: "See your growth journey with detailed stats, achievements, and personalized insights.",
    featured: false,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

function VerseCarousel() {
  const [verseIndex, setVerseIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setVerseIndex((p) => (p + 1) % verses.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full bg-brand-50/50 border-b border-surface-border">
      <div className="max-w-3xl mx-auto px-4 py-3 text-center">
        <div className="relative h-16 overflow-hidden">
          {verses.map((v, i) => (
            <div
              key={i}
              className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out"
              style={{
                opacity: i === verseIndex ? 1 : 0,
                transform: `translateY(${i === verseIndex ? 0 : i < verseIndex ? -12 : 12}px)`,
              }}
            >
              <p className="font-display text-sm sm:text-base text-ink-muted italic leading-relaxed px-4 text-balance">
                &ldquo;{v.text}&rdquo;
              </p>
              <p className="text-xs text-accent-500 mt-0.5 font-semibold">&mdash; {v.ref}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1.5 mt-1">
          {verses.map((_, i) => (
            <button
              key={i}
              onClick={() => setVerseIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === verseIndex ? "w-4 bg-brand-400" : "w-1.5 bg-surface-border hover:bg-ink-light"
              }`}
              aria-label={`Verse ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ f, i }: { f: typeof features[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (f.featured) {
    return (
      <div
        ref={ref}
        className="card-featured p-8 relative overflow-hidden"
        style={{ animation: visible ? "fadeInUp 0.3s ease-out forwards" : "none", opacity: visible ? 1 : 0 }}
      >
        <div className="absolute top-0 right-0">
          <span className="inline-block bg-brand-500 text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-bl-xl">
            Featured
          </span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
            {f.icon}
          </div>
          <h3 className="font-display text-xl font-bold text-ink">{f.title}</h3>
        </div>
        <p className="text-ink-muted text-sm leading-relaxed">{f.desc}</p>
      </div>
    );
  }

  if (f.id === "progress") {
    return (
      <div
        ref={ref}
        className="card-base p-8"
        style={{ animation: visible ? "fadeInUp 0.3s ease-out forwards" : "none", opacity: visible ? 1 : 0, animationDelay: `${i * 100}ms` }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-accent-500 flex items-center justify-center">
            {f.icon}
          </div>
          <h3 className="font-display text-xl font-bold text-ink">{f.title}</h3>
        </div>
        <p className="text-ink-muted text-sm leading-relaxed mb-5">{f.desc}</p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-ink-muted">Quiz completion</span>
              <span className="text-brand-600 font-semibold">78%</span>
            </div>
            <div className="h-2 bg-brand-100 rounded-full overflow-hidden">
              <div className="h-full w-[78%] bg-gradient-to-r from-brand-400 to-brand-600 rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-ink-muted">Lessons done</span>
              <span className="text-accent-500 font-semibold">12/15</span>
            </div>
            <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="card-hover p-8"
      style={{ animation: visible ? "fadeInUp 0.3s ease-out forwards" : "none", opacity: visible ? 1 : 0, animationDelay: `${i * 100}ms` }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          {f.icon}
        </div>
        <h3 className="font-display text-xl font-bold text-ink">{f.title}</h3>
      </div>
      <p className="text-ink-muted text-sm leading-relaxed">{f.desc}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-surface">
        <div className="absolute inset-0 bg-dots-light" />
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-glow" />
      </div>

      {/* Verse carousel */}
      <VerseCarousel />

      {/* Hero section */}
      <section className="relative px-4 pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-sm text-brand-700">
            <span className="w-2 h-2 rounded-full bg-accent-500" />
            Interactive Bible Learning Platform
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-5 tracking-tight leading-[1.1] text-balance">
            <span className="bg-gradient-to-r from-brand-700 via-accent-500 to-brand-700 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
              Bible Quiz Guide
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-ink-muted max-w-xl mx-auto mb-10 leading-relaxed text-balance">
            Study. Learn. Grow in Faith.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="btn-primary group text-base"
            >
              <span>Get Started</span>
              <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-secondary text-base"
            >
              <span>Learn More</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="relative py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4 text-balance">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">Grow</span>
            </h2>
            <p className="text-ink-muted max-w-xl mx-auto text-base sm:text-lg">
              A complete Bible study experience designed for both juniors and seniors
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.slice(0, 2).map((f, i) => (
                <FeatureCard key={f.id} f={f} i={i} />
              ))}
              <div className="sm:col-span-2">
                <FeatureCard f={features[2]} i={2} />
              </div>
            </div>
            <div>
              <FeatureCard f={features[3]} i={3} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="relative py-16 sm:py-20 px-4">
        <div className="absolute inset-0 bg-brand-50/60 -z-10" />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">Built for Growth</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { number: "8+", label: "Study Topics", color: "from-brand-500 to-brand-600" },
              { number: "18+", label: "Quiz Questions", color: "from-accent-500 to-accent-600" },
              { number: "2", label: "Age Categories", color: "from-brand-600 to-accent-500" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-surface-border p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
                style={{ animation: `fadeInUp 0.3s ease-out forwards`, animationDelay: `${i * 100}ms`, opacity: 0 }}
              >
                <div className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 font-display`}>
                  {stat.number}
                </div>
                <div className="text-ink-muted text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-surface-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="font-display text-xl font-bold">
              <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">Bible Quiz</span>
              <span className="text-ink-light"> Guide</span>
            </span>
          </div>
          <p className="text-ink-light text-sm">&copy; {new Date().getFullYear()} Bible Quiz Guide. Study. Learn. Grow in Faith.</p>
        </div>
      </footer>
    </div>
  );
}

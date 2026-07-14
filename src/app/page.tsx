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
  { emoji: "\uD83D\uDCD6", title: "Study Sermons", desc: "Read and understand God\u2019s Word through age-appropriate sermons and articles." },
  { emoji: "\u2753", title: "Practice Questions", desc: "Test your knowledge on each topic with curated Q&A sessions." },
  { emoji: "\uD83C\uDFAF", title: "Smart Quiz", desc: "Challenge yourself with AI-powered quizzes tailored to your learning." },
  { emoji: "\uD83D\uDCCA", title: "Track Progress", desc: "See your growth journey with detailed stats and achievements." },
];

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; speed: number }[] = [];
    let animId: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const count = Math.min(60, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.3 + 0.1,
      });
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />;
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

  return (
    <div
      ref={ref}
      className={`group relative glass rounded-2xl p-8 border border-white/5 hover:border-bible-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-bible-500/10 ${
        visible ? "animate-in" : "opacity-0"
      }`}
      style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-bible-500/0 via-purple-500/0 to-bible-500/0 group-hover:from-bible-500/5 group-hover:via-purple-500/5 group-hover:to-bible-500/5 rounded-2xl transition-all duration-500" />
      <div className="relative">
        <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">
          {f.emoji}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-bible-300 transition-colors">
          {f.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [verseIndex, setVerseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVerseIndex((prev) => (prev + 1) % verses.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Particles />

      {/* Animated gradient mesh background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-[#0b1120]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-radial from-bible-500/20 via-bible-600/10 to-transparent blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-radial from-purple-500/20 via-purple-600/10 to-transparent blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-gradient-radial from-amber-500/10 via-transparent to-transparent blur-3xl animate-float-slow" />
        <div className="absolute inset-0 bg-dots opacity-40" />
      </div>

      {/* Floating Bible illustration */}
      <div className="absolute top-[12%] right-[8%] hidden xl:block animate-float-slow">
        <div className="relative w-48 h-56" style={{ perspective: "800px" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-bible-500/30 to-purple-500/30 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl" style={{ transform: "rotateY(-15deg)" }} />
          <div className="absolute inset-[2px] bg-gradient-to-br from-bible-600/20 to-purple-600/20 rounded-2xl backdrop-blur-xl flex items-center justify-center" style={{ transform: "rotateY(-15deg)" }}>
            <div className="relative w-24 h-32">
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full bg-gradient-to-r from-bible-400/40 to-bible-500/40 rounded-l-md border-r border-white/10" />
                <div className="w-1/2 h-full bg-gradient-to-l from-bible-400/40 to-bible-500/40 rounded-r-md" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-14 text-gold-400/70" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 2h6a4 4 0 014 4v12a4 4 0 00-4-4H2V2zm10 4a4 4 0 014-4h6v12h-6a4 4 0 00-4 4V6z" />
                </svg>
              </div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-bible-300/50 to-bible-400/50 rounded-full" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold-400/30 rounded-full" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-24 h-32 bg-gradient-to-br from-bible-500/15 to-purple-500/15 rounded-2xl backdrop-blur-xl border border-white/5" style={{ transform: "rotateY(5deg) translateZ(-10px)" }} />
        </div>
      </div>

      {/* Floating cross decoration */}
      <div className="absolute top-[25%] left-[8%] hidden xl:block animate-float" style={{ animationDuration: "8s" }}>
        <div className="w-16 h-24 relative opacity-30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-16 bg-gradient-to-b from-bible-400/40 to-transparent rounded-full" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-2 bg-gradient-to-r from-bible-400/40 to-transparent rounded-full" />
        </div>
      </div>

      {/* Scripture verse carousel */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 max-w-2xl mx-auto px-4 w-full">
        <div className="glass rounded-2xl px-6 py-4 text-center border border-white/10 shadow-xl">
          <div className="relative h-20 overflow-hidden">
            {verses.map((v, i) => (
              <div
                key={i}
                className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out"
                style={{
                  opacity: i === verseIndex ? 1 : 0,
                  transform: `translateY(${i === verseIndex ? 0 : i < verseIndex ? -20 : 20}px)`,
                }}
              >
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed italic px-4">
                  &ldquo;{v.text}&rdquo;
                </p>
                <p className="text-xs text-amber-400 mt-1 font-semibold">&mdash; {v.ref}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-1.5 mt-2">
            {verses.map((_, i) => (
              <button
                key={i}
                onClick={() => setVerseIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === verseIndex ? "bg-bible-400 w-4" : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm text-gray-400 animate-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Interactive Bible Learning Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 tracking-tight leading-tight animate-in">
            <span className="bg-gradient-to-r from-bible-400 via-amber-400 to-bible-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x">
              Bible Quiz Guide
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
            Study. Learn. Grow in Faith.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <Link
              href="/signup"
              className="group relative px-10 py-5 bg-gradient-to-r from-bible-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-bible-600/30 hover:shadow-bible-600/50 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Started
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[20deg] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </Link>

            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="px-10 py-5 glass border border-white/10 text-gray-300 font-semibold text-lg rounded-2xl hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                Learn More
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b1120] to-transparent" />
      </section>

      {/* Features section */}
      <section id="features" className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bible-900/10 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-bible-400 to-purple-400 bg-clip-text text-transparent">Grow</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A complete Bible study experience designed for both juniors and seniors
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={i} f={f} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-10 border border-white/5 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { number: "8+", label: "Study Topics" },
                { number: "18+", label: "Quiz Questions" },
                { number: "2", label: "Age Categories" },
              ].map((stat, i) => (
                <div key={i} className="animate-in" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}>
                  <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-bible-400 to-purple-400 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl">📖</span>
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-r from-bible-400 to-purple-400 bg-clip-text text-transparent">Bible Quiz</span>
              <span className="text-gray-500"> Guide</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} Bible Quiz Guide. Study. Learn. Grow in Faith.</p>
        </div>
      </footer>
    </div>
  );
}

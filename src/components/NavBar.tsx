"use client";

import BibleIcon from "@/components/BibleIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bracket, setBracket] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("ageBracket");
    if (stored === "junior" || stored === "senior") setBracket(stored);
  }, [pathname]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-surface-border shadow-sm"
          : "bg-surface border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <BibleIcon className="w-7 h-7 text-brand-500 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-lg font-bold hidden sm:block">
            <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">Youth Bible Quiz</span>
            <span className="text-ink-light"> Guide</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              pathname === "/"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-ink-muted hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            Home
          </Link>

          {mounted && bracket ? (
            <>
              <Link
                href={`/${bracket}/dashboard`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname.includes("/dashboard")
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-ink-muted hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                Dashboard
              </Link>
              <span className="px-3 py-1.5 text-sm font-medium text-brand-700 bg-brand-50 rounded-lg capitalize">
                {bracket}
              </span>
              <Link
                href="/choose-category"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-ink-muted hover:text-brand-600 hover:bg-brand-50 transition-all duration-200"
              >
                Switch Category
              </Link>
            </>
          ) : (
            <Link
              href="/choose-category"
              className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-brand-600 to-accent-500 text-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";

import BibleIcon from "@/components/BibleIcon";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name: string; bracket: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    const uid = localStorage.getItem("userId");
    if (uid) {
      setUser({
        name: localStorage.getItem("firstName") || "My Dashboard",
        bracket: localStorage.getItem("ageBracket") || "junior",
      });
    }
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSignOut() {
    localStorage.removeItem("userId");
    localStorage.removeItem("ageBracket");
    localStorage.removeItem("firstName");
    setUser(null);
    router.push("/");
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

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

          {mounted && user ? (
            <>
              <Link
                href={`/${user.bracket}/dashboard`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname.includes("/dashboard")
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-ink-muted hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                Dashboard
              </Link>
              <span className="text-ink-light text-sm mx-1 select-none">|</span>
              <span className="px-3 py-1.5 text-sm font-medium text-brand-700 bg-brand-50 rounded-lg">
                {user.name}
              </span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-ink-muted hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === "/signin"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-ink-muted hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === "/signup"
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-ink-muted hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

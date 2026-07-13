"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/quiz/setup", label: "Quiz" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-white/20 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition-transform duration-300">📖</span>
          <span className="text-xl font-bold">
            <span className="text-gradient">Bible Quiz</span>
            <span className="text-gray-600 dark:text-gray-400"> Guide</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-bible-500 to-purple-500 text-white shadow-lg shadow-bible-500/30"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-bible-600 dark:hover:text-bible-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

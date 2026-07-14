"use client";

import { useEffect, useState, useCallback } from "react";
import AgeToggle from "@/components/AgeToggle";
import type { AgeBracket, Sermon } from "@/types";

export default function DashboardPage() {
  const [ageBracket, setAgeBracket] = useState<AgeBracket>("junior");
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSermons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sermons?age=${ageBracket}`);
      const data = await res.json();
      setSermons(data.sermons || []);
      setStats(data.stats);
    } catch (err) {
      console.error("Failed to fetch sermons:", err);
    } finally {
      setLoading(false);
    }
  }, [ageBracket]);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  return (
    <div className="animate-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Browse sermons and topics</p>
        </div>
        <AgeToggle value={ageBracket} onChange={setAgeBracket} />
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard icon="📖" value={stats.totalSermons} label="Total Sermons" color="from-blue-500 to-blue-600" />
          <StatCard icon="❓" value={stats.totalQuestions} label="Total Questions" color="from-purple-500 to-purple-600" />
          <StatCard icon="🧒" value={stats.juniorSermons} label="Junior" color="from-emerald-500 to-emerald-600" />
          <StatCard icon="🧑" value={stats.seniorSermons} label="Senior" color="from-amber-500 to-orange-600" />
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">
          {ageBracket === "junior" ? "🧒 Junior" : "🧑 Senior"} Sermons & Topics
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-bible-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-gray-500">Loading sermons...</p>
            </div>
          </div>
        ) : sermons.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">No sermons yet in this bracket</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sermons.map((sermon, idx) => (
              <SermonCard key={sermon.id} sermon={sermon} delay={idx * 50} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: string; value: number; label: string; color: string }) {
  return (
    <div className="card p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-lg shadow-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}

function SermonCard({ sermon, delay }: { sermon: Sermon; delay: number }) {
  return (
    <div className="card-hover p-5" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="font-bold text-gray-900 dark:text-white truncate">{sermon.title}</h3>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
              sermon.age_bracket === "junior"
                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                : "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
            }`}>
              {sermon.age_bracket}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span className="flex items-center gap-1">
              <span>🏷️</span>
              {sermon.category}
            </span>
            <span>·</span>
            <span>{new Date(sermon.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {sermon.content.slice(0, 200)}...
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface TimerProps {
  duration: number;
  running: boolean;
  onExpire: () => void;
}

export default function Timer({ duration, running, onExpire }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const expiredRef = useRef(false);

  useEffect(() => {
    setTimeLeft(duration);
    expiredRef.current = false;
  }, [duration, running]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!expiredRef.current) {
            expiredRef.current = true;
            setTimeout(onExpire, 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, onExpire]);

  const pct = (timeLeft / duration) * 100;
  const urgent = timeLeft <= 5;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-bold flex items-center gap-1.5 ${
          urgent ? "text-red-500" : "text-gray-500 dark:text-gray-400"
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {timeLeft > 0 ? `${timeLeft}s remaining` : "Time's up!"}
        </span>
      </div>
      <div className="w-full glass rounded-full h-3 p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            urgent
              ? "bg-gradient-to-r from-red-500 to-red-600 animate-pulse-soft"
              : pct > 50
              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
              : "bg-gradient-to-r from-amber-400 to-amber-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

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
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-bold ${urgent ? "text-red-500 animate-pulse" : "text-gray-600 dark:text-gray-400"}`}>
          {timeLeft > 0 ? `${timeLeft}s` : "Time's up!"}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            urgent ? "bg-red-500" : pct > 50 ? "bg-green-500" : "bg-yellow-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

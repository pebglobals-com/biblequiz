"use client";

import { useState } from "react";
import type { AgeBracket, Sermon } from "@/types";

interface SermonIngestionProps {
  ageBracket: AgeBracket;
  onIngested: (sermon: Sermon) => void;
}

export default function SermonIngestion({ ageBracket, onIngested }: SermonIngestionProps) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [useText, setUseText] = useState(false);

  async function handleIngest() {
    setError("");
    if (!url && !text) {
      setError("Provide a URL or paste sermon text");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/sermons/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: useText ? "" : url,
          text: useText ? text : "",
          ageBracket,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onIngested(data.sermon);
      setUrl("");
      setText("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl">📝</span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Sermon / Topic</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setUseText(false)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            !useText
              ? "bg-gradient-to-r from-bible-500 to-purple-500 text-white shadow-md"
              : "glass text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5"
          }`}
        >
          From URL
        </button>
        <button
          onClick={() => setUseText(true)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            useText
              ? "bg-gradient-to-r from-bible-500 to-purple-500 text-white shadow-md"
              : "glass text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5"
          }`}
        >
          Paste Text
        </button>
      </div>

      {!useText ? (
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/sermon"
            className="input-field pl-12"
          />
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste sermon text here..."
          rows={6}
          className="input-field resize-none"
        />
      )}

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <button
        onClick={handleIngest}
        disabled={loading}
        className="mt-4 btn-primary w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing with AI...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ingest & Generate Questions
          </span>
        )}
      </button>
    </div>
  );
}

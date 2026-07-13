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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold mb-4">Add Sermon / Topic</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setUseText(false)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            !useText
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
        >
          From URL
        </button>
        <button
          onClick={() => setUseText(true)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            useText
              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
        >
          Paste Text
        </button>
      </div>

      {!useText ? (
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/sermon"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste sermon text here..."
          rows={6}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
        />
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        onClick={handleIngest}
        disabled={loading}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
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
          "Ingest & Generate Questions"
        )}
      </button>
    </div>
  );
}

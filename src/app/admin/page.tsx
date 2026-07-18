"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Sermon {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  age_bracket: "junior" | "senior";
  category: string;
  source_url: string;
  created_at: string;
}

interface Question {
  id: number;
  sermon_id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  age_bracket: "junior" | "senior";
  created_at: string;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("adminAuthed");
    if (stored === "true") setAuthed(true);
  }, []);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminAuthed", "true");
        setAuthed(true);
      } else {
        setAuthError(data.error || "Invalid password");
      }
    } catch {
      setAuthError("Network error");
    } finally {
      setAuthLoading(false);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <form onSubmit={handleAuth} className="w-full max-w-sm bg-white rounded-2xl border border-surface-border shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-ink mb-1">Admin</h1>
            <p className="text-sm text-ink-muted">Enter the admin password to continue</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-surface-border bg-white text-ink placeholder:text-ink-light text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 mb-4"
            autoFocus
          />
          {authError && <p className="text-red-600 text-sm mb-4">{authError}</p>}
          <button
            type="submit"
            disabled={authLoading || !password}
            className="w-full px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {authLoading ? "Checking..." : "Enter"}
          </button>
          <Link href="/" className="block text-center mt-4 text-sm text-ink-light hover:text-brand-600 transition-colors">Back to Home</Link>
        </form>
    </div>
  );
}

function StudyQAManager() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [questions, setQuestions] = useState<{ id: number; question_text: string; answer_text: string }[]>([]);
  const [selectedSermonId, setSelectedSermonId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState({ question_text: "", answer_text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/sermons").then(r => r.json()).then(d => setSermons(d.sermons || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedSermonId) { setQuestions([]); return; }
    setLoading(true);
    fetch(`/api/admin/study-questions?sermonId=${selectedSermonId}`).then(r => r.json()).then(d => { setQuestions(d.questions || []); }).catch(() => setError("Failed to load")).finally(() => setLoading(false));
  }, [selectedSermonId]);

  function resetForm() { setForm({ question_text: "", answer_text: "" }); setEditingId(null); }

  function startEdit(q: typeof questions[0]) {
    setForm({ question_text: q.question_text, answer_text: q.answer_text });
    setEditingId(q.id);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question_text || !form.answer_text || !selectedSermonId) return;
    setSaving(true);
    setError("");
    try {
      const isNew = editingId === "new";
      const body = { sermon_id: selectedSermonId, question_text: form.question_text, answer_text: form.answer_text };
      const res = await fetch(`/api/admin/study-questions${!isNew ? `?id=${editingId}` : ""}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Save failed"); }
      resetForm();
      const r = await fetch(`/api/admin/study-questions?sermonId=${selectedSermonId}`);
      const d = await r.json();
      setQuestions(d.questions || []);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this study question?")) return;
    try {
      const res = await fetch(`/api/admin/study-questions?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      if (editingId === id) resetForm();
      const r = await fetch(`/api/admin/study-questions?sermonId=${selectedSermonId}`);
      const d = await r.json();
      setQuestions(d.questions || []);
    } catch (err: any) { setError(err.message); }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-6">Study Q&A</h2>
      <p className="text-sm text-ink-muted mb-6">Open-ended study questions shown on the per-sermon Q&A page (separate from quiz questions).</p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-ink mb-1">Select Sermon</label>
        <select value={selectedSermonId} onChange={(e) => { setSelectedSermonId(e.target.value ? Number(e.target.value) : ""); resetForm(); }} className="w-full max-w-md px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500">
          <option value="">— Choose a sermon —</option>
          {sermons.map(s => <option key={s.id} value={s.id}>{s.title} ({s.age_bracket})</option>)}
        </select>
      </div>

      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

      {selectedSermonId && (editingId === "new" || typeof editingId === "number") && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-surface-border shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-ink mb-4">{editingId === "new" ? "New Study Question" : "Edit Study Question"}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1">Question *</label>
            <input type="text" value={form.question_text} onChange={(e) => setForm({ ...form, question_text: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1">Answer / Explanation *</label>
            <textarea value={form.answer_text} onChange={(e) => setForm({ ...form, answer_text: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" required />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-all">
              {saving ? "Saving..." : editingId === "new" ? "Create Question" : "Save Changes"}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-surface-border text-ink-muted font-medium rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
          </div>
        </form>
      )}

      {!selectedSermonId ? (
        <div className="text-center py-12 text-ink-muted">Select a sermon to manage its study questions</div>
      ) : loading ? (
        <div className="text-center py-12 text-ink-muted">Loading...</div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink">{questions.length} study question{questions.length !== 1 ? "s" : ""}</h3>
            {editingId === null && (
              <button onClick={() => { setEditingId("new"); setForm({ question_text: "", answer_text: "" }); }} className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-all">
                + Add Question
              </button>
            )}
          </div>
          {questions.length === 0 ? (
            <div className="text-center py-12 text-ink-muted">No study questions yet.</div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={q.id} className={`bg-white rounded-2xl border ${editingId === q.id ? "border-brand-500 ring-2 ring-brand-500/20" : "border-surface-border"} shadow-sm p-5`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink mb-1"><span className="text-ink-muted">Q{i + 1}:</span> {q.question_text}</p>
                      <p className="text-sm text-ink-muted mt-1"><span className="font-medium text-ink">A:</span> {q.answer_text}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => startEdit(q)} className="px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">Edit</button>
                      <button onClick={() => handleDelete(q.id)} className="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [tab, setTab] = useState<"sermons" | "questions" | "study">("sermons");

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-surface-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg text-ink">Admin</h1>
            <nav className="flex items-center gap-1">
              <button onClick={() => setTab("sermons")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "sermons" ? "bg-brand-600 text-white shadow-sm" : "text-ink-muted hover:bg-brand-50 hover:text-brand-700"}`}>Sermons</button>
              <button onClick={() => setTab("questions")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "questions" ? "bg-brand-600 text-white shadow-sm" : "text-ink-muted hover:bg-brand-50 hover:text-brand-700"}`}>Questions</button>
              <button onClick={() => setTab("study")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === "study" ? "bg-brand-600 text-white shadow-sm" : "text-ink-muted hover:bg-brand-50 hover:text-brand-700"}`}>Study Q&A</button>
            </nav>
          </div>
          <button
            onClick={() => { localStorage.removeItem("adminAuthed"); window.location.href = "/admin"; }}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-ink-muted hover:text-red-600 hover:bg-red-50 transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {tab === "sermons" ? <SermonManager /> : tab === "questions" ? <QuestionManager /> : <StudyQAManager />}
      </main>
    </div>
  );
}

function SermonManager() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<{ title: string; category: string; age_bracket: "junior" | "senior"; content: string; excerpt: string; source_url: string }>({ title: "", category: "", age_bracket: "junior", content: "", excerpt: "", source_url: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sermons");
      const data = await res.json();
      setSermons(data.sermons || []);
    } catch { setError("Failed to load sermons"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setForm({ title: "", category: "", age_bracket: "junior", content: "", excerpt: "", source_url: "" });
    setEditingId(null);
  }

  function startEdit(s: Sermon) {
    setForm({ title: s.title, category: s.category, age_bracket: s.age_bracket, content: s.content, excerpt: s.excerpt, source_url: s.source_url });
    setEditingId(s.id);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.content) return;
    setSaving(true);
    setError("");
    try {
      const isNew = editingId === "new";
      const res = await fetch(`/api/admin/sermons${!isNew ? `?id=${editingId}` : ""}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Save failed"); }
      resetForm();
      await load();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this sermon and all its questions? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/sermons?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      if (editingId === id) resetForm();
      await load();
    } catch (err: any) { setError(err.message); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-ink">Sermons ({sermons.length})</h2>
        {editingId === null && (
          <button onClick={() => { setEditingId("new"); setForm({ title: "", category: "", age_bracket: "junior", content: "", excerpt: "", source_url: "" }); }} className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-all">
            + Add Sermon
          </button>
        )}
      </div>

      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

      {(editingId === "new" || typeof editingId === "number") && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-surface-border shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-ink mb-4">{editingId === "new" ? "New Sermon" : "Edit Sermon"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Age Bracket *</label>
              <select value={form.age_bracket} onChange={(e) => setForm({ ...form, age_bracket: e.target.value as "junior" | "senior" })} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500">
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Source URL</label>
              <input type="url" value={form.source_url} onChange={(e) => setForm({ ...form, source_url: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1">Excerpt (short summary for cards)</label>
            <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1">Content (body text) *</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" required />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-all">
              {saving ? "Saving..." : editingId === "new" ? "Create Sermon" : "Save Changes"}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-surface-border text-ink-muted font-medium rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-ink-muted">Loading...</div>
      ) : sermons.length === 0 ? (
        <div className="text-center py-12 text-ink-muted">No sermons yet. Click "Add Sermon" to create one.</div>
      ) : (
        <div className="space-y-3">
          {sermons.map((s) => (
            <div key={s.id} className={`bg-white rounded-2xl border ${editingId === s.id ? "border-brand-500 ring-2 ring-brand-500/20" : "border-surface-border"} shadow-sm p-5`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-ink truncate">{s.title}</h3>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${s.age_bracket === "junior" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{s.age_bracket}</span>
                  </div>
                  <p className="text-sm text-ink-muted truncate">{s.category || "Uncategorized"} — {s.excerpt || "No excerpt"}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEdit(s)} className="px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionManager() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSermonId, setSelectedSermonId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState({ question_text: "", optionA: "", optionB: "", optionC: "", optionD: "", correct_answer: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/sermons").then(r => r.json()).then(d => setSermons(d.sermons || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedSermonId) { setQuestions([]); return; }
    setLoading(true);
    fetch(`/api/admin/questions?sermonId=${selectedSermonId}`).then(r => r.json()).then(d => { setQuestions(d.questions || []); }).catch(() => setError("Failed to load questions")).finally(() => setLoading(false));
  }, [selectedSermonId]);

  const selectedSermon = sermons.find(s => s.id === selectedSermonId);

  function resetForm() {
    setForm({ question_text: "", optionA: "", optionB: "", optionC: "", optionD: "", correct_answer: "" });
    setEditingId(null);
  }

  function startEdit(q: Question) {
    setForm({ question_text: q.question_text, optionA: q.options[0] || "", optionB: q.options[1] || "", optionC: q.options[2] || "", optionD: q.options[3] || "", correct_answer: q.correct_answer });
    setEditingId(q.id);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question_text || !selectedSermonId) return;
    setSaving(true);
    setError("");
    const options = [form.optionA, form.optionB, form.optionC, form.optionD].filter(Boolean);
    if (options.length < 2) { setError("At least 2 options required"); setSaving(false); return; }
    if (!form.correct_answer) { setError("Correct answer is required"); setSaving(false); return; }
    try {
      const isNew = editingId === "new";
      const body = { sermon_id: selectedSermonId, question_text: form.question_text, options, correct_answer: form.correct_answer, age_bracket: selectedSermon?.age_bracket || "junior" };
      const res = await fetch(`/api/admin/questions${!isNew ? `?id=${editingId}` : ""}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Save failed"); }
      resetForm();
      const r = await fetch(`/api/admin/questions?sermonId=${selectedSermonId}`);
      const d = await r.json();
      setQuestions(d.questions || []);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this question?")) return;
    try {
      const res = await fetch(`/api/admin/questions?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      if (editingId === id) resetForm();
      const r = await fetch(`/api/admin/questions?sermonId=${selectedSermonId}`);
      const d = await r.json();
      setQuestions(d.questions || []);
    } catch (err: any) { setError(err.message); }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-6">Questions</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-ink mb-1">Select Sermon</label>
        <select value={selectedSermonId} onChange={(e) => { setSelectedSermonId(e.target.value ? Number(e.target.value) : ""); resetForm(); }} className="w-full max-w-md px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500">
          <option value="">— Choose a sermon —</option>
          {sermons.map(s => <option key={s.id} value={s.id}>{s.title} ({s.age_bracket})</option>)}
        </select>
      </div>

      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

      {selectedSermonId && (editingId === "new" || typeof editingId === "number") && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-surface-border shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-ink mb-4">{editingId === "new" ? "New Question" : "Edit Question"}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1">Question *</label>
            <input type="text" value={form.question_text} onChange={(e) => setForm({ ...form, question_text: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Option A *</label>
              <input type="text" value={form.optionA} onChange={(e) => setForm({ ...form, optionA: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Option B *</label>
              <input type="text" value={form.optionB} onChange={(e) => setForm({ ...form, optionB: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Option C</label>
              <input type="text" value={form.optionC} onChange={(e) => setForm({ ...form, optionC: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">Option D</label>
              <input type="text" value={form.optionD} onChange={(e) => setForm({ ...form, optionD: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1">Correct Answer *</label>
            <select value={form.correct_answer} onChange={(e) => setForm({ ...form, correct_answer: e.target.value })} className="w-full max-w-xs px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500">
              <option value="">— Select correct answer —</option>
              {[form.optionA, form.optionB, form.optionC, form.optionD].filter(Boolean).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-all">
              {saving ? "Saving..." : editingId === "new" ? "Create Question" : "Save Changes"}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-surface-border text-ink-muted font-medium rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
          </div>
        </form>
      )}

      {!selectedSermonId ? (
        <div className="text-center py-12 text-ink-muted">Select a sermon to manage its questions</div>
      ) : loading ? (
        <div className="text-center py-12 text-ink-muted">Loading...</div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink">{selectedSermon?.title} — {questions.length} question{questions.length !== 1 ? "s" : ""}</h3>
            {editingId === null && (
              <button onClick={() => { setEditingId("new"); setForm({ question_text: "", optionA: "", optionB: "", optionC: "", optionD: "", correct_answer: "" }); }} className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-all">
                + Add Question
              </button>
            )}
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-12 text-ink-muted">No questions for this sermon yet.</div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={q.id} className={`bg-white rounded-2xl border ${editingId === q.id ? "border-brand-500 ring-2 ring-brand-500/20" : "border-surface-border"} shadow-sm p-5`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink mb-1"><span className="text-ink-muted">#{i + 1}</span> {q.question_text}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {q.options.map((o, oi) => (
                          <span key={oi} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${o === q.correct_answer ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300" : "bg-gray-100 text-gray-600"}`}>
                            {o} {o === q.correct_answer && "✓"}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => startEdit(q)} className="px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">Edit</button>
                      <button onClick={() => handleDelete(q.id)} className="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StudyQAManager() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [questions, setQuestions] = useState<{ id: number; question_text: string; answer_text: string }[]>([]);
  const [selectedSermonId, setSelectedSermonId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState({ question_text: "", answer_text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/sermons").then(r => r.json()).then(d => setSermons(d.sermons || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedSermonId) { setQuestions([]); return; }
    setLoading(true);
    fetch(`/api/admin/study-questions?sermonId=${selectedSermonId}`).then(r => r.json()).then(d => { setQuestions(d.questions || []); }).catch(() => setError("Failed to load")).finally(() => setLoading(false));
  }, [selectedSermonId]);

  function resetForm() { setForm({ question_text: "", answer_text: "" }); setEditingId(null); }

  function startEdit(q: typeof questions[0]) {
    setForm({ question_text: q.question_text, answer_text: q.answer_text });
    setEditingId(q.id);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.question_text || !form.answer_text || !selectedSermonId) return;
    setSaving(true);
    setError("");
    try {
      const isNew = editingId === "new";
      const body = { sermon_id: selectedSermonId, question_text: form.question_text, answer_text: form.answer_text };
      const res = await fetch(`/api/admin/study-questions${!isNew ? `?id=${editingId}` : ""}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Save failed"); }
      resetForm();
      const r = await fetch(`/api/admin/study-questions?sermonId=${selectedSermonId}`);
      const d = await r.json();
      setQuestions(d.questions || []);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this study question?")) return;
    try {
      const res = await fetch(`/api/admin/study-questions?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      if (editingId === id) resetForm();
      const r = await fetch(`/api/admin/study-questions?sermonId=${selectedSermonId}`);
      const d = await r.json();
      setQuestions(d.questions || []);
    } catch (err: any) { setError(err.message); }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-ink mb-6">Study Q&A</h2>
      <p className="text-sm text-ink-muted mb-6">Open-ended study questions shown on the per-sermon Q&A page (separate from quiz questions).</p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-ink mb-1">Select Sermon</label>
        <select value={selectedSermonId} onChange={(e) => { setSelectedSermonId(e.target.value ? Number(e.target.value) : ""); resetForm(); }} className="w-full max-w-md px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500">
          <option value="">— Choose a sermon —</option>
          {sermons.map(s => <option key={s.id} value={s.id}>{s.title} ({s.age_bracket})</option>)}
        </select>
      </div>

      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

      {selectedSermonId && (editingId === "new" || typeof editingId === "number") && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-surface-border shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-ink mb-4">{editingId === "new" ? "New Study Question" : "Edit Study Question"}</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1">Question *</label>
            <input type="text" value={form.question_text} onChange={(e) => setForm({ ...form, question_text: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink mb-1">Answer / Explanation *</label>
            <textarea value={form.answer_text} onChange={(e) => setForm({ ...form, answer_text: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-xl border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500" required />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition-all">
              {saving ? "Saving..." : editingId === "new" ? "Create Question" : "Save Changes"}
            </button>
            <button type="button" onClick={resetForm} className="px-6 py-2.5 border border-surface-border text-ink-muted font-medium rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
          </div>
        </form>
      )}

      {!selectedSermonId ? (
        <div className="text-center py-12 text-ink-muted">Select a sermon to manage its study questions</div>
      ) : loading ? (
        <div className="text-center py-12 text-ink-muted">Loading...</div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink">{questions.length} study question{questions.length !== 1 ? "s" : ""}</h3>
            {editingId === null && (
              <button onClick={() => { setEditingId("new"); setForm({ question_text: "", answer_text: "" }); }} className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition-all">
                + Add Question
              </button>
            )}
          </div>
          {questions.length === 0 ? (
            <div className="text-center py-12 text-ink-muted">No study questions yet.</div>
          ) : (
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={q.id} className={`bg-white rounded-2xl border ${editingId === q.id ? "border-brand-500 ring-2 ring-brand-500/20" : "border-surface-border"} shadow-sm p-5`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink mb-1"><span className="text-ink-muted">Q{i + 1}:</span> {q.question_text}</p>
                      <p className="text-sm text-ink-muted mt-1"><span className="font-medium text-ink">A:</span> {q.answer_text}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => startEdit(q)} className="px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">Edit</button>
                      <button onClick={() => handleDelete(q.id)} className="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-all">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

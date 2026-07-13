-- Migration 0001: Create initial tables for Bible Quiz Guide

CREATE TABLE IF NOT EXISTS sermons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  source_url TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  age_bracket TEXT NOT NULL CHECK(age_bracket IN ('junior', 'senior')),
  category TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sermon_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  options TEXT NOT NULL DEFAULT '[]',
  correct_answer TEXT NOT NULL,
  age_bracket TEXT NOT NULL CHECK(age_bracket IN ('junior', 'senior')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (sermon_id) REFERENCES sermons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL UNIQUE,
  age_bracket TEXT NOT NULL CHECK(age_bracket IN ('junior', 'senior')),
  sermon_ids TEXT NOT NULL DEFAULT '',
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  selected_answer TEXT,
  is_correct INTEGER,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES quiz_sessions(session_id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE INDEX IF NOT EXISTS idx_questions_sermon ON questions(sermon_id);
CREATE INDEX IF NOT EXISTS idx_questions_age ON questions(age_bracket);
CREATE INDEX IF NOT EXISTS idx_sermons_age ON sermons(age_bracket);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_session ON quiz_sessions(session_id);

CREATE TABLE IF NOT EXISTS study_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sermon_id INTEGER NOT NULL REFERENCES sermons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_study_questions_sermon ON study_questions(sermon_id);

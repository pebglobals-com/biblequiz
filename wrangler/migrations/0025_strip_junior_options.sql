-- Migration 0025: Strip answer options (A-D lines) from junior MCQ question_text.
-- The options remain stored with the correct answer in answer_text.
-- Only affects the 80 multiple-choice rows imported in migration 0024; essay questions (Feast of Tabernacles) are untouched.

UPDATE study_questions
SET question_text = rtrim(substr(question_text, 1, instr(question_text, char(10) || 'A. ') - 1), char(13))
WHERE question_text LIKE '%' || char(10) || 'A. %';
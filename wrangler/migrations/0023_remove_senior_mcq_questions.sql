-- Migration 0023: Revert senior MCQ questions added in migration 0022 (ids 24-70)
-- The user's study questions (study_questions table) were never touched and remain intact.
-- This restores the senior multiple-choice quiz to its prior state.

DELETE FROM questions WHERE id >= 24 AND age_bracket = 'senior';
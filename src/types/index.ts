export type AgeBracket = "junior" | "senior";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  branch: string;
  phone: string;
  email: string;
  age_bracket: AgeBracket;
  email_verified: number;
  verification_token: string | null;
  created_at: string;
}

export interface StudyProgress {
  id: number;
  user_id: number;
  sermon_id: number;
  completed: number;
  questions_done: number;
  completed_at: string | null;
  created_at: string;
}

export interface Sermon {
  id: number;
  title: string;
  slug: string;
  source_url: string;
  content: string;
  excerpt: string;
  age_bracket: "junior" | "senior";
  category: string;
  created_at: string;
}

export interface Question {
  id: number;
  sermon_id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  age_bracket: AgeBracket;
  created_at: string;
}

export interface QuizSession {
  id: number;
  session_id: string;
  user_id?: number;
  age_bracket: AgeBracket;
  sermon_ids: string;
  score: number;
  total: number;
  completed_at: string | null;
  created_at: string;
}

export interface QuizAnswer {
  id: number;
  session_id: string;
  question_id: number;
  selected_answer: string | null;
  is_correct: boolean | number | null;
  timestamp: string;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  options: string[];
  sermon_id: number;
  sermon_title?: string;
}

export interface QuizResult {
  question_id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
  selected_answer: string | null;
  is_correct: boolean | number | null;
  sermon_title: string;
}

export interface Recommendation {
  topic: string;
  reason: string;
  sermon_id: number;
}

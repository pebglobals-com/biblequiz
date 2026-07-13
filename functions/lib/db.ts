import type { Sermon, Question, QuizSession, QuizAnswer } from "./types";

const sermons: Sermon[] = [];
const questions: Question[] = [];
const quizSessions: QuizSession[] = [];
const quizAnswers: QuizAnswer[] = [];

let nextId: Record<string, number> = {};

function getNextId(collection: string): number {
  if (!nextId[collection]) nextId[collection] = 1;
  return nextId[collection]++;
}

function generateSessionId(): string {
  return `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const db = {
  sermons: {
    getAll: (ageBracket?: string): Sermon[] => {
      let items = sermons;
      if (ageBracket) items = items.filter((s) => s.age_bracket === ageBracket);
      return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    getById: (id: number): Sermon | undefined => {
      return sermons.find((s) => s.id === id);
    },
    create: (sermon: Omit<Sermon, "id" | "created_at">): Sermon => {
      const newSermon: Sermon = {
        ...sermon,
        id: getNextId("sermons"),
        created_at: new Date().toISOString(),
      };
      sermons.push(newSermon);
      return newSermon;
    },
  },

  questions: {
    getAll: (ageBracket?: string, sermonIds?: number[]): Question[] => {
      let items = questions;
      if (ageBracket) items = items.filter((q) => q.age_bracket === ageBracket);
      if (sermonIds && sermonIds.length > 0) {
        items = items.filter((q) => sermonIds.includes(q.sermon_id));
      }
      return items;
    },
    getBySermon: (sermonId: number): Question[] => {
      return questions.filter((q) => q.sermon_id === sermonId);
    },
    create: (question: Omit<Question, "id" | "created_at">): Question => {
      const newQuestion: Question = {
        ...question,
        id: getNextId("questions"),
        created_at: new Date().toISOString(),
      };
      questions.push(newQuestion);
      return newQuestion;
    },
    createMany: (items: Omit<Question, "id" | "created_at">[]): Question[] => {
      const created: Question[] = [];
      for (const q of items) {
        const newQ: Question = { ...q, id: getNextId("questions"), created_at: new Date().toISOString() };
        questions.push(newQ);
        created.push(newQ);
      }
      return created;
    },
  },

  quizSessions: {
    create: (session: Omit<QuizSession, "id" | "created_at">): QuizSession => {
      const newSession: QuizSession = {
        ...session,
        id: getNextId("quiz_sessions"),
        created_at: new Date().toISOString(),
      };
      quizSessions.push(newSession);
      return newSession;
    },
    update: (sessionId: string, updates: Partial<QuizSession>): QuizSession | undefined => {
      const idx = quizSessions.findIndex((s) => s.session_id === sessionId);
      if (idx === -1) return undefined;
      quizSessions[idx] = { ...quizSessions[idx], ...updates };
      return quizSessions[idx];
    },
    getById: (sessionId: string): QuizSession | undefined => {
      return quizSessions.find((s) => s.session_id === sessionId);
    },
  },

  quizAnswers: {
    create: (answer: Omit<QuizAnswer, "id">): QuizAnswer => {
      const newAnswer: QuizAnswer = {
        ...answer,
        id: getNextId("quiz_answers"),
      };
      quizAnswers.push(newAnswer);
      return newAnswer;
    },
    getBySession: (sessionId: string): QuizAnswer[] => {
      return quizAnswers.filter((a) => a.session_id === sessionId);
    },
  },

  stats: {
    getCounts: () => ({
      totalSermons: sermons.length,
      juniorSermons: sermons.filter((s) => s.age_bracket === "junior").length,
      seniorSermons: sermons.filter((s) => s.age_bracket === "senior").length,
      totalQuestions: questions.length,
      juniorQuestions: questions.filter((q) => q.age_bracket === "junior").length,
      seniorQuestions: questions.filter((q) => q.age_bracket === "senior").length,
    }),
  },
};

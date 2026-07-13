import fs from "fs";
import path from "path";
import type { Sermon, Question, QuizSession, QuizAnswer } from "@/types";

const DB_DIR = path.join(process.cwd(), ".data");

function dbPath(collection: string): string {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  return path.join(DB_DIR, `${collection}.json`);
}

function readCollection<T>(name: string): T[] {
  const p = dbPath(name);
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeCollection<T>(name: string, data: T[]): void {
  fs.writeFileSync(dbPath(name), JSON.stringify(data, null, 2));
}

let nextId: Record<string, number> = {};

function getNextId(collection: string): number {
  if (!nextId[collection]) {
    const items = readCollection<any>(collection);
    nextId[collection] = items.reduce((max, i) => Math.max(max, i.id || 0), 0) + 1;
  }
  return nextId[collection]++;
}

export const db = {
  sermons: {
    getAll: (ageBracket?: string): Sermon[] => {
      let items = readCollection<Sermon>("sermons");
      if (ageBracket) items = items.filter((s) => s.age_bracket === ageBracket);
      return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    getById: (id: number): Sermon | undefined => {
      return readCollection<Sermon>("sermons").find((s) => s.id === id);
    },
    create: (sermon: Omit<Sermon, "id" | "created_at">): Sermon => {
      const items = readCollection<Sermon>("sermons");
      const newSermon: Sermon = {
        ...sermon,
        id: getNextId("sermons"),
        created_at: new Date().toISOString(),
      };
      items.push(newSermon);
      writeCollection("sermons", items);
      return newSermon;
    },
  },

  questions: {
    getAll: (ageBracket?: string, sermonIds?: number[]): Question[] => {
      let items = readCollection<Question>("questions");
      if (ageBracket) items = items.filter((q) => q.age_bracket === ageBracket);
      if (sermonIds && sermonIds.length > 0) {
        items = items.filter((q) => sermonIds.includes(q.sermon_id));
      }
      return items;
    },
    getBySermon: (sermonId: number): Question[] => {
      return readCollection<Question>("questions").filter((q) => q.sermon_id === sermonId);
    },
    create: (question: Omit<Question, "id" | "created_at">): Question => {
      const items = readCollection<Question>("questions");
      const newQuestion: Question = {
        ...question,
        id: getNextId("questions"),
        created_at: new Date().toISOString(),
      };
      items.push(newQuestion);
      writeCollection("questions", items);
      return newQuestion;
    },
    createMany: (questions: Omit<Question, "id" | "created_at">[]): Question[] => {
      const items = readCollection<Question>("questions");
      const created: Question[] = [];
      for (const q of questions) {
        const newQ: Question = { ...q, id: getNextId("questions"), created_at: new Date().toISOString() };
        items.push(newQ);
        created.push(newQ);
      }
      writeCollection("questions", items);
      return created;
    },
  },

  quizSessions: {
    create: (session: Omit<QuizSession, "id" | "created_at">): QuizSession => {
      const items = readCollection<QuizSession>("quiz_sessions");
      const newSession: QuizSession = {
        ...session,
        id: getNextId("quiz_sessions"),
        created_at: new Date().toISOString(),
      };
      items.push(newSession);
      writeCollection("quiz_sessions", items);
      return newSession;
    },
    update: (sessionId: string, updates: Partial<QuizSession>): QuizSession | undefined => {
      const items = readCollection<QuizSession>("quiz_sessions");
      const idx = items.findIndex((s) => s.session_id === sessionId);
      if (idx === -1) return undefined;
      items[idx] = { ...items[idx], ...updates };
      writeCollection("quiz_sessions", items);
      return items[idx];
    },
    getById: (sessionId: string): QuizSession | undefined => {
      return readCollection<QuizSession>("quiz_sessions").find((s) => s.session_id === sessionId);
    },
  },

  quizAnswers: {
    create: (answer: Omit<QuizAnswer, "id">): QuizAnswer => {
      const items = readCollection<QuizAnswer>("quiz_answers");
      const newAnswer: QuizAnswer = {
        ...answer,
        id: getNextId("quiz_answers"),
      };
      items.push(newAnswer);
      writeCollection("quiz_answers", items);
      return newAnswer;
    },
    getBySession: (sessionId: string): QuizAnswer[] => {
      return readCollection<QuizAnswer>("quiz_answers").filter((a) => a.session_id === sessionId);
    },
  },

  stats: {
    getCounts: () => {
      const sermons = readCollection<Sermon>("sermons");
      const questions = readCollection<Question>("questions");
      return {
        totalSermons: sermons.length,
        juniorSermons: sermons.filter((s) => s.age_bracket === "junior").length,
        seniorSermons: sermons.filter((s) => s.age_bracket === "senior").length,
        totalQuestions: questions.length,
        juniorQuestions: questions.filter((q) => q.age_bracket === "junior").length,
        seniorQuestions: questions.filter((q) => q.age_bracket === "senior").length,
      };
    },
  },
};

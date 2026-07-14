import fs from "fs";
import path from "path";
import type { Sermon, Question, QuizSession, QuizAnswer, User, StudyProgress } from "@/types";

const DB_DIR = path.join(process.cwd(), ".data");

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const SEED_SERMONS: Omit<Sermon, "id" | "created_at">[] = [
  { title: "Who is God?", slug: "who-is-god", source_url: "https://example.com/who-is-god", content: "God is the Creator of everything - the heavens, the earth, and all living things. He is eternal, which means He has no beginning and no end. God is three persons in one: God the Father, God the Son (Jesus), and God the Holy Spirit. This is called the Trinity. God loves us very much. He created us in His image, which means we can think, love, and make choices.", age_bracket: "junior", category: "God's Character" },
  { title: "Jesus Loves Me", slug: "jesus-loves-me", source_url: "https://example.com/jesus-loves-me", content: "Jesus loves every child! The Bible says, 'Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these' (Matthew 19:14). Jesus showed His love by coming to earth as a baby, growing up, teaching about God's love, healing sick people, and finally dying on the cross for our sins.", age_bracket: "junior", category: "Jesus" },
  { title: "The Bible: God's Special Book", slug: "the-bible-gods-special-book", source_url: "https://example.com/bible-gods-book", content: "The Bible is God's Word written for us. It has 66 books - 39 in the Old Testament and 27 in the New Testament. The Old Testament tells about God's creation and His people before Jesus came. The New Testament tells about Jesus' life and the early church.", age_bracket: "junior", category: "The Bible" },
  { title: "Prayer: Talking with God", slug: "prayer-talking-with-god", source_url: "https://example.com/prayer-talking-with-god", content: "Prayer is simply talking to God - just like you talk to your best friend! You can pray anytime, anywhere, about anything. God loves to hear from His children. Jesus taught us how to pray in the Lord's Prayer (Matthew 6:9-13).", age_bracket: "junior", category: "Prayer" },
  { title: "The Trinity: Father, Son, Holy Spirit", slug: "the-trinity-father-son-holy-spirit", source_url: "https://example.com/trinity", content: "The Trinity is one of the most profound mysteries of the Christian faith. God exists as three distinct persons - Father, Son, and Holy Spirit - yet is one God. This is not three gods, but one God in three persons.", age_bracket: "senior", category: "Theology" },
  { title: "Apologetics: Defending Your Faith", slug: "apologetics-defending-your-faith", source_url: "https://example.com/apologetics", content: "Apologetics comes from the Greek word 'apologia' meaning a reasoned defense. As Christians, we're called to 'always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have' (1 Peter 3:15).", age_bracket: "senior", category: "Apologetics" },
  { title: "Biblical Worldview", slug: "biblical-worldview", source_url: "https://example.com/biblical-worldview", content: "A worldview is the lens through which we interpret reality. Everyone has a worldview - the question is whether it's biblical. A biblical worldview answers life's big questions: Origin, Meaning, Morality, Destiny.", age_bracket: "senior", category: "Worldview" },
  { title: "Spiritual Disciplines for Growth", slug: "spiritual-disciplines-for-growth", source_url: "https://example.com/spiritual-disciplines", content: "Spiritual disciplines are practices that position us to receive God's grace and grow in Christlikeness. They're not about earning God's favor. They're about creating space for the Holy Spirit to transform us.", age_bracket: "senior", category: "Christian Living" },
];

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

let seeded = false;
function ensureSeeded() {
  if (seeded) return;
  const existing = readCollection<Sermon>("sermons");
  if (existing.length > 0) { seeded = true; return; }
  seeded = true;
  const sermons: Sermon[] = SEED_SERMONS.map((s, i) => ({
    ...s,
    id: i + 1,
    created_at: new Date(Date.now() - (SEED_SERMONS.length - i) * 86400000).toISOString(),
  }));
  writeCollection("sermons", sermons);

  const seedQuestions: Omit<Question, "id" | "created_at">[] = [
    { sermon_id: 1, question_text: "Who created everything?", options: ["God", "Aliens", "Nature", "Scientists"], correct_answer: "God", age_bracket: "junior" },
    { sermon_id: 1, question_text: "How many persons are in the Trinity?", options: ["One", "Two", "Three", "Four"], correct_answer: "Three", age_bracket: "junior" },
    { sermon_id: 1, question_text: "What does 'eternal' mean?", options: ["Very old", "Has no beginning and no end", "Lives a long time", "Never sleeps"], correct_answer: "Has no beginning and no end", age_bracket: "junior" },
    { sermon_id: 2, question_text: "What did Jesus say about children in Matthew 19:14?", options: ["Stay away", "Let the little children come to me", "Children are too noisy", "Wait until you're older"], correct_answer: "Let the little children come to me", age_bracket: "junior" },
    { sermon_id: 2, question_text: "What did Jesus do to show His love for us?", options: ["Gave us toys", "Died on the cross for our sins", "Wrote us letters", "Made us kings"], correct_answer: "Died on the cross for our sins", age_bracket: "junior" },
    { sermon_id: 2, question_text: "How many days after His death did Jesus rise again?", options: ["One", "Two", "Three", "Seven"], correct_answer: "Three", age_bracket: "junior" },
    { sermon_id: 3, question_text: "How many books are in the Bible?", options: ["50", "66", "100", "39"], correct_answer: "66", age_bracket: "junior" },
    { sermon_id: 3, question_text: "What does Psalm 119:105 say God's Word is?", options: ["A sword", "A lamp to my feet and a light to my path", "A shield", "A crown"], correct_answer: "A lamp to my feet and a light to my path", age_bracket: "junior" },
    { sermon_id: 4, question_text: "What is prayer?", options: ["Talking to God", "Making wishes", "Meditation", "Singing songs"], correct_answer: "Talking to God", age_bracket: "junior" },
    { sermon_id: 4, question_text: "What does the 'A' in ACTS prayer stand for?", options: ["Asking", "Adoration", "Answer", "Always"], correct_answer: "Adoration", age_bracket: "junior" },
    { sermon_id: 5, question_text: "The Trinity teaches that God is:", options: ["Three gods", "One God in three persons", "One person with three names", "A hierarchy"], correct_answer: "One God in three persons", age_bracket: "senior" },
    { sermon_id: 5, question_text: "Which person of the Trinity planned salvation?", options: ["The Father", "The Son", "The Holy Spirit", "All equally"], correct_answer: "The Father", age_bracket: "senior" },
    { sermon_id: 6, question_text: "What does 'apologetics' mean?", options: ["Saying sorry", "A reasoned defense of the faith", "Apologizing", "Debating"], correct_answer: "A reasoned defense of the faith", age_bracket: "senior" },
    { sermon_id: 6, question_text: "Which verse commands us to defend our faith?", options: ["John 3:16", "1 Peter 3:15", "Romans 8:28", "Philippians 4:13"], correct_answer: "1 Peter 3:15", age_bracket: "senior" },
    { sermon_id: 7, question_text: "A worldview is:", options: ["A view from space", "The lens through which we interpret reality", "A map of the world", "A philosophy class"], correct_answer: "The lens through which we interpret reality", age_bracket: "senior" },
    { sermon_id: 7, question_text: "Which is NOT a big question a worldview answers?", options: ["Origin", "Meaning", "Morality", "Money"], correct_answer: "Money", age_bracket: "senior" },
    { sermon_id: 8, question_text: "Spiritual disciplines are:", options: ["Ways to earn God's favor", "Practices to receive God's grace", "Rules for Christians", "Optional hobbies"], correct_answer: "Practices to receive God's grace", age_bracket: "senior" },
    { sermon_id: 8, question_text: "Which is NOT a classic spiritual discipline?", options: ["Bible intake", "Prayer", "Fasting", "Entertainment"], correct_answer: "Entertainment", age_bracket: "senior" },
  ];
  const questions: Question[] = seedQuestions.map((q, i) => ({ ...q, id: i + 1, created_at: new Date().toISOString() }));
  writeCollection("questions", questions);
  writeCollection("quiz_sessions", []);
  writeCollection("quiz_answers", []);
}

let nextId: Record<string, number> = {};

function getNextId(collection: string): number {
  if (!nextId[collection]) {
    const items = readCollection<any>(collection);
    nextId[collection] = items.reduce((max, i) => Math.max(max, i.id || 0), 0) + 1;
  }
  return nextId[collection]++;
}

const USERS_SEED: Omit<User, "id" | "created_at">[] = [];

function seedUsers() {
  const existing = readCollection<User>("users");
  if (existing.length > 0) return;
  const users: User[] = USERS_SEED.map((u, i) => ({
    ...u,
    id: i + 1,
    created_at: new Date().toISOString(),
  }));
  writeCollection("users", users);
}

function seedProgress() {
  const existing = readCollection<StudyProgress>("progress");
  if (existing.length > 0) return;
  writeCollection("progress", []);
}

export const db = {
  sermons: {
    getAll: (ageBracket?: string): Sermon[] => {
      ensureSeeded();
      let items = readCollection<Sermon>("sermons");
      if (ageBracket) items = items.filter((s) => s.age_bracket === ageBracket);
      return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    getById: (id: number): Sermon | undefined => {
      ensureSeeded();
      return readCollection<Sermon>("sermons").find((s) => s.id === id);
    },
    getBySlug: (slug: string): Sermon | undefined => {
      ensureSeeded();
      return readCollection<Sermon>("sermons").find((s) => s.slug === slug);
    },
    create: (sermon: Omit<Sermon, "id" | "created_at">): Sermon => {
      ensureSeeded();
      const items = readCollection<Sermon>("sermons");
      const newSermon: Sermon = { ...sermon, id: getNextId("sermons"), slug: sermon.slug || toSlug(sermon.title), created_at: new Date().toISOString() };
      items.push(newSermon);
      writeCollection("sermons", items);
      return newSermon;
    },
  },
  questions: {
    getAll: (ageBracket?: string, sermonIds?: number[]): Question[] => {
      ensureSeeded();
      let items = readCollection<Question>("questions");
      if (ageBracket) items = items.filter((q) => q.age_bracket === ageBracket);
      if (sermonIds && sermonIds.length > 0) items = items.filter((q) => sermonIds.includes(q.sermon_id));
      return items;
    },
    getBySermon: (sermonId: number): Question[] => {
      ensureSeeded();
      return readCollection<Question>("questions").filter((q) => q.sermon_id === sermonId);
    },
    create: (question: Omit<Question, "id" | "created_at">): Question => {
      ensureSeeded();
      const items = readCollection<Question>("questions");
      const newQuestion: Question = { ...question, id: getNextId("questions"), created_at: new Date().toISOString() };
      items.push(newQuestion);
      writeCollection("questions", items);
      return newQuestion;
    },
    createMany: (questions: Omit<Question, "id" | "created_at">[]): Question[] => {
      ensureSeeded();
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
      ensureSeeded();
      const items = readCollection<QuizSession>("quiz_sessions");
      const newSession: QuizSession = { ...session, id: getNextId("quiz_sessions"), created_at: new Date().toISOString() };
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
      ensureSeeded();
      return readCollection<QuizSession>("quiz_sessions").find((s) => s.session_id === sessionId);
    },
  },
  quizAnswers: {
    create: (answer: Omit<QuizAnswer, "id">): QuizAnswer => {
      ensureSeeded();
      const items = readCollection<QuizAnswer>("quiz_answers");
      const newAnswer: QuizAnswer = { ...answer, id: getNextId("quiz_answers") };
      items.push(newAnswer);
      writeCollection("quiz_answers", items);
      return newAnswer;
    },
    getBySession: (sessionId: string): QuizAnswer[] => {
      ensureSeeded();
      return readCollection<QuizAnswer>("quiz_answers").filter((a) => a.session_id === sessionId);
    },
  },
  users: {
    create: (user: Omit<User, "id" | "created_at">): User => {
      seedUsers();
      const items = readCollection<User>("users");
      const newUser: User = { ...user, id: getNextId("users"), created_at: new Date().toISOString() };
      items.push(newUser);
      writeCollection("users", items);
      return newUser;
    },
    getById: (id: number): User | undefined => {
      seedUsers();
      return readCollection<User>("users").find((u) => u.id === id);
    },
  },
  progress: {
    getAll: (userId: number): StudyProgress[] => {
      seedProgress();
      return readCollection<StudyProgress>("progress").filter((p) => p.user_id === userId);
    },
    upsert: (entry: { user_id: number; sermon_id: number; completed: number }): StudyProgress => {
      seedProgress();
      const items = readCollection<StudyProgress>("progress");
      const existing = items.find((p) => p.user_id === entry.user_id && p.sermon_id === entry.sermon_id);
      if (existing) {
        existing.completed = entry.completed;
        existing.completed_at = entry.completed ? new Date().toISOString() : null;
        writeCollection("progress", items);
        return existing;
      }
      const newEntry: StudyProgress = {
        ...entry,
        id: getNextId("progress"),
        completed_at: entry.completed ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
      };
      items.push(newEntry);
      writeCollection("progress", items);
      return newEntry;
    },
  },
  stats: {
    getCounts: () => {
      ensureSeeded();
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

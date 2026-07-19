import type { Sermon, Question, QuizSession, QuizAnswer, User, StudyProgress, StudyQuestion } from "./types";

export function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim() || "untitled";
}

function excerptFromContent(content: string): string {
  return content.split('\n')[0].replace(/<[^>]*>/g, '').substring(0, 200).trim() || content.substring(0, 200).trim();
}

// Declare D1Database type since @cloudflare/workers-types is not installed
interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  error?: string;
  meta?: Record<string, unknown>;
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(col?: string): Promise<T | undefined>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1Result>;
}

// In-memory fallback storage
const memSermons: Sermon[] = [];
const memQuestions: Question[] = [];
const memSessions: QuizSession[] = [];
const memAnswers: QuizAnswer[] = [];
const memUsers: User[] = [];
const memProgress: StudyProgress[] = [];
const memStudyQuestions: StudyQuestion[] = [];
let memNextId: Record<string, number> = {};

function memGetNextId(collection: string): number {
  if (!memNextId[collection]) memNextId[collection] = 1;
  return memNextId[collection]++;
}

// Seed data
const SEED_SERMONS: Omit<Sermon, "id" | "created_at">[] = [
  { title: "Who is God?", slug: toSlug("Who is God?"), source_url: "https://example.com/who-is-god", content: "God is the Creator of everything - the heavens, the earth, and all living things. He is eternal, which means He has no beginning and no end. God is three persons in one: God the Father, God the Son (Jesus), and God the Holy Spirit. This is called the Trinity. God loves us very much. He created us in His image, which means we can think, love, and make choices. He wants to have a relationship with each one of us. The Bible tells us that 'God is love' (1 John 4:8). Even though we cannot see God with our eyes, we can know He is real through His creation, His Word (the Bible), and through Jesus who came to show us what God is like.", excerpt: excerptFromContent("God is the Creator of everything - the heavens, the earth, and all living things. He is eternal, which means He has no beginning and no end. God is three persons in one: God the Father, God the Son (Jesus), and God the Holy Spirit. This is called the Trinity. God loves us very much. He created us in His image, which means we can think, love, and make choices. He wants to have a relationship with each one of us. The Bible tells us that 'God is love' (1 John 4:8). Even though we cannot see God with our eyes, we can know He is real through His creation, His Word (the Bible), and through Jesus who came to show us what God is like."), age_bracket: "junior" as const, category: "God's Character" },
  { title: "Jesus Loves Me", slug: toSlug("Jesus Loves Me"), source_url: "https://example.com/jesus-loves-me", content: "Jesus loves every child! The Bible says, 'Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these' (Matthew 19:14). Jesus showed His love by coming to earth as a baby, growing up, teaching about God's love, healing sick people, and finally dying on the cross for our sins. He rose again three days later, showing He has power over death! When we believe in Jesus and ask Him to forgive our sins, He becomes our forever friend. He promises to never leave us (Hebrews 13:5).", excerpt: excerptFromContent("Jesus loves every child! The Bible says, 'Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these' (Matthew 19:14). Jesus showed His love by coming to earth as a baby, growing up, teaching about God's love, healing sick people, and finally dying on the cross for our sins. He rose again three days later, showing He has power over death! When we believe in Jesus and ask Him to forgive our sins, He becomes our forever friend. He promises to never leave us (Hebrews 13:5)."), age_bracket: "junior" as const, category: "Jesus" },
  { title: "The Bible: God's Special Book", slug: toSlug("The Bible: God's Special Book"), source_url: "https://example.com/bible-gods-book", content: "The Bible is God's Word written for us. It has 66 books - 39 in the Old Testament and 27 in the New Testament. The Old Testament tells about God's creation and His people before Jesus came. The New Testament tells about Jesus' life and the early church. The Bible is true and never changes. It teaches us how to live, how to love God, and how to love others. When we read the Bible, God speaks to our hearts.", excerpt: excerptFromContent("The Bible is God's Word written for us. It has 66 books - 39 in the Old Testament and 27 in the New Testament. The Old Testament tells about God's creation and His people before Jesus came. The New Testament tells about Jesus' life and the early church. The Bible is true and never changes. It teaches us how to live, how to love God, and how to love others. When we read the Bible, God speaks to our hearts."), age_bracket: "junior" as const, category: "The Bible" },
  { title: "Prayer: Talking with God", slug: toSlug("Prayer: Talking with God"), source_url: "https://example.com/prayer-talking-with-god", content: "Prayer is simply talking to God - just like you talk to your best friend! You can pray anytime, anywhere, about anything. God loves to hear from His children. Jesus taught us how to pray in the Lord's Prayer (Matthew 6:9-13). We can pray using ACTS: Adoration, Confession, Thanksgiving, Supplication. God always answers prayers - sometimes yes, sometimes no, sometimes wait.", excerpt: excerptFromContent("Prayer is simply talking to God - just like you talk to your best friend! You can pray anytime, anywhere, about anything. God loves to hear from His children. Jesus taught us how to pray in the Lord's Prayer (Matthew 6:9-13). We can pray using ACTS: Adoration, Confession, Thanksgiving, Supplication. God always answers prayers - sometimes yes, sometimes no, sometimes wait."), age_bracket: "junior" as const, category: "Prayer" },
  { title: "The Trinity: Father, Son, Holy Spirit", slug: toSlug("The Trinity: Father, Son, Holy Spirit"), source_url: "https://example.com/trinity", content: "The Trinity is one of the most profound mysteries of the Christian faith. God exists as three distinct persons - Father, Son, and Holy Spirit - yet is one God. This is not three gods, but one God in three persons. The Father is the Creator and Sustainer of all things. The Son (Jesus) is God become human - fully God and fully man. The Holy Spirit is God's presence with us today.", excerpt: excerptFromContent("The Trinity is one of the most profound mysteries of the Christian faith. God exists as three distinct persons - Father, Son, and Holy Spirit - yet is one God. This is not three gods, but one God in three persons. The Father is the Creator and Sustainer of all things. The Son (Jesus) is God become human - fully God and fully man. The Holy Spirit is God's presence with us today."), age_bracket: "senior" as const, category: "Theology" },
  { title: "Apologetics: Defending Your Faith", slug: toSlug("Apologetics: Defending Your Faith"), source_url: "https://example.com/apologetics", content: "Apologetics comes from the Greek word 'apologia' meaning a reasoned defense. As Christians, we're called to 'always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have' (1 Peter 3:15). Key areas of apologetics include evidence for God's existence, reliability of the Bible, the resurrection of Jesus, and the problem of evil.", excerpt: excerptFromContent("Apologetics comes from the Greek word 'apologia' meaning a reasoned defense. As Christians, we're called to 'always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have' (1 Peter 3:15). Key areas of apologetics include evidence for God's existence, reliability of the Bible, the resurrection of Jesus, and the problem of evil."), age_bracket: "senior" as const, category: "Apologetics" },
  { title: "Biblical Worldview", slug: toSlug("Biblical Worldview"), source_url: "https://example.com/biblical-worldview", content: "A worldview is the lens through which we interpret reality. Everyone has a worldview - the question is whether it's biblical. A biblical worldview answers life's big questions: Origin (Where did we come from?), Meaning (Why are we here?), Morality (How should we live?), Destiny (What happens after death?).", excerpt: excerptFromContent("A worldview is the lens through which we interpret reality. Everyone has a worldview - the question is whether it's biblical. A biblical worldview answers life's big questions: Origin (Where did we come from?), Meaning (Why are we here?), Morality (How should we live?), Destiny (What happens after death?)."), age_bracket: "senior" as const, category: "Worldview" },
  { title: "Spiritual Disciplines for Growth", slug: toSlug("Spiritual Disciplines for Growth"), source_url: "https://example.com/spiritual-disciplines", content: "Spiritual disciplines are practices that position us to receive God's grace and grow in Christlikeness. They're not about earning God's favor. They're about creating space for the Holy Spirit to transform us. Key disciplines include Bible intake, prayer, worship, fellowship, fasting, solitude and silence, stewardship, and evangelism.", excerpt: excerptFromContent("Spiritual disciplines are practices that position us to receive God's grace and grow in Christlikeness. They're not about earning God's favor. They're about creating space for the Holy Spirit to transform us. Key disciplines include Bible intake, prayer, worship, fellowship, fasting, solitude and silence, stewardship, and evangelism."), age_bracket: "senior" as const, category: "Christian Living" },
];

const SEED_QUESTIONS: { sermonIdx: number; question_text: string; options: string[]; correct_answer: string }[] = [
  { sermonIdx: 0, question_text: "Who created everything?", options: ["God", "Aliens", "Nature", "Scientists"], correct_answer: "God" },
  { sermonIdx: 0, question_text: "How many persons are in the Trinity?", options: ["One", "Two", "Three", "Four"], correct_answer: "Three" },
  { sermonIdx: 0, question_text: "What does 'eternal' mean?", options: ["Very old", "Has no beginning and no end", "Lives a long time", "Never sleeps"], correct_answer: "Has no beginning and no end" },
  { sermonIdx: 1, question_text: "What did Jesus say about children in Matthew 19:14?", options: ["Stay away", "Let the little children come to me", "Children are too noisy", "Wait until you're older"], correct_answer: "Let the little children come to me" },
  { sermonIdx: 1, question_text: "What did Jesus do to show His love for us?", options: ["Gave us toys", "Died on the cross for our sins", "Wrote us letters", "Made us kings"], correct_answer: "Died on the cross for our sins" },
  { sermonIdx: 1, question_text: "How many days after His death did Jesus rise again?", options: ["One", "Two", "Three", "Seven"], correct_answer: "Three" },
  { sermonIdx: 2, question_text: "How many books are in the Bible?", options: ["50", "66", "100", "39"], correct_answer: "66" },
  { sermonIdx: 2, question_text: "What does Psalm 119:105 say God's Word is?", options: ["A sword", "A lamp to my feet and a light to my path", "A shield", "A crown"], correct_answer: "A lamp to my feet and a light to my path" },
  { sermonIdx: 3, question_text: "What is prayer?", options: ["Talking to God", "Making wishes", "Meditation", "Singing songs"], correct_answer: "Talking to God" },
  { sermonIdx: 3, question_text: "What does the 'A' in ACTS prayer stand for?", options: ["Asking", "Adoration", "Answer", "Always"], correct_answer: "Adoration" },
  { sermonIdx: 4, question_text: "The Trinity teaches that God is:", options: ["Three gods", "One God in three persons", "One person with three names", "A hierarchy"], correct_answer: "One God in three persons" },
  { sermonIdx: 4, question_text: "Which person of the Trinity planned salvation?", options: ["The Father", "The Son", "The Holy Spirit", "All equally"], correct_answer: "The Father" },
  { sermonIdx: 5, question_text: "What does 'apologetics' mean?", options: ["Saying sorry", "A reasoned defense of the faith", "Apologizing", "Debating"], correct_answer: "A reasoned defense of the faith" },
  { sermonIdx: 5, question_text: "Which verse commands us to defend our faith?", options: ["John 3:16", "1 Peter 3:15", "Romans 8:28", "Philippians 4:13"], correct_answer: "1 Peter 3:15" },
  { sermonIdx: 6, question_text: "A worldview is:", options: ["A view from space", "The lens through which we interpret reality", "A map of the world", "A philosophy class"], correct_answer: "The lens through which we interpret reality" },
  { sermonIdx: 6, question_text: "Which is NOT a big question a worldview answers?", options: ["Origin", "Meaning", "Morality", "Money"], correct_answer: "Money" },
  { sermonIdx: 7, question_text: "Spiritual disciplines are:", options: ["Ways to earn God's favor", "Practices to receive God's grace", "Rules for Christians", "Optional hobbies"], correct_answer: "Practices to receive God's grace" },
  { sermonIdx: 7, question_text: "Which is NOT a classic spiritual discipline?", options: ["Bible intake", "Prayer", "Fasting", "Entertainment"], correct_answer: "Entertainment" },
];

export function createDb(d1: D1Database | null) {
  // D1-backed implementation
  if (d1) {
    const _d1: D1Database = d1;
    let seeded = false;
    async function ensureSeeded() {
      if (seeded) return;
      const existing = await _d1.prepare("SELECT COUNT(*) as count FROM sermons").first<{ count: number }>();
      if (existing && existing.count > 0) { seeded = true; return; }
      seeded = true;
      for (const s of SEED_SERMONS) {
        await _d1.prepare("INSERT INTO sermons (title, slug, source_url, content, age_bracket, category, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))").bind(s.title, s.slug, s.source_url, s.content, s.age_bracket, s.category).run();
      }
      for (const q of SEED_QUESTIONS) {
        const row = await _d1.prepare("SELECT id FROM sermons WHERE title = ?").bind(SEED_SERMONS[q.sermonIdx].title).first<{ id: number }>();
        if (row) {
          await _d1.prepare("INSERT INTO questions (sermon_id, question_text, options, correct_answer, age_bracket, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))").bind(row.id, q.question_text, JSON.stringify(q.options), q.correct_answer, SEED_SERMONS[q.sermonIdx].age_bracket).run();
        }
      }
    }

    return {
      sermons: {
        getAll: async (ageBracket?: string): Promise<Sermon[]> => {
          await ensureSeeded();
          let sql = "SELECT * FROM sermons";
          const params: any[] = [];
          if (ageBracket) { sql += " WHERE age_bracket = ?"; params.push(ageBracket); }
          sql += " ORDER BY created_at DESC";
          const { results } = await _d1.prepare(sql).bind(...params).all<Sermon>();
          return results || [];
        },
        getById: async (id: number): Promise<Sermon | undefined> => {
          await ensureSeeded();
          return _d1.prepare("SELECT * FROM sermons WHERE id = ?").bind(id).first<Sermon>();
        },
        getBySlug: async (slug: string): Promise<Sermon | undefined> => {
          await ensureSeeded();
          return _d1.prepare("SELECT * FROM sermons WHERE slug = ?").bind(slug).first<Sermon>();
        },
        create: async (sermon: Omit<Sermon, "id" | "created_at">): Promise<Sermon> => {
          await ensureSeeded();
          const slug = sermon.slug || toSlug(sermon.title);
          const excerpt = sermon.excerpt || excerptFromContent(sermon.content);
          await _d1.prepare("INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))").bind(sermon.title, slug, sermon.source_url, sermon.content, excerpt, sermon.age_bracket, sermon.category).run();
          const row = await _d1.prepare("SELECT * FROM sermons WHERE rowid = last_insert_rowid()").first<Sermon>();
          return row || { ...sermon, excerpt, slug, id: Date.now(), created_at: new Date().toISOString() };
        },
        update: async (id: number, data: Partial<Omit<Sermon, "id" | "created_at">>): Promise<Sermon | undefined> => {
          await ensureSeeded();
          const sets: string[] = [];
          const params: any[] = [];
          if (data.title !== undefined) { sets.push("title = ?"); params.push(data.title); }
          if (data.slug !== undefined) { sets.push("slug = ?"); params.push(data.slug); }
          if (data.source_url !== undefined) { sets.push("source_url = ?"); params.push(data.source_url); }
          if (data.content !== undefined) { sets.push("content = ?"); params.push(data.content); }
          if (data.excerpt !== undefined) { sets.push("excerpt = ?"); params.push(data.excerpt); }
          if (data.age_bracket !== undefined) { sets.push("age_bracket = ?"); params.push(data.age_bracket); }
          if (data.category !== undefined) { sets.push("category = ?"); params.push(data.category); }
          if (sets.length > 0) {
            params.push(id);
            await _d1.prepare(`UPDATE sermons SET ${sets.join(", ")} WHERE id = ?`).bind(...params).run();
          }
          return _d1.prepare("SELECT * FROM sermons WHERE id = ?").bind(id).first<Sermon>();
        },
        delete: async (id: number): Promise<void> => {
          await ensureSeeded();
          await _d1.prepare("DELETE FROM questions WHERE sermon_id = ?").bind(id).run();
          await _d1.prepare("DELETE FROM study_questions WHERE sermon_id = ?").bind(id).run();
          await _d1.prepare("DELETE FROM study_progress WHERE sermon_id = ?").bind(id).run();
          await _d1.prepare("DELETE FROM sermons WHERE id = ?").bind(id).run();
        },
      },
      questions: {
        getAll: async (ageBracket?: string, sermonIds?: number[]): Promise<Question[]> => {
          await ensureSeeded();
          let sql = "SELECT * FROM questions";
          const params: any[] = [];
          const clauses: string[] = [];
          if (ageBracket) { clauses.push("age_bracket = ?"); params.push(ageBracket); }
          if (sermonIds && sermonIds.length > 0) {
            clauses.push(`sermon_id IN (${sermonIds.map(() => "?").join(",")})`);
            params.push(...sermonIds);
          }
          if (clauses.length > 0) sql += " WHERE " + clauses.join(" AND ");
          const { results } = await _d1.prepare(sql).bind(...params).all<any>();
          return (results || []).map((r: any) => ({ ...r, options: typeof r.options === "string" ? JSON.parse(r.options) : r.options }));
        },
        getBySermon: async (sermonId: number): Promise<Question[]> => {
          await ensureSeeded();
          const { results } = await _d1.prepare("SELECT * FROM questions WHERE sermon_id = ?").bind(sermonId).all<any>();
          return (results || []).map((r: any) => ({ ...r, options: typeof r.options === "string" ? JSON.parse(r.options) : r.options }));
        },
        create: async (question: Omit<Question, "id" | "created_at">): Promise<Question> => {
          await ensureSeeded();
          await _d1.prepare("INSERT INTO questions (sermon_id, question_text, options, correct_answer, age_bracket, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))").bind(question.sermon_id, question.question_text, JSON.stringify(question.options), question.correct_answer, question.age_bracket).run();
          const row = await _d1.prepare("SELECT * FROM questions WHERE rowid = last_insert_rowid()").first<any>();
          return { ...row, options: typeof row?.options === "string" ? JSON.parse(row.options) : row?.options || question.options };
        },
        update: async (id: number, data: Partial<Omit<Question, "id" | "created_at">>): Promise<Question | undefined> => {
          await ensureSeeded();
          const sets: string[] = [];
          const params: any[] = [];
          if (data.question_text !== undefined) { sets.push("question_text = ?"); params.push(data.question_text); }
          if (data.options !== undefined) { sets.push("options = ?"); params.push(JSON.stringify(data.options)); }
          if (data.correct_answer !== undefined) { sets.push("correct_answer = ?"); params.push(data.correct_answer); }
          if (data.age_bracket !== undefined) { sets.push("age_bracket = ?"); params.push(data.age_bracket); }
          if (data.sermon_id !== undefined) { sets.push("sermon_id = ?"); params.push(data.sermon_id); }
          if (sets.length > 0) {
            params.push(id);
            await _d1.prepare(`UPDATE questions SET ${sets.join(", ")} WHERE id = ?`).bind(...params).run();
          }
          const row = await _d1.prepare("SELECT * FROM questions WHERE id = ?").bind(id).first<any>();
          return row ? { ...row, options: typeof row.options === "string" ? JSON.parse(row.options) : row.options } : undefined;
        },
        delete: async (id: number): Promise<void> => {
          await ensureSeeded();
          await _d1.prepare("DELETE FROM questions WHERE id = ?").bind(id).run();
        },
        createMany: async (items: Omit<Question, "id" | "created_at">[]): Promise<Question[]> => {
          const results: Question[] = [];
          for (const q of items) {
            await _d1.prepare("INSERT INTO questions (sermon_id, question_text, options, correct_answer, age_bracket, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))").bind(q.sermon_id, q.question_text, JSON.stringify(q.options), q.correct_answer, q.age_bracket).run();
            const row = await _d1.prepare("SELECT * FROM questions WHERE rowid = last_insert_rowid()").first<any>();
            results.push({ ...row, options: typeof row?.options === "string" ? JSON.parse(row.options) : row?.options || q.options });
          }
          return results;
        },
      },
      studyQuestions: {
        getAll: async (ageBracket?: string): Promise<StudyQuestion[]> => {
          await ensureSeeded();
          if (ageBracket) {
            const { results } = await _d1.prepare(
              "SELECT sq.* FROM study_questions sq JOIN sermons s ON sq.sermon_id = s.id WHERE s.age_bracket = ? ORDER BY sq.id"
            ).bind(ageBracket).all<StudyQuestion>();
            return results || [];
          }
          const { results } = await _d1.prepare("SELECT * FROM study_questions ORDER BY id").all<StudyQuestion>();
          return results || [];
        },
        getBySermon: async (sermonId: number): Promise<StudyQuestion[]> => {
          await ensureSeeded();
          const { results } = await _d1.prepare("SELECT * FROM study_questions WHERE sermon_id = ? ORDER BY id").bind(sermonId).all<StudyQuestion>();
          return results || [];
        },
        create: async (sq: Omit<StudyQuestion, "id" | "created_at">): Promise<StudyQuestion> => {
          await ensureSeeded();
          await _d1.prepare("INSERT INTO study_questions (sermon_id, question_text, answer_text, created_at) VALUES (?, ?, ?, datetime('now'))").bind(sq.sermon_id, sq.question_text, sq.answer_text).run();
          const row = await _d1.prepare("SELECT * FROM study_questions WHERE rowid = last_insert_rowid()").first<StudyQuestion>();
          return row || { ...sq, id: Date.now(), created_at: new Date().toISOString() };
        },
        update: async (id: number, data: Partial<Omit<StudyQuestion, "id" | "created_at">>): Promise<StudyQuestion | undefined> => {
          await ensureSeeded();
          const sets: string[] = [];
          const params: any[] = [];
          if (data.question_text !== undefined) { sets.push("question_text = ?"); params.push(data.question_text); }
          if (data.answer_text !== undefined) { sets.push("answer_text = ?"); params.push(data.answer_text); }
          if (data.sermon_id !== undefined) { sets.push("sermon_id = ?"); params.push(data.sermon_id); }
          if (sets.length > 0) {
            params.push(id);
            await _d1.prepare(`UPDATE study_questions SET ${sets.join(", ")} WHERE id = ?`).bind(...params).run();
          }
          return _d1.prepare("SELECT * FROM study_questions WHERE id = ?").bind(id).first<StudyQuestion>();
        },
        delete: async (id: number): Promise<void> => {
          await ensureSeeded();
          await _d1.prepare("DELETE FROM study_questions WHERE id = ?").bind(id).run();
        },
      },
      quizSessions: {
        create: async (session: Omit<QuizSession, "id" | "created_at">): Promise<QuizSession> => {
          await ensureSeeded();
          await _d1.prepare("INSERT INTO quiz_sessions (session_id, age_bracket, sermon_ids, score, total, completed_at, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))").bind(session.session_id, session.age_bracket, session.sermon_ids, session.score, session.total, session.completed_at).run();
          return (await _d1.prepare("SELECT * FROM quiz_sessions WHERE session_id = ?").bind(session.session_id).first<QuizSession>()) || { ...session, id: Date.now(), created_at: new Date().toISOString() };
        },
        update: async (sessionId: string, updates: Partial<QuizSession>): Promise<QuizSession | undefined> => {
          await ensureSeeded();
          const sets: string[] = [];
          const params: any[] = [];
          if (updates.score !== undefined) { sets.push("score = ?"); params.push(updates.score); }
          if (updates.total !== undefined) { sets.push("total = ?"); params.push(updates.total); }
          if (updates.completed_at !== undefined) { sets.push("completed_at = ?"); params.push(updates.completed_at); }
          if (sets.length > 0) {
            params.push(sessionId);
            await _d1.prepare(`UPDATE quiz_sessions SET ${sets.join(", ")} WHERE session_id = ?`).bind(...params).run();
          }
          return _d1.prepare("SELECT * FROM quiz_sessions WHERE session_id = ?").bind(sessionId).first<QuizSession>();
        },
        getById: async (sessionId: string): Promise<QuizSession | undefined> => {
          await ensureSeeded();
          return _d1.prepare("SELECT * FROM quiz_sessions WHERE session_id = ?").bind(sessionId).first<QuizSession>();
        },
      },
      quizAnswers: {
        create: async (answer: Omit<QuizAnswer, "id">): Promise<QuizAnswer> => {
          await ensureSeeded();
          await _d1.prepare("INSERT INTO quiz_answers (session_id, question_id, selected_answer, is_correct, timestamp) VALUES (?, ?, ?, ?, ?)").bind(answer.session_id, answer.question_id, answer.selected_answer, answer.is_correct, answer.timestamp).run();
          return (await _d1.prepare("SELECT * FROM quiz_answers WHERE rowid = last_insert_rowid()").first<QuizAnswer>()) || { ...answer, id: Date.now() };
        },
        getBySession: async (sessionId: string): Promise<QuizAnswer[]> => {
          await ensureSeeded();
          const { results } = await _d1.prepare("SELECT * FROM quiz_answers WHERE session_id = ?").bind(sessionId).all<QuizAnswer>();
          return results || [];
        },
      },
      users: {
        create: async (user: Omit<User, "id" | "created_at"> & { email_verified?: number; verification_token?: string | null }): Promise<User> => {
          await ensureSeeded();
          await _d1.prepare("INSERT INTO users (first_name, last_name, branch, phone, email, age_bracket, password_hash, email_verified, verification_token, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))").bind(user.first_name, user.last_name, user.branch, user.phone, user.email, user.age_bracket, user.password_hash ?? "", user.email_verified ?? 0, user.verification_token ?? null).run();
          return (await _d1.prepare("SELECT * FROM users WHERE rowid = last_insert_rowid()").first<User>())!;
        },
        getById: async (id: number): Promise<User | undefined> => {
          await ensureSeeded();
          return _d1.prepare("SELECT * FROM users WHERE id = ?").bind(id).first<User>();
        },
        findByEmail: async (email: string): Promise<User | undefined> => {
          await ensureSeeded();
          return _d1.prepare("SELECT * FROM users WHERE email = ?").bind(email).first<User>();
        },
        findByVerificationToken: async (token: string): Promise<User | undefined> => {
          await ensureSeeded();
          return _d1.prepare("SELECT * FROM users WHERE verification_token = ?").bind(token).first<User>();
        },
        updateVerification: async (userId: number): Promise<User | undefined> => {
          await ensureSeeded();
          await _d1.prepare("UPDATE users SET email_verified = 1, verification_token = NULL WHERE id = ?").bind(userId).run();
          return _d1.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first<User>();
        },
        setToken: async (userId: number, token: string): Promise<User | undefined> => {
          await ensureSeeded();
          await _d1.prepare("UPDATE users SET verification_token = ? WHERE id = ?").bind(token, userId).run();
          return _d1.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first<User>();
        },
      },
      progress: {
        getAll: async (userId: number): Promise<StudyProgress[]> => {
          await ensureSeeded();
          const { results } = await _d1.prepare("SELECT * FROM study_progress WHERE user_id = ?").bind(userId).all<StudyProgress>();
          return results || [];
        },
        upsert: async (entry: { user_id: number; sermon_id: number; completed: number; questions_done?: number }): Promise<StudyProgress> => {
          await ensureSeeded();
          const existing = await _d1.prepare("SELECT * FROM study_progress WHERE user_id = ? AND sermon_id = ?").bind(entry.user_id, entry.sermon_id).first<StudyProgress>();
          if (existing) {
            const sets: string[] = [];
            const params: any[] = [];
            if (entry.completed !== undefined) {
              sets.push("completed = ?");
              params.push(entry.completed);
              sets.push("completed_at = ?");
              params.push(entry.completed ? new Date().toISOString() : null);
            }
            if (entry.questions_done !== undefined) {
              sets.push("questions_done = ?");
              params.push(entry.questions_done);
            }
            if (sets.length > 0) {
              params.push(entry.user_id, entry.sermon_id);
              await _d1.prepare(`UPDATE study_progress SET ${sets.join(", ")} WHERE user_id = ? AND sermon_id = ?`).bind(...params).run();
            }
            return (await _d1.prepare("SELECT * FROM study_progress WHERE user_id = ? AND sermon_id = ?").bind(entry.user_id, entry.sermon_id).first<StudyProgress>()) || existing;
          }
          await _d1.prepare("INSERT INTO study_progress (user_id, sermon_id, completed, questions_done, completed_at, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))").bind(entry.user_id, entry.sermon_id, entry.completed ?? 0, entry.questions_done ?? 0, entry.completed ? new Date().toISOString() : null).run();
          const row = await _d1.prepare("SELECT * FROM study_progress WHERE rowid = last_insert_rowid()").first<StudyProgress>();
          return row || { ...entry, id: Date.now(), questions_done: entry.questions_done ?? 0, completed_at: entry.completed ? new Date().toISOString() : null, created_at: new Date().toISOString() };
        },
      },
      stats: {
        getCounts: async () => {
          await ensureSeeded();
          const totalSermons = (await _d1.prepare("SELECT COUNT(*) as c FROM sermons").first<{ c: number }>())?.c || 0;
          const juniorSermons = (await _d1.prepare("SELECT COUNT(*) as c FROM sermons WHERE age_bracket = 'junior'").first<{ c: number }>())?.c || 0;
          const seniorSermons = (await _d1.prepare("SELECT COUNT(*) as c FROM sermons WHERE age_bracket = 'senior'").first<{ c: number }>())?.c || 0;
          const totalQuestions = (await _d1.prepare("SELECT COUNT(*) as c FROM questions").first<{ c: number }>())?.c || 0;
          const juniorQuestions = (await _d1.prepare("SELECT COUNT(*) as c FROM questions WHERE age_bracket = 'junior'").first<{ c: number }>())?.c || 0;
          const seniorQuestions = (await _d1.prepare("SELECT COUNT(*) as c FROM questions WHERE age_bracket = 'senior'").first<{ c: number }>())?.c || 0;
          return { totalSermons, juniorSermons, seniorSermons, totalQuestions, juniorQuestions, seniorQuestions };
        },
      },
    };
  }

  // In-memory fallback (async-compatible wrappers)
  let memSeeded = false;
  function ensureMemSeeded() {
    if (memSeeded) return;
    memSeeded = true;
    for (const s of SEED_SERMONS) {
      memSermons.push({ ...s, id: memGetNextId("sermons"), created_at: new Date().toISOString() });
    }
    for (const q of SEED_QUESTIONS) {
      const sermon = memSermons[q.sermonIdx];
      if (sermon) {
        memQuestions.push({
          id: memGetNextId("questions"),
          sermon_id: sermon.id,
          question_text: q.question_text,
          options: q.options,
          correct_answer: q.correct_answer,
          age_bracket: sermon.age_bracket,
          created_at: new Date().toISOString(),
        });
      }
    }
  }

  return {
    sermons: {
      getAll: async (ageBracket?: string): Promise<Sermon[]> => {
        ensureMemSeeded();
        let items = memSermons;
        if (ageBracket) items = items.filter((s) => s.age_bracket === ageBracket);
        return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },
      getById: async (id: number): Promise<Sermon | undefined> => {
        ensureMemSeeded();
        return memSermons.find((s) => s.id === id);
      },
      getBySlug: async (slug: string): Promise<Sermon | undefined> => {
        ensureMemSeeded();
        return memSermons.find((s) => s.slug === slug);
      },
      create: async (sermon: Omit<Sermon, "id" | "created_at">): Promise<Sermon> => {
        ensureMemSeeded();
        const excerpt = sermon.excerpt || excerptFromContent(sermon.content);
        const newSermon: Sermon = { ...sermon, excerpt, slug: sermon.slug || toSlug(sermon.title), id: memGetNextId("sermons"), created_at: new Date().toISOString() };
        memSermons.push(newSermon);
        return newSermon;
      },
      update: async (id: number, data: Partial<Omit<Sermon, "id" | "created_at">>): Promise<Sermon | undefined> => {
        ensureMemSeeded();
        const idx = memSermons.findIndex((s) => s.id === id);
        if (idx === -1) return undefined;
        Object.assign(memSermons[idx], data);
        return memSermons[idx];
      },
      delete: async (id: number): Promise<void> => {
        ensureMemSeeded();
        const idx = memSermons.findIndex((s) => s.id === id);
        if (idx !== -1) {
          for (let i = memQuestions.length - 1; i >= 0; i--) {
            if (memQuestions[i].sermon_id === id) memQuestions.splice(i, 1);
          }
          for (let i = memStudyQuestions.length - 1; i >= 0; i--) {
            if (memStudyQuestions[i].sermon_id === id) memStudyQuestions.splice(i, 1);
          }
          for (let i = memProgress.length - 1; i >= 0; i--) {
            if (memProgress[i].sermon_id === id) memProgress.splice(i, 1);
          }
          memSermons.splice(idx, 1);
        }
      },
    },
    questions: {
      getAll: async (ageBracket?: string, sermonIds?: number[]): Promise<Question[]> => {
        ensureMemSeeded();
        let items = memQuestions;
        if (ageBracket) items = items.filter((q) => q.age_bracket === ageBracket);
        if (sermonIds && sermonIds.length > 0) items = items.filter((q) => sermonIds.includes(q.sermon_id));
        return items;
      },
      getBySermon: async (sermonId: number): Promise<Question[]> => {
        ensureMemSeeded();
        return memQuestions.filter((q) => q.sermon_id === sermonId);
      },
      create: async (question: Omit<Question, "id" | "created_at">): Promise<Question> => {
        ensureMemSeeded();
        const newQ: Question = { ...question, id: memGetNextId("questions"), created_at: new Date().toISOString() };
        memQuestions.push(newQ);
        return newQ;
      },
      update: async (id: number, data: Partial<Omit<Question, "id" | "created_at">>): Promise<Question | undefined> => {
        ensureMemSeeded();
        const idx = memQuestions.findIndex((q) => q.id === id);
        if (idx === -1) return undefined;
        Object.assign(memQuestions[idx], data);
        return memQuestions[idx];
      },
      delete: async (id: number): Promise<void> => {
        ensureMemSeeded();
        const idx = memQuestions.findIndex((q) => q.id === id);
        if (idx !== -1) memQuestions.splice(idx, 1);
      },
      createMany: async (items: Omit<Question, "id" | "created_at">[]): Promise<Question[]> => {
        ensureMemSeeded();
        const created: Question[] = [];
        for (const q of items) {
          const newQ: Question = { ...q, id: memGetNextId("questions"), created_at: new Date().toISOString() };
          memQuestions.push(newQ);
          created.push(newQ);
        }
        return created;
      },
    },
    studyQuestions: {
      getAll: async (ageBracket?: string): Promise<StudyQuestion[]> => {
        ensureMemSeeded();
        if (ageBracket) {
          const sermonIds = memSermons.filter((s) => s.age_bracket === ageBracket).map((s) => s.id);
          return memStudyQuestions.filter((sq) => sermonIds.includes(sq.sermon_id));
        }
        return [...memStudyQuestions];
      },
      getBySermon: async (sermonId: number): Promise<StudyQuestion[]> => {
        ensureMemSeeded();
        return memStudyQuestions.filter((sq) => sq.sermon_id === sermonId);
      },
      create: async (sq: Omit<StudyQuestion, "id" | "created_at">): Promise<StudyQuestion> => {
        ensureMemSeeded();
        const newSQ: StudyQuestion = { ...sq, id: memGetNextId("study_questions"), created_at: new Date().toISOString() };
        memStudyQuestions.push(newSQ);
        return newSQ;
      },
      update: async (id: number, data: Partial<Omit<StudyQuestion, "id" | "created_at">>): Promise<StudyQuestion | undefined> => {
        ensureMemSeeded();
        const idx = memStudyQuestions.findIndex((sq) => sq.id === id);
        if (idx === -1) return undefined;
        Object.assign(memStudyQuestions[idx], data);
        return memStudyQuestions[idx];
      },
      delete: async (id: number): Promise<void> => {
        ensureMemSeeded();
        const idx = memStudyQuestions.findIndex((sq) => sq.id === id);
        if (idx !== -1) memStudyQuestions.splice(idx, 1);
      },
    },
    quizSessions: {
      create: async (session: Omit<QuizSession, "id" | "created_at">): Promise<QuizSession> => {
        ensureMemSeeded();
        const newS: QuizSession = { ...session, id: memGetNextId("quiz_sessions"), created_at: new Date().toISOString() };
        memSessions.push(newS);
        return newS;
      },
      update: async (sessionId: string, updates: Partial<QuizSession>): Promise<QuizSession | undefined> => {
        ensureMemSeeded();
        const idx = memSessions.findIndex((s) => s.session_id === sessionId);
        if (idx === -1) return undefined;
        memSessions[idx] = { ...memSessions[idx], ...updates };
        return memSessions[idx];
      },
      getById: async (sessionId: string): Promise<QuizSession | undefined> => {
        ensureMemSeeded();
        return memSessions.find((s) => s.session_id === sessionId);
      },
    },
    quizAnswers: {
      create: async (answer: Omit<QuizAnswer, "id">): Promise<QuizAnswer> => {
        ensureMemSeeded();
        const newA: QuizAnswer = { ...answer, id: memGetNextId("quiz_answers") };
        memAnswers.push(newA);
        return newA;
      },
      getBySession: async (sessionId: string): Promise<QuizAnswer[]> => {
        ensureMemSeeded();
        return memAnswers.filter((a) => a.session_id === sessionId);
      },
    },
    users: {
      create: async (user: Omit<User, "id" | "created_at"> & { email_verified?: number; verification_token?: string | null }): Promise<User> => {
        ensureMemSeeded();
        const newUser: User = { ...user, id: memGetNextId("users"), password_hash: user.password_hash ?? "", email_verified: user.email_verified ?? 0, verification_token: user.verification_token ?? null, created_at: new Date().toISOString() } as User;
        memUsers.push(newUser);
        return newUser;
      },
      getById: async (id: number): Promise<User | undefined> => {
        ensureMemSeeded();
        return memUsers.find((u) => u.id === id);
      },
      findByEmail: async (email: string): Promise<User | undefined> => {
        ensureMemSeeded();
        return memUsers.find((u) => u.email === email);
      },
      findByVerificationToken: async (token: string): Promise<User | undefined> => {
        ensureMemSeeded();
        return memUsers.find((u) => u.verification_token === token);
      },
      updateVerification: async (userId: number): Promise<User | undefined> => {
        ensureMemSeeded();
        const user = memUsers.find((u) => u.id === userId);
        if (user) {
          user.email_verified = 1;
          user.verification_token = null;
        }
        return user;
      },
      setToken: async (userId: number, token: string): Promise<User | undefined> => {
        ensureMemSeeded();
        const user = memUsers.find((u) => u.id === userId);
        if (user) {
          user.verification_token = token;
        }
        return user;
      },
    },
    progress: {
      getAll: async (userId: number): Promise<StudyProgress[]> => {
        ensureMemSeeded();
        return memProgress.filter((p) => p.user_id === userId);
      },
      upsert: async (entry: { user_id: number; sermon_id: number; completed?: number; questions_done?: number }): Promise<StudyProgress> => {
        ensureMemSeeded();
        const existing = memProgress.find((p) => p.user_id === entry.user_id && p.sermon_id === entry.sermon_id);
        if (existing) {
          if (entry.completed !== undefined) {
            existing.completed = entry.completed;
            existing.completed_at = entry.completed ? new Date().toISOString() : null;
          }
          if (entry.questions_done !== undefined) {
            existing.questions_done = entry.questions_done;
          }
          return existing;
        }
        const newEntry: StudyProgress = { ...entry, id: memGetNextId("progress"), completed: entry.completed ?? 0, questions_done: entry.questions_done ?? 0, completed_at: entry.completed ? new Date().toISOString() : null, created_at: new Date().toISOString() };
        memProgress.push(newEntry);
        return newEntry;
      },
    },
    stats: {
      getCounts: async () => {
        ensureMemSeeded();
        return { totalSermons: memSermons.length, juniorSermons: memSermons.filter((s) => s.age_bracket === "junior").length, seniorSermons: memSermons.filter((s) => s.age_bracket === "senior").length, totalQuestions: memQuestions.length, juniorQuestions: memQuestions.filter((q) => q.age_bracket === "junior").length, seniorQuestions: memQuestions.filter((q) => q.age_bracket === "senior").length };
      },
    },
  };
}

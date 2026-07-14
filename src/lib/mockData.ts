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
  age_bracket: "junior" | "senior";
  created_at: string;
}

export const SermonData: Sermon[] = [
  {
    id: 1,
    title: "Who is God?",
    slug: "who-is-god",
    source_url: "https://example.com/who-is-god",
    content: `God is the Creator of everything - the heavens, the earth, and all living things. He is eternal, which means He has no beginning and no end. God is three persons in one: God the Father, God the Son (Jesus), and God the Holy Spirit. This is called the Trinity.

God loves us very much. He created us in His image, which means we can think, love, and make choices. He wants to have a relationship with each one of us. The Bible tells us that "God is love" (1 John 4:8).

Even though we cannot see God with our eyes, we can know He is real through His creation, His Word (the Bible), and through Jesus who came to show us what God is like. God is all-powerful (omnipotent), all-knowing (omniscient), and present everywhere (omnipresent).`,
    excerpt: "Discover who God is - the loving Creator who wants a relationship with you. Learn about the Trinity and God's amazing attributes.",
    age_bracket: "junior",
    category: "God's Character",
    created_at: "2024-01-15"
  },
  {
    id: 2,
    title: "Jesus Loves Me",
    slug: "jesus-loves-me",
    source_url: "https://example.com/jesus-loves-me",
    content: `Jesus loves every child! The Bible says, "Let the little children come to me, and do not hinder them, for the kingdom of heaven belongs to such as these" (Matthew 19:14).

Jesus showed His love by coming to earth as a baby, growing up, teaching about God's love, healing sick people, and finally dying on the cross for our sins. He rose again three days later, showing He has power over death!

When we believe in Jesus and ask Him to forgive our sins, He becomes our forever friend. He promises to never leave us (Hebrews 13:5). We can talk to Jesus anytime through prayer - He always listens!

Jesus wants us to love others like He loves us. We can show His love by being kind, sharing, helping others, and telling them about Jesus.`,
    excerpt: "Learn how much Jesus loves you! Discover His life, death, and resurrection, and how to have Him as your forever friend.",
    age_bracket: "junior",
    category: "Jesus",
    created_at: "2024-01-20"
  },
  {
    id: 3,
    title: "The Bible: God's Special Book",
    slug: "the-bible-gods-special-book",
    source_url: "https://example.com/bible-gods-book",
    content: `The Bible is God's Word written for us. It has 66 books - 39 in the Old Testament and 27 in the New Testament. The Old Testament tells about God's creation and His people before Jesus came. The New Testament tells about Jesus' life and the early church.

The Bible is true and never changes. It teaches us how to live, how to love God, and how to love others. When we read the Bible, God speaks to our hearts. The Psalmist said, "Your word is a lamp to my feet and a light to my path" (Psalm 119:105).

We should read the Bible every day, even if it's just one verse. We can memorize verses to hide God's Word in our hearts (Psalm 119:11). The Bible helps us make good choices and know God better.`,
    excerpt: "Explore God's amazing Book - the Bible! Learn why it's special, how it's organized, and why reading it daily helps us grow closer to God.",
    age_bracket: "junior",
    category: "The Bible",
    created_at: "2024-01-25"
  },
  {
    id: 4,
    title: "Prayer: Talking with God",
    slug: "prayer-talking-with-god",
    source_url: "https://example.com/prayer-talking-with-god",
    content: `Prayer is simply talking to God - just like you talk to your best friend! You can pray anytime, anywhere, about anything. God loves to hear from His children.

Jesus taught us how to pray in the Lord's Prayer (Matthew 6:9-13): "Our Father in heaven, hallowed be your name. Your kingdom come, your will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our debts, as we also have forgiven our debtors. And lead us not into temptation, but deliver us from evil."

We can pray using ACTS:
- Adoration: Praise God for who He is
- Confession: Tell God we're sorry for wrong things
- Thanksgiving: Thank God for His blessings
- Supplication: Ask God for what we and others need

God always answers prayers - sometimes yes, sometimes no, sometimes wait. But He always knows what's best for us!`,
    excerpt: "Learn how to talk to God through prayer! Discover the Lord's Prayer, the ACTS method, and how God always listens to His children.",
    age_bracket: "junior",
    category: "Prayer",
    created_at: "2024-02-01"
  },
  {
    id: 5,
    title: "The Trinity: Father, Son, and Holy Spirit",
    slug: "the-trinity-father-son-holy-spirit",
    source_url: "https://example.com/trinity",
    content: `The Trinity is one of the most profound mysteries of the Christian faith. God exists as three distinct persons - Father, Son, and Holy Spirit - yet is one God. This is not three gods, but one God in three persons.

The Father is the Creator and Sustainer of all things. He sent His Son Jesus to save us. The Son (Jesus) is God become human - fully God and fully man. He lived a perfect life, died for our sins, and rose again. The Holy Spirit is God's presence with us today - He comforts, guides, convicts, and empowers believers.

Each person of the Trinity is fully God, co-equal and co-eternal. They have distinct roles but perfect unity. The Father plans, the Son accomplishes, the Spirit applies. This truth shapes how we worship, pray, and live as Christians.

Understanding the Trinity helps us grasp the depth of God's love - the Father giving His Son, the Son giving His life, the Spirit giving Himself to dwell in us.`,
    excerpt: "Dive deep into the mystery of the Trinity - one God in three persons. Explore the distinct roles and perfect unity of Father, Son, and Holy Spirit.",
    age_bracket: "senior",
    category: "Theology",
    created_at: "2024-01-10"
  },
  {
    id: 6,
    title: "Apologetics: Defending Your Faith",
    slug: "apologetics-defending-your-faith",
    source_url: "https://example.com/apologetics",
    content: `Apologetics comes from the Greek word "apologia" meaning a reasoned defense. As Christians, we're called to "always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have" (1 Peter 3:15).

Key areas of apologetics include:
- Evidence for God's existence (cosmological, teleological, moral arguments)
- Reliability of the Bible (manuscript evidence, archaeology, fulfilled prophecy)
- The resurrection of Jesus (historical facts, alternative theories)
- Problem of evil and suffering
- Science and faith compatibility

Apologetics isn't about winning arguments - it's about removing intellectual barriers to faith and strengthening believers' confidence. It requires gentleness and respect (1 Peter 3:15).

Study resources: William Lane Craig, Ravi Zacharias, C.S. Lewis, Lee Strobel, and modern apologists like Alisa Childers and Natasha Crain.`,
    excerpt: "Equip yourself to defend your faith with confidence. Learn key arguments for God's existence, Bible reliability, the resurrection, and addressing tough questions.",
    age_bracket: "senior",
    category: "Apologetics",
    created_at: "2024-01-18"
  },
  {
    id: 7,
    title: "Biblical Worldview: Thinking Christianly",
    slug: "biblical-worldview-thinking-christianly",
    source_url: "https://example.com/biblical-worldview",
    content: `A worldview is the lens through which we interpret reality. Everyone has a worldview - the question is whether it's biblical. A biblical worldview answers life's big questions: Origin (Where did we come from?), Meaning (Why are we here?), Morality (How should we live?), Destiny (What happens after death?).

The Bible teaches: We're created by God in His image (Genesis 1:27). Our purpose is to glorify God and enjoy Him forever. Morality is grounded in God's character, not cultural preference. Eternity awaits - heaven for those in Christ, separation from God for those who reject Him.

Competing worldviews include naturalism (only physical world exists), postmodernism (no objective truth), new spirituality (all paths lead to God), and secular humanism (humanity is the measure of all things).

Developing a biblical worldview requires renewing our minds (Romans 12:2), taking every thought captive (2 Corinthians 10:5), and seeing all of life - work, relationships, entertainment, politics - through Scripture's framework.`,
    excerpt: "Develop a robust biblical worldview. Learn to think Christianly about origin, meaning, morality, and destiny while engaging competing cultural narratives.",
    age_bracket: "senior",
    category: "Worldview",
    created_at: "2024-01-22"
  },
  {
    id: 8,
    title: "Spiritual Disciplines for Growth",
    slug: "spiritual-disciplines-for-growth",
    source_url: "https://example.com/spiritual-disciplines",
    content: `Spiritual disciplines are practices that position us to receive God's grace and grow in Christlikeness. They're not about earning God's favor - Jesus already did that. They're about creating space for the Holy Spirit to transform us.

Key disciplines include:
- Bible intake (reading, studying, memorizing, meditating)
- Prayer (adoration, confession, thanksgiving, supplication, intercession)
- Worship (personal and corporate)
- Fellowship (community, accountability, service)
- Fasting (abstaining from food/pleasure to focus on God)
- Solitude and silence (withdrawing from noise to hear God)
- Stewardship (time, talents, treasure)
- Evangelism (sharing the gospel)

Start small - consistency beats intensity. Pick one discipline, practice it daily for a month. Join with others for accountability. Remember: "Train yourself for godliness" (1 Timothy 4:7). The goal isn't the discipline itself, but knowing Jesus more intimately.`,
    excerpt: "Cultivate spiritual habits that deepen your walk with Christ. Explore Bible intake, prayer, worship, fasting, solitude, and more - not as duty, but as delight.",
    age_bracket: "senior",
    category: "Christian Living",
    created_at: "2024-02-05"
  }
];

export const QuestionData: Question[] = [
  // Junior Questions for "Who is God?" (sermon_id: 1)
  {
    id: 1,
    sermon_id: 1,
    question_text: "Who created everything in the universe?",
    options: ["God", "Aliens", "Nature by itself", "Scientists"],
    correct_answer: "God",
    age_bracket: "junior",
    created_at: "2024-01-15"
  },
  {
    id: 2,
    sermon_id: 1,
    question_text: "How many persons are in the Trinity?",
    options: ["One", "Two", "Three", "Four"],
    correct_answer: "Three",
    age_bracket: "junior",
    created_at: "2024-01-15"
  },
  {
    id: 3,
    sermon_id: 1,
    question_text: "What does 'eternal' mean?",
    options: ["Very old", "Has no beginning and no end", "Lives a long time", "Never sleeps"],
    correct_answer: "Has no beginning and no end",
    age_bracket: "junior",
    created_at: "2024-01-15"
  },
  {
    id: 4,
    sermon_id: 1,
    question_text: "The Bible says 'God is _____' (1 John 4:8)",
    options: ["Powerful", "Love", "Angry", "Far away"],
    correct_answer: "Love",
    age_bracket: "junior",
    created_at: "2024-01-15"
  },
  {
    id: 5,
    sermon_id: 1,
    question_text: "How can we know God is real if we can't see Him?",
    options: ["We can't know", "Through creation, the Bible, and Jesus", "Only through feelings", "Through science only"],
    correct_answer: "Through creation, the Bible, and Jesus",
    age_bracket: "junior",
    created_at: "2024-01-15"
  },

  // Junior Questions for "Jesus Loves Me" (sermon_id: 2)
  {
    id: 6,
    sermon_id: 2,
    question_text: "What did Jesus say about children in Matthew 19:14?",
    options: ["Stay away from me", "Let the little children come to me", "Children are too noisy", "Wait until you're older"],
    correct_answer: "Let the little children come to me",
    age_bracket: "junior",
    created_at: "2024-01-20"
  },
  {
    id: 7,
    sermon_id: 2,
    question_text: "What did Jesus do to show His love for us?",
    options: ["Gave us toys", "Died on the cross for our sins", "Wrote us letters", "Made us kings"],
    correct_answer: "Died on the cross for our sins",
    age_bracket: "junior",
    created_at: "2024-01-20"
  },
  {
    id: 8,
    sermon_id: 2,
    question_text: "How many days after His death did Jesus rise again?",
    options: ["One", "Two", "Three", "Seven"],
    correct_answer: "Three",
    age_bracket: "junior",
    created_at: "2024-01-20"
  },
  {
    id: 9,
    sermon_id: 2,
    question_text: "How can we talk to Jesus anytime?",
    options: ["Phone call", "Text message", "Prayer", "Email"],
    correct_answer: "Prayer",
    age_bracket: "junior",
    created_at: "2024-01-20"
  },
  {
    id: 10,
    sermon_id: 2,
    question_text: "What does Jesus promise in Hebrews 13:5?",
    options: ["To give us everything we want", "To never leave us", "To make us rich", "To make us famous"],
    correct_answer: "To never leave us",
    age_bracket: "junior",
    created_at: "2024-01-20"
  },

  // Junior Questions for "The Bible: God's Special Book" (sermon_id: 3)
  {
    id: 11,
    sermon_id: 3,
    question_text: "How many books are in the Bible?",
    options: ["50", "66", "100", "39"],
    correct_answer: "66",
    age_bracket: "junior",
    created_at: "2024-01-25"
  },
  {
    id: 12,
    sermon_id: 3,
    question_text: "How many books are in the Old Testament?",
    options: ["27", "39", "66", "10"],
    correct_answer: "39",
    age_bracket: "junior",
    created_at: "2024-01-25"
  },
  {
    id: 13,
    sermon_id: 3,
    question_text: "What does Psalm 119:105 say God's Word is?",
    options: ["A sword", "A lamp to my feet and a light to my path", "A shield", "A crown"],
    correct_answer: "A lamp to my feet and a light to my path",
    age_bracket: "junior",
    created_at: "2024-01-25"
  },
  {
    id: 14,
    sermon_id: 3,
    question_text: "Where should we hide God's Word? (Psalm 119:11)",
    options: ["Under our bed", "In our hearts", "In a safe", "On a shelf"],
    correct_answer: "In our hearts",
    age_bracket: "junior",
    created_at: "2024-01-25"
  },

  // Junior Questions for "Prayer: Talking with God" (sermon_id: 4)
  {
    id: 15,
    sermon_id: 4,
    question_text: "What is prayer?",
    options: ["Talking to God", "Making wishes", "Meditation", "Singing songs"],
    correct_answer: "Talking to God",
    age_bracket: "junior",
    created_at: "2024-02-01"
  },
  {
    id: 16,
    sermon_id: 4,
    question_text: "What does the 'A' in ACTS prayer stand for?",
    options: ["Asking", "Adoration", "Answer", "Always"],
    correct_answer: "Adoration",
    age_bracket: "junior",
    created_at: "2024-02-01"
  },
  {
    id: 17,
    sermon_id: 4,
    question_text: "What does the 'C' in ACTS prayer stand for?",
    options: ["Confession", "Calling", "Coming", "Caring"],
    correct_answer: "Confession",
    age_bracket: "junior",
    created_at: "2024-02-01"
  },
  {
    id: 18,
    sermon_id: 4,
    question_text: "Does God always answer prayers?",
    options: ["No, He ignores most", "Yes - sometimes yes, sometimes no, sometimes wait", "Only if we're good", "Only for adults"],
    correct_answer: "Yes - sometimes yes, sometimes no, sometimes wait",
    age_bracket: "junior",
    created_at: "2024-02-01"
  },

  // Senior Questions for "The Trinity" (sermon_id: 5)
  {
    id: 19,
    sermon_id: 5,
    question_text: "The Trinity teaches that God is:",
    options: ["Three gods", "One God in three persons", "One person with three names", "A hierarchy of divine beings"],
    correct_answer: "One God in three persons",
    age_bracket: "senior",
    created_at: "2024-01-10"
  },
  {
    id: 20,
    sermon_id: 5,
    question_text: "Which person of the Trinity planned salvation?",
    options: ["The Father", "The Son", "The Holy Spirit", "All equally"],
    correct_answer: "The Father",
    age_bracket: "senior",
    created_at: "2024-01-10"
  },
  {
    id: 21,
    sermon_id: 5,
    question_text: "Which person of the Trinity accomplished salvation?",
    options: ["The Father", "The Son", "The Holy Spirit", "All equally"],
    correct_answer: "The Son",
    age_bracket: "senior",
    created_at: "2024-01-10"
  },
  {
    id: 22,
    sermon_id: 5,
    question_text: "Which person of the Trinity applies salvation to believers?",
    options: ["The Father", "The Son", "The Holy Spirit", "All equally"],
    correct_answer: "The Holy Spirit",
    age_bracket: "senior",
    created_at: "2024-01-10"
  },
  {
    id: 23,
    sermon_id: 5,
    question_text: "The doctrine of the Trinity means each person is:",
    options: ["Partially God", "Fully God", "A different god", "Less than God"],
    correct_answer: "Fully God",
    age_bracket: "senior",
    created_at: "2024-01-10"
  },

  // Senior Questions for "Apologetics" (sermon_id: 6)
  {
    id: 24,
    sermon_id: 6,
    question_text: "What does 'apologetics' mean?",
    options: ["Saying sorry", "A reasoned defense of the faith", "Apologizing for Christianity", "Debating"],
    correct_answer: "A reasoned defense of the faith",
    age_bracket: "senior",
    created_at: "2024-01-18"
  },
  {
    id: 25,
    sermon_id: 6,
    question_text: "Which Bible verse commands us to be ready to give a defense?",
    options: ["John 3:16", "1 Peter 3:15", "Romans 8:28", "Philippians 4:13"],
    correct_answer: "1 Peter 3:15",
    age_bracket: "senior",
    created_at: "2024-01-18"
  },
  {
    id: 26,
    sermon_id: 6,
    question_text: "The cosmological argument argues for God's existence based on:",
    options: ["The design in nature", "The beginning of the universe", "Moral law", "Religious experience"],
    correct_answer: "The beginning of the universe",
    age_bracket: "senior",
    created_at: "2024-01-18"
  },
  {
    id: 27,
    sermon_id: 6,
    question_text: "The teleological argument argues for God's existence based on:",
    options: ["The beginning of the universe", "The design in nature", "Moral law", "Religious experience"],
    correct_answer: "The design in nature",
    age_bracket: "senior",
    created_at: "2024-01-18"
  },

  // Senior Questions for "Biblical Worldview" (sermon_id: 7)
  {
    id: 28,
    sermon_id: 7,
    question_text: "A worldview is:",
    options: ["A view of the world from space", "The lens through which we interpret reality", "A map of the world", "A philosophy class"],
    correct_answer: "The lens through which we interpret reality",
    age_bracket: "senior",
    created_at: "2024-01-22"
  },
  {
    id: 29,
    sermon_id: 7,
    question_text: "Which is NOT one of life's big questions a worldview answers?",
    options: ["Origin", "Meaning", "Morality", "Money"],
    correct_answer: "Money",
    age_bracket: "senior",
    created_at: "2024-01-22"
  },
  {
    id: 30,
    sermon_id: 7,
    question_text: "Naturalism teaches:",
    options: ["Nature is god", "Only the physical world exists", "All paths lead to God", "Truth is relative"],
    correct_answer: "Only the physical world exists",
    age_bracket: "senior",
    created_at: "2024-01-22"
  },
  {
    id: 31,
    sermon_id: 7,
    question_text: "Romans 12:2 tells us to:",
    options: ["Conform to the world", "Be transformed by renewing our minds", "Ignore the world", "Love the world"],
    correct_answer: "Be transformed by renewing our minds",
    age_bracket: "senior",
    created_at: "2024-01-22"
  },

  // Senior Questions for "Spiritual Disciplines" (sermon_id: 8)
  {
    id: 32,
    sermon_id: 8,
    question_text: "Spiritual disciplines are:",
    options: ["Ways to earn God's favor", "Practices that position us to receive God's grace", "Rules for Christians", "Optional hobbies"],
    correct_answer: "Practices that position us to receive God's grace",
    age_bracket: "senior",
    created_at: "2024-02-05"
  },
  {
    id: 33,
    sermon_id: 8,
    question_text: "Which is NOT a classic spiritual discipline?",
    options: ["Bible intake", "Prayer", "Fasting", "Entertainment"],
    correct_answer: "Entertainment",
    age_bracket: "senior",
    created_at: "2024-02-05"
  },
  {
    id: 34,
    sermon_id: 8,
    question_text: "1 Timothy 4:7 says to:",
    options: ["Train yourself for godliness", "Train others", "Train for a race", "Train your pets"],
    correct_answer: "Train yourself for godliness",
    age_bracket: "senior",
    created_at: "2024-02-05"
  },
  {
    id: 35,
    sermon_id: 8,
    question_text: "The goal of spiritual disciplines is:",
    options: ["To check boxes", "To impress others", "Knowing Jesus more intimately", "To earn salvation"],
    correct_answer: "Knowing Jesus more intimately",
    age_bracket: "senior",
    created_at: "2024-02-05"
  }
];
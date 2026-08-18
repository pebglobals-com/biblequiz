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
  { title: "Hannah's Prayer and Samuel's Birth", slug: toSlug("Hannah's Prayer and Samuel's Birth"), source_url: "https://example.com/hannah-and-samuel", content: "Once there was a man named Elkanah. He had two wives. One wife was named Hannah, and the other was named Peninnah. Peninnah had children, but Hannah had no children at all. Hannah wanted a baby more than anything in the world, and her heart was very sad. Every year, Elkanah and his family went to the town of Shiloh to worship God. Peninnah made Hannah feel bad. She teased Hannah and said mean things to her because Hannah had no children. This made Hannah cry, and she was so sad that she did not even want to eat. One day, Hannah went to the temple at Shiloh to pray. She was very, very sad, and she prayed to God with all her heart. She cried while she prayed and made a promise to God. She said, 'Lord, if You will give me a son, I will give him back to You. He will serve You all the days of his life.' Eli the priest saw Hannah praying. Her lips were moving, but no sound came out, so Eli thought she had been drinking wine. He said, 'How long will you stay drunk? Stop drinking wine!' But Hannah said, 'No, sir, I have not been drinking wine. I am just very sad. I have been pouring out my heart to the Lord.' Then Eli said to her, 'Go in peace. May the God of Israel give you what you have asked of Him.' Hannah was so happy! She was not sad anymore. She went home and ate her food. God remembered Hannah and heard her prayer. After some time, she had a baby boy! She named him Samuel, because she said, 'I asked the Lord for him.' Samuel means 'heard by God' - God had heard Hannah's prayer and given her a son.", excerpt: "Read the beautiful story of Hannah, a sad woman who prayed to God with all her heart and promised to give her son back to Him. God heard her prayer and gave her a baby boy named Samuel.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "Water Turned into Wine at Cana", slug: toSlug("Water Turned into Wine at Cana"), source_url: "https://example.com/water-into-wine", content: "Jesus, His mother Mary, and His disciples went to a wedding party in a town called Cana. It was a happy day, and many people came to celebrate the bride and the groom. But then something bad happened. The party ran out of wine! There was nothing left to serve the guests. This was very embarrassing for the people who planned the wedding. Mary saw the problem and went to Jesus. She said to Him, 'They have no more wine.' Jesus did not want everyone to be embarrassed. He told the servants, 'Fill the big stone jars with water.' There were six big stone jars, and the servants filled them all the way to the top with water. Then Jesus said, 'Now dip some out, and take it to the man in charge of the feast.' The servants did what Jesus said. When the man in charge tasted what was in the cup, it was not water anymore - it had become wine! And it was very good wine - even better than the wine they had before! The man in charge did not know where the wine came from, but the servants knew. Jesus had turned the water into wine. This was the first miracle Jesus did. It showed His glory, and His disciples believed in Him. Jesus can do amazing things - He cares about people's problems, and He can turn what seems impossible into something wonderful.", excerpt: "Read about Jesus' first miracle! When a wedding party ran out of wine, Jesus turned water into wine - showing His power and His care for people.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "Jairus' Daughter & the Woman with Issue of Blood", slug: toSlug("Jairus' Daughter & the Woman with Issue of Blood"), source_url: "https://example.com/jairus-daughter", content: "A man named Jairus was a leader in the synagogue. He came to Jesus and fell at His feet. He begged Jesus, 'My little daughter is very sick and dying. Please come and lay Your hands on her, so she can be healed and live!' Jesus went with Jairus, and a big crowd followed Him, pressing close on every side. In the crowd there was a woman who had been sick for twelve years. She had a problem with bleeding that would not stop. She had spent all her money on doctors, but no one could make her well. She was very sad and very tired. But she had heard about Jesus, and she believed. She thought, 'If I can only touch His clothes, I will be healed.' So she came up behind Jesus in the crowd and touched the edge of His coat. At that very moment, the bleeding stopped, and she felt well again - completely healed! Jesus felt that power had gone out of Him. He turned around and asked, 'Who touched My clothes?' The woman was afraid, but she came and knelt before Jesus and told Him the whole truth - that she had touched Him and was healed. Jesus said to her, 'Daughter, your faith has made you well. Go in peace. You are healed!' While Jesus was still speaking, some people came from Jairus' house and said, 'Your daughter is dead. Why bother the Teacher anymore?' But Jesus heard them and said to Jairus, 'Do not be afraid. Just believe.' Jesus went to the house with Peter, James, and John. People were crying and making a lot of noise. Jesus said, 'Why are you crying? The child is not dead - she is sleeping.' The people laughed at Him. Jesus took the little girl by the hand and said, 'Little girl, get up!' At once, the girl got up and walked around! She was completely alive and well. Everyone was amazed. Then Jesus told them to give her something to eat. Jesus is powerful over sickness and even over death. He healed the woman who believed, and He brought Jairus' daughter back to life. When we believe in Jesus, He can do what seems impossible!", excerpt: "Two amazing healings in one story! A sick woman touched Jesus' clothes and was healed, and Jesus brought Jairus' little daughter back to life.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "Healing of the Ten Lepers", slug: toSlug("Healing of the Ten Lepers"), source_url: "https://example.com/ten-lepers", content: "One day, Jesus was traveling through a village. Ten men came to meet Him, but they stood far away and did not come close. These men had a terrible skin disease called leprosy. In those days, people with leprosy had to stay away from other people so the sickness would not spread. They were lonely, and they felt sad and left out. When they saw Jesus, they shouted with loud voices, 'Jesus, Master, have mercy on us!' Jesus saw them and said, 'Go and show yourselves to the priests.' The men obeyed Jesus and started walking to the priests. And as they went, something wonderful happened - they were healed! The leprosy disappeared from their skin, and they were completely well! All ten men were healed. But then something surprising happened. Only one of them came back to Jesus. He was shouting and praising God with a loud voice. He fell at Jesus' feet and thanked Him again and again. This man was a Samaritan, and the other nine were from a different place. Jesus said, 'Were not all ten healed? Where are the other nine? Did no one come back to give praise to God except this one man?' Then Jesus said to the man, 'Get up and go. Your faith has made you well.' Jesus healed all ten men, but only one remembered to say thank you. God loves it when we thank Him for the good things He does for us. Let us always remember to say thank you to Jesus!", excerpt: "Jesus healed ten men with leprosy, but only one came back to say thank you. Learn the importance of being thankful to God.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "The Good Samaritan", slug: toSlug("The Good Samaritan"), source_url: "https://example.com/good-samaritan", content: "One day, a man who knew the law asked Jesus a question. He asked, 'Who is my neighbor?' Jesus answered him with a story. He said: A man was traveling on the road from Jerusalem to Jericho. On the way, robbers attacked him. They beat him, took his clothes and his money, and left him lying on the road, half dead. Soon, a priest came walking down that same road. He saw the hurt man lying there, but he crossed to the other side and kept going. He did not help him. Then a Levite came. He also saw the hurt man, but he crossed to the other side too, and kept going. He did not help him either. Then a Samaritan man came by. In those days, the Jews and the Samaritans did not like each other at all. But when the Samaritan saw the hurt man, he felt very sorry for him. He went over to him and cleaned his wounds with oil and wine, and tied them up with cloth. Then he put the man on his own donkey and took him to an inn, where he took care of him. The next day, the Samaritan gave money to the innkeeper and said, 'Take care of him. If you spend more than this, I will pay you back when I return.' Then Jesus asked the man who knew the law, 'Which of these three men do you think was a neighbor to the man who was hurt?' The man answered, 'The one who showed him mercy.' Jesus said to him, 'Go and do the same.' Jesus wants us to help people who need us - even people we do not know, and even people who are different from us. A real neighbor is someone who shows love and kindness to others.", excerpt: "Who is my neighbor? Jesus told the story of a man who was robbed and hurt, and the one person who stopped to help him - the Good Samaritan.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "The Unforgiving Servant", slug: toSlug("The Unforgiving Servant"), source_url: "https://example.com/unforgiving-servant", content: "One day, Peter came to Jesus and asked Him, 'Lord, how many times should I forgive my brother when he does something wrong to me? Up to seven times?' Jesus said to him, 'Not seven times, but seventy times seven!' That means we should forgive again and again, as many times as needed. Then Jesus told this story: A king wanted to check the accounts of his servants. One servant was brought to him who owed him a huge amount of money - so much that he could never pay it back. The servant could not pay, so the king said he must be sold, along with his wife and children and everything he had. But the servant fell on his knees and begged, 'Please be patient with me, and I will pay you back everything!' The king felt sorry for him, so he let him go. Not only that - he forgave him the whole debt and did not make him pay anything at all! But then that same servant went out and found a fellow servant who owed him just a little bit of money. He grabbed him by the neck and said, 'Pay me what you owe me!' His fellow servant fell at his feet and begged, 'Please be patient with me, and I will pay you back.' But the servant refused. He had the man thrown into prison until he could pay the little debt. When the other servants saw what he did, they were very upset. They went and told the king everything. The king called the servant in and said, 'You wicked servant! I forgave you that whole big debt because you begged me. Shouldn't you have had mercy on your fellow servant, just like I had mercy on you?' The king was so angry that he handed the servant over to be punished until he paid back everything. Jesus said, 'This is how My Father in heaven will treat you, if you do not forgive your brother from your heart.' God has forgiven us so much. Because God forgives us, we should forgive other people too - from our hearts, and as many times as they need.", excerpt: "Jesus taught about forgiveness with a story about a king who forgave a huge debt, and a servant who would not forgive a small one. God forgives us, so we must forgive others.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "The Story of Gideon", slug: toSlug("The Story of Gideon"), source_url: "https://example.com/story-of-gideon", content: "Long ago, the people of Israel did not obey God, so He allowed their enemies, the Midianites, to trouble them. The Midianites came and destroyed their crops and stole their animals. The Israelites were very afraid and hid in caves and dens. One day, a man named Gideon was hiding, beating out wheat in a winepress so the Midianites would not see him. Suddenly, the angel of the Lord appeared to him and said, 'The Lord is with you, mighty warrior!' Gideon was surprised. He felt small and weak, but God chose him to save Israel from the Midianites. First, Gideon obeyed God and tore down the altar of the false god Baal that his father had built, and built an altar to the Lord instead. Then Gideon gathered a big army of thirty-two thousand men to fight the Midianites. But God said, 'You have too many men. If you win with so many, Israel will say they saved themselves.' So God told Gideon to send home everyone who was afraid. Twenty-two thousand men went home, and ten thousand stayed. God said, 'There are still too many.' He tested the men at the water. Only three hundred men stayed ready and watchful. God said, 'With these three hundred men, I will save Israel.' That night, Gideon gave each of the three hundred men a trumpet, an empty jar, and a torch hidden inside the jar. They went down to the camp of the Midianites and surrounded it. At Gideon's signal, they all blew their trumpets, smashed their jars, held up their torches, and shouted, 'A sword for the Lord and for Gideon!' The Midianites were terrified! In the darkness and confusion, they were so afraid that they turned and fought each other, and then they ran away. God saved Israel with just three hundred men - so everyone knew it was God who did it, not their own strength. God can use small and weak people to do great things, when they trust and obey Him.", excerpt: "God chose Gideon, a man who felt small and weak, and used just 300 men to defeat a huge army - so everyone would know that God saves by His own power.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "The Story of Samson", slug: toSlug("The Story of Samson"), source_url: "https://example.com/story-of-samson", content: "Many years ago, the people of Israel did not obey God, so He let their enemies, the Philistines, rule over them. But God did not forget His people. An angel came to a woman and her husband, Manoah, and told them, 'You will have a son. He will be special to God. Never cut his hair, and he will begin to save Israel from the Philistines.' So Samson was born, and God gave him very great strength. With that strength, Samson did amazing things and fought the Philistines, who were troubling Israel. But Samson had a weakness - he did not always obey God, and he loved a woman named Delilah, who lived with the Philistines. The Philistine rulers came to Delilah and said, 'Find out the secret of Samson's great strength, and we will give you a lot of money.' So Delilah kept asking Samson, 'Please tell me the secret of your strength.' Three times, Samson gave her a false answer, and each time she found out he had tricked her. She kept nagging him until he finally told her the truth: 'I am a Nazirite, set apart for God. My hair has never been cut. If my hair is cut, my strength will leave me.' While Samson was sleeping on her knees, Delilah had his hair cut off. And his strength left him. The Philistines came and caught him. They put out his eyes and took him to prison, where they made him grind grain like a donkey. But slowly, Samson's hair began to grow back. One day, the Philistines held a big feast to their god, and they brought Samson out to make fun of him. The temple was full of people, and the rulers were all there. Samson prayed to the Lord, 'O Lord God, please remember me and give me strength just one more time.' Then he pushed with all his might against the two big pillars that held up the temple. The whole building fell down on the Philistine rulers and all the people in it. God used Samson, even though he was not perfect, to save Israel from the Philistines. It reminds us that God can use us for His plans, but we should always obey Him - because following God's way keeps us strong.", excerpt: "Samson was the strongest man in Israel, but he lost his strength when he disobeyed God. Read how God still used him to save His people.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "The Story of Esther", slug: toSlug("The Story of Esther"), source_url: "https://example.com/story-of-esther", content: "Many years ago, the people of Israel lived in a big country called Persia. The king of Persia was named King Xerxes, and he ruled from a beautiful palace in the city of Susa. The king chose a new queen, and he picked a young Jewish woman named Esther. Esther was beautiful and kind, and the king loved her very much. But Esther had a secret - no one knew she was one of God's people, because her cousin Mordecai told her not to tell anyone. Now there was a wicked man named Haman who worked for the king. Haman was very proud, and he hated Mordecai because Mordecai would not bow down to him. Haman was so angry that he planned to destroy not just Mordecai, but all the Jewish people in the whole kingdom! Haman tricked the king into signing a law that said all the Jewish people would be destroyed on a certain day. When Mordecai heard this terrible news, he was very sad. He sent a message to Queen Esther: 'You must go to the king and ask him to save our people!' But Esther was afraid. There was a rule that no one could go to the king without being called - if anyone did, they could be put to death. Esther had not been called to the king for thirty days. Mordecai sent back a message: 'Who knows? Maybe you became queen for this very time - to save your people.' Esther decided to be brave. She said, 'Go and gather all the Jewish people and pray for me. I will go to the king, even if it means I die.' So Esther went to the king, and the king was happy to see her! He held out his golden scepter to her, which meant she was welcome. He asked her, 'What do you want, Queen Esther? I will give you anything, even half of my kingdom.' Esther asked the king to come to a special dinner she had made, and she invited Haman too. At the dinner, the king asked again what she wanted. Esther said, 'Please come to another dinner tomorrow, and I will tell you.' Haman was very happy, but on his way home he saw Mordecai, who still would not bow to him. Haman was so angry that he built a tall pole, planning to hang Mordecai on it the next day. But that night, the king could not sleep. He asked for the royal records to be read to him, and he found out that Mordecai had once saved the king's life from two men who planned to kill him. The king discovered that Mordecai was never rewarded! So the king gave honor to Mordecai, and Haman was the one who had to lead Mordecai through the city on the king's horse. At the second dinner, the king asked Esther again what she wanted. This time, Esther bravely told the truth: 'A wicked man named Haman has planned to destroy me and my people - all the Jewish people in the kingdom!' The king was very angry at Haman, and Haman was punished for his wicked plan. The king gave Mordecai a high position, and the Jewish people were saved! God was watching over Esther and her people the whole time. He put Esther in the palace 'for such a time as this,' so she could be brave and save them. God can use anyone - even a young queen - to do amazing things for His people.", excerpt: "Queen Esther risked her life to save her people from a wicked man's plan. Learn how God used a brave young queen 'for such a time as this.'", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "The Story of Samuel the Prophet", slug: toSlug("The Story of Samuel the Prophet"), source_url: "https://example.com/story-of-samuel", content: "Samuel was a very special boy. His mother Hannah prayed with all her heart for a son, and she promised God that if He gave her a baby boy, she would give him back to God. God heard her prayer and gave her Samuel, which means 'heard by God.' When Samuel was still a little boy, Hannah took him to the temple at Shiloh to serve God, just like she promised. Samuel grew up in the temple, helping the old priest Eli. One night, Samuel was lying in the temple when he heard a voice call out, 'Samuel! Samuel!' Samuel ran to Eli and said, 'Here I am! You called me?' But Eli said, 'I did not call you. Go back and lie down.' This happened two more times. Then Eli understood. He told Samuel, 'Go and lie down. If the voice calls you again, say, \"Speak, Lord, for Your servant is listening.\"' So Samuel lay down again, and the Lord called, 'Samuel! Samuel!' Samuel answered, 'Speak, Lord, for Your servant is listening.' That night, God spoke to Samuel for the first time, and Samuel listened carefully. Samuel grew up, and the Lord was with him. God made Samuel a great prophet - a man who spoke God's messages to the people. Samuel listened to God and led the people of Israel for many years. One day, the people of Israel asked Samuel to give them a king, like the other nations had. God told Samuel to listen to them, and Samuel anointed a tall, handsome man named Saul to be the first king of Israel. But King Saul did not obey God, and God was sorry He had made him king. So God sent Samuel to anoint a new king - a young shepherd boy named David, the son of Jesse. Samuel poured oil on David's head, and the Spirit of the Lord came upon David from that day on. Samuel served God faithfully all his life. He listened to God's voice, he obeyed God, and he told people what God said. Samuel teaches us that listening to God and obeying Him is the best way to live.", excerpt: "Read about Samuel - the boy who heard God's voice in the night, grew up to be a great prophet, and anointed kings like Saul and David.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "The Story of King Saul", slug: toSlug("The Story of King Saul"), source_url: "https://example.com/story-of-king-saul", content: "Many years ago, the people of Israel wanted a king, just like the other nations had. So God told the prophet Samuel to choose a man to be the first king of Israel. The man God chose was named Saul. Saul was a tall, handsome young man - he stood taller than everyone else in Israel! When Samuel anointed him with oil and told him he would be king, Saul was surprised. 'Am I not from the smallest family in Israel?' he asked. But God had chosen him. At first, Saul was a good king. He was humble, and he obeyed God. God helped him win battles against Israel's enemies, and the people were happy. But after a while, Saul began to change. He started to do things his own way instead of obeying God. One time, God sent Saul to fight the Amalekites and told him to destroy everything - the animals too. But Saul saved the best animals for himself and did not obey God completely. When Samuel came, Saul said, 'I did obey the Lord!' But Samuel asked, 'Then why do I hear the sound of animals?' Saul made excuses, but Samuel said to him, 'To obey is better than to sacrifice. Because you have turned away from God's word, God has turned away from you as king.' God was sorry He had made Saul king, because Saul did not obey Him. Saul became jealous and angry too. David, a young shepherd boy, had won a great victory over the giant Goliath, and the people sang, 'Saul has killed his thousands, and David his tens of thousands!' Saul was so jealous that he tried to hurt David and chased him for years. Saul kept going his own way instead of listening to God. God even stopped answering him, because Saul would not obey. In the end, Saul fought a big battle against the Philistines. His sons were killed, and Saul was badly hurt. He died in that battle, and his sons died with him. King Saul's story teaches us an important lesson: God wants us to obey Him and trust Him completely. Being tall and strong is not enough - the most important thing is to love and obey God with all our hearts.", excerpt: "Saul was chosen by God to be Israel's first king, but he stopped obeying God and lost everything. Learn why obeying God matters most.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "The Story of David", slug: toSlug("The Story of David"), source_url: "https://example.com/story-of-david", content: "Long ago, God chose a young shepherd boy named David to be the next king of Israel. David was the youngest son of Jesse, and while his brothers were big and strong, David was just a boy who took care of sheep. But God told the prophet Samuel, 'People look at the outside, but the Lord looks at the heart.' God chose David because David loved God with all his heart. While David was watching his sheep, he learned to trust God. When a lion or a bear came to steal a sheep, David fought them off with his own hands. He said, 'The Lord who saved me from the lion and the bear will save me too.' Then came the day of the giant. The Philistine army had a giant warrior named Goliath, who was nine feet tall! He laughed at Israel's army and made fun of God's people every day, and everyone was afraid - even the king. But David was not afraid. He said, 'The battle is the Lord's!' He picked five smooth stones from the stream, took his sling, and ran to meet the giant. With one stone, David hit Goliath right in the forehead, and the giant fell down! God gave David a great victory that day. The people loved David, but King Saul became jealous of him and tried to kill him many times. David had to run and hide in caves, but he never stopped trusting God. Even when he had the chance to hurt Saul, he said, 'I will not touch the man God chose as king.' After Saul died, David became king. He was called a man after God's own heart. He won battles, brought the ark of God back to Jerusalem, and wrote many beautiful songs to God, called psalms. But David was not perfect. One time, he did a very bad thing - he sinned against God. When the prophet Nathan told him the truth, David was very sorry and asked God to forgive him. God forgave David, and David wrote, 'Create in me a clean heart, O God.' David's story teaches us that God looks at our hearts, not just our looks or our strength. When we trust God and obey Him, He is with us - and when we make mistakes, God forgives us when we say sorry.", excerpt: "From shepherd boy to king! Read how David trusted God, defeated the giant Goliath, and became a man after God's own heart.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "The Wisdom of King Solomon", slug: toSlug("The Wisdom of King Solomon"), source_url: "https://example.com/wisdom-of-solomon", content: "After King David died, his son Solomon became the king of Israel. Solomon was still young, and he wanted to be a good king for God's people. One night, God appeared to Solomon in a dream and said, 'Ask Me for anything you want, and I will give it to you.' What do you think Solomon asked for? He did not ask for money. He did not ask for a long life, or for his enemies to be defeated. Instead, Solomon said, 'Lord, I am just a young boy. Please give me wisdom, so I can lead Your people well and know the difference between good and bad.' God was very pleased with Solomon's answer. God said, 'Because you asked for wisdom instead of riches or a long life, I will give you wisdom - more wisdom than anyone before you or after you. And because you asked so well, I will also give you riches and honor!' And God kept His promise. Solomon became the wisest man in the whole world. Kings and queens from faraway countries came to hear his wise words. One day, two women came to King Solomon with a sad problem. They both lived in the same house, and they both had baby boys. But one night, one baby died, and now each woman was saying, 'The living baby is mine!' Nobody could tell who was telling the truth. But Solomon was very wise. He said, 'Bring me a sword. Cut the living baby in two, and give half to each woman.' The real mother cried out, 'No, please! Give the baby to her - just do not kill the baby!' But the other woman said, 'Fine, cut him in two.' Then everyone knew who the real mother was - the woman who loved the baby enough to give him up. Solomon gave the baby back to his true mother, and all of Israel was amazed at the wisdom God had given him. Solomon also asked God to help him build a beautiful temple for God in Jerusalem, and God did. God gave Solomon so much wisdom that he wrote many wise sayings in the book of Proverbs, which is still in the Bible today. Solomon teaches us an important lesson: wisdom is better than gold. When we ask God for wisdom and for help to do the right thing, God is pleased - and He gives generously.", excerpt: "When God told Solomon to ask for anything, he asked for wisdom. Read how God gave him wisdom to judge wisely and build the temple.", age_bracket: "junior" as const, category: "Bible Stories" },
  { title: "The Feast of Tabernacles", slug: toSlug("The Feast of Tabernacles"), source_url: "https://example.com/feast-of-tabernacles", content: "Long ago, God told His people Israel to celebrate a special feast every year called the Feast of Tabernacles. It is also called the Feast of Booths or the Feast of Shelters. God said, 'For seven days, you must live in little shelters made of branches, called tabernacles or booths. This will remind you that I brought your fathers out of Egypt and took care of them in the desert for forty years.' You see, long ago, God's people lived in Egypt as slaves. God rescued them with His mighty power and led them through the desert to the Promised Land. For forty years, they did not have houses to live in - they stayed in tents and little shelters, and God took care of them every single day. God gave them food to eat - bread from heaven called manna. He gave them water to drink, even in the hot desert. Their clothes did not wear out, and God never left them. So every year, at harvest time, the people of Israel built little booths out of branches and leaves, and they lived in them for seven days. They were happy and thankful, remembering how God took care of their fathers in the desert. They also thanked God for the harvest and the good food He gave them. Jesus Himself went to Jerusalem for the Feast of Tabernacles. On the last and greatest day of the feast, Jesus stood up and said, 'If anyone is thirsty, let him come to Me and drink. Whoever believes in Me, rivers of living water will flow from his heart!' Jesus was telling everyone that He is the One who fills our hearts - just like God filled His people with water in the desert. The Feast of Tabernacles teaches us to remember and thank God for the way He takes care of us - in good times and hard times. God fed His people in the desert, and He will take care of us too.", excerpt: "God told Israel to celebrate the Feast of Tabernacles by living in shelters of branches - remembering how He cared for them in the desert.", age_bracket: "junior" as const, category: "Bible Stories" },
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

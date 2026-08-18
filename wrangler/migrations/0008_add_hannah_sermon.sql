-- Migration 0008: Add Hannah's Prayer and Samuel's Birth sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'Hannah''s Prayer and Samuel''s Birth',
  'hannahs-prayer-and-samuels-birth',
  'https://example.com/hannah-and-samuel',
  'Once there was a man named Elkanah. He had two wives. One wife was named Hannah, and the other was named Peninnah. Peninnah had children, but Hannah had no children at all. Hannah wanted a baby more than anything in the world, and her heart was very sad.

Every year, Elkanah and his family went to the town of Shiloh to worship God. Peninnah made Hannah feel bad. She teased Hannah and said mean things to her because Hannah had no children. This made Hannah cry, and she was so sad that she did not even want to eat.

One day, Hannah went to the temple at Shiloh to pray. She was very, very sad, and she prayed to God with all her heart. She cried while she prayed and made a promise to God. She said, "Lord, if You will give me a son, I will give him back to You. He will serve You all the days of his life."

Eli the priest saw Hannah praying. Her lips were moving, but no sound came out, so Eli thought she had been drinking wine. He said, "How long will you stay drunk? Stop drinking wine!"

But Hannah said, "No, sir, I have not been drinking wine. I am just very sad. I have been pouring out my heart to the Lord."

Then Eli said to her, "Go in peace. May the God of Israel give you what you have asked of Him."

Hannah was so happy! She was not sad anymore. She went home and ate her food.

God remembered Hannah and heard her prayer. After some time, she had a baby boy! She named him Samuel, because she said, "I asked the Lord for him." Samuel means "heard by God" - God had heard Hannah''s prayer and given her a son.',
  'Read the beautiful story of Hannah, a sad woman who prayed to God with all her heart and promised to give her son back to Him. God heard her prayer and gave her a baby boy named Samuel.',
  'junior',
  'Bible Stories',
  datetime('now')
);
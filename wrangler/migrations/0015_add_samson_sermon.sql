-- Migration 0015: Add The Story of Samson sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'The Story of Samson',
  'the-story-of-samson',
  'https://example.com/story-of-samson',
  'Many years ago, the people of Israel did not obey God, so He let their enemies, the Philistines, rule over them. But God did not forget His people.

An angel came to a woman and her husband, Manoah, and told them, "You will have a son. He will be special to God. Never cut his hair, and he will begin to save Israel from the Philistines."

So Samson was born, and God gave him very great strength. With that strength, Samson did amazing things and fought the Philistines, who were troubling Israel.

But Samson had a weakness - he did not always obey God, and he loved a woman named Delilah, who lived with the Philistines.

The Philistine rulers came to Delilah and said, "Find out the secret of Samson''s great strength, and we will give you a lot of money."

So Delilah kept asking Samson, "Please tell me the secret of your strength." Three times, Samson gave her a false answer, and each time she found out he had tricked her.

She kept nagging him until he finally told her the truth: "I am a Nazirite, set apart for God. My hair has never been cut. If my hair is cut, my strength will leave me."

While Samson was sleeping on her knees, Delilah had his hair cut off. And his strength left him.

The Philistines came and caught him. They put out his eyes and took him to prison, where they made him grind grain like a donkey.

But slowly, Samson''s hair began to grow back.

One day, the Philistines held a big feast to their god, and they brought Samson out to make fun of him. The temple was full of people, and the rulers were all there.

Samson prayed to the Lord, "O Lord God, please remember me and give me strength just one more time."

Then he pushed with all his might against the two big pillars that held up the temple. The whole building fell down on the Philistine rulers and all the people in it.

God used Samson, even though he was not perfect, to save Israel from the Philistines.

It reminds us that God can use us for His plans, but we should always obey Him - because following God''s way keeps us strong.',
  'Samson was the strongest man in Israel, but he lost his strength when he disobeyed God. Read how God still used him to save His people.',
  'junior',
  'Bible Stories',
  datetime('now')
);
-- Migration 0014: Add The Story of Gideon sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'The Story of Gideon',
  'the-story-of-gideon',
  'https://example.com/story-of-gideon',
  'Long ago, the people of Israel did not obey God, so He allowed their enemies, the Midianites, to trouble them. The Midianites came and destroyed their crops and stole their animals. The Israelites were very afraid and hid in caves and dens.

One day, a man named Gideon was hiding, beating out wheat in a winepress so the Midianites would not see him. Suddenly, the angel of the Lord appeared to him and said, "The Lord is with you, mighty warrior!"

Gideon was surprised. He felt small and weak, but God chose him to save Israel from the Midianites.

First, Gideon obeyed God and tore down the altar of the false god Baal that his father had built, and built an altar to the Lord instead.

Then Gideon gathered a big army of thirty-two thousand men to fight the Midianites. But God said, "You have too many men. If you win with so many, Israel will say they saved themselves."

So God told Gideon to send home everyone who was afraid. Twenty-two thousand men went home, and ten thousand stayed.

God said, "There are still too many." He tested the men at the water. Only three hundred men stayed ready and watchful. God said, "With these three hundred men, I will save Israel."

That night, Gideon gave each of the three hundred men a trumpet, an empty jar, and a torch hidden inside the jar. They went down to the camp of the Midianites and surrounded it.

At Gideon''s signal, they all blew their trumpets, smashed their jars, held up their torches, and shouted, "A sword for the Lord and for Gideon!"

The Midianites were terrified! In the darkness and confusion, they were so afraid that they turned and fought each other, and then they ran away.

God saved Israel with just three hundred men - so everyone knew it was God who did it, not their own strength.

God can use small and weak people to do great things, when they trust and obey Him.',
  'God chose Gideon, a man who felt small and weak, and used just 300 men to defeat a huge army - so everyone would know that God saves by His own power.',
  'junior',
  'Bible Stories',
  datetime('now')
);
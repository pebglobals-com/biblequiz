-- Migration 0016: Add The Story of Esther sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'The Story of Esther',
  'the-story-of-esther',
  'https://example.com/story-of-esther',
  'Many years ago, the people of Israel lived in a big country called Persia. The king of Persia was named King Xerxes, and he ruled from a beautiful palace in the city of Susa.

The king chose a new queen, and he picked a young Jewish woman named Esther. Esther was beautiful and kind, and the king loved her very much. But Esther had a secret - no one knew she was one of God''s people, because her cousin Mordecai told her not to tell anyone.

Now there was a wicked man named Haman who worked for the king. Haman was very proud, and he hated Mordecai because Mordecai would not bow down to him. Haman was so angry that he planned to destroy not just Mordecai, but all the Jewish people in the whole kingdom!

Haman tricked the king into signing a law that said all the Jewish people would be destroyed on a certain day.

When Mordecai heard this terrible news, he was very sad. He sent a message to Queen Esther: "You must go to the king and ask him to save our people!"

But Esther was afraid. There was a rule that no one could go to the king without being called - if anyone did, they could be put to death. Esther had not been called to the king for thirty days.

Mordecai sent back a message: "Who knows? Maybe you became queen for this very time - to save your people."

Esther decided to be brave. She said, "Go and gather all the Jewish people and pray for me. I will go to the king, even if it means I die."

So Esther went to the king, and the king was happy to see her! He held out his golden scepter to her, which meant she was welcome. He asked her, "What do you want, Queen Esther? I will give you anything, even half of my kingdom."

Esther asked the king to come to a special dinner she had made, and she invited Haman too. At the dinner, the king asked again what she wanted. Esther said, "Please come to another dinner tomorrow, and I will tell you."

Haman was very happy, but on his way home he saw Mordecai, who still would not bow to him. Haman was so angry that he built a tall pole, planning to hang Mordecai on it the next day.

But that night, the king could not sleep. He asked for the royal records to be read to him, and he found out that Mordecai had once saved the king''s life from two men who planned to kill him. The king discovered that Mordecai was never rewarded!

So the king gave honor to Mordecai, and Haman was the one who had to lead Mordecai through the city on the king''s horse.

At the second dinner, the king asked Esther again what she wanted. This time, Esther bravely told the truth: "A wicked man named Haman has planned to destroy me and my people - all the Jewish people in the kingdom!"

The king was very angry at Haman, and Haman was punished for his wicked plan. The king gave Mordecai a high position, and the Jewish people were saved!

God was watching over Esther and her people the whole time. He put Esther in the palace "for such a time as this," so she could be brave and save them.

God can use anyone - even a young queen - to do amazing things for His people.',
  'Queen Esther risked her life to save her people from a wicked man''s plan. Learn how God used a brave young queen "for such a time as this."',
  'junior',
  'Bible Stories',
  datetime('now')
);
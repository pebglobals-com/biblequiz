-- Migration 0017: Add The Story of Samuel the Prophet sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'The Story of Samuel the Prophet',
  'the-story-of-samuel-the-prophet',
  'https://example.com/story-of-samuel',
  'Samuel was a very special boy. His mother Hannah prayed with all her heart for a son, and she promised God that if He gave her a baby boy, she would give him back to God. God heard her prayer and gave her Samuel, which means "heard by God."

When Samuel was still a little boy, Hannah took him to the temple at Shiloh to serve God, just like she promised.

Samuel grew up in the temple, helping the old priest Eli.

One night, Samuel was lying in the temple when he heard a voice call out, "Samuel! Samuel!" Samuel ran to Eli and said, "Here I am! You called me?" But Eli said, "I did not call you. Go back and lie down."

This happened two more times. Then Eli understood. He told Samuel, "Go and lie down. If the voice calls you again, say, ''Speak, Lord, for Your servant is listening.''"

So Samuel lay down again, and the Lord called, "Samuel! Samuel!" Samuel answered, "Speak, Lord, for Your servant is listening."

That night, God spoke to Samuel for the first time, and Samuel listened carefully.

Samuel grew up, and the Lord was with him. God made Samuel a great prophet - a man who spoke God''s messages to the people. Samuel listened to God and led the people of Israel for many years.

One day, the people of Israel asked Samuel to give them a king, like the other nations had. God told Samuel to listen to them, and Samuel anointed a tall, handsome man named Saul to be the first king of Israel.

But King Saul did not obey God, and God was sorry He had made him king. So God sent Samuel to anoint a new king - a young shepherd boy named David, the son of Jesse. Samuel poured oil on David''s head, and the Spirit of the Lord came upon David from that day on.

Samuel served God faithfully all his life. He listened to God''s voice, he obeyed God, and he told people what God said.

Samuel teaches us that listening to God and obeying Him is the best way to live.',
  'Read about Samuel - the boy who heard God''s voice in the night, grew up to be a great prophet, and anointed kings like Saul and David.',
  'junior',
  'Bible Stories',
  datetime('now')
);
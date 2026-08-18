-- Migration 0018: Add The Story of King Saul sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'The Story of King Saul',
  'the-story-of-king-saul',
  'https://example.com/story-of-king-saul',
  'Many years ago, the people of Israel wanted a king, just like the other nations had. So God told the prophet Samuel to choose a man to be the first king of Israel.

The man God chose was named Saul. Saul was a tall, handsome young man - he stood taller than everyone else in Israel! When Samuel anointed him with oil and told him he would be king, Saul was surprised. "Am I not from the smallest family in Israel?" he asked. But God had chosen him.

At first, Saul was a good king. He was humble, and he obeyed God. God helped him win battles against Israel''s enemies, and the people were happy.

But after a while, Saul began to change. He started to do things his own way instead of obeying God.

One time, God sent Saul to fight the Amalekites and told him to destroy everything - the animals too. But Saul saved the best animals for himself and did not obey God completely.

When Samuel came, Saul said, "I did obey the Lord!" But Samuel asked, "Then why do I hear the sound of animals?"

Saul made excuses, but Samuel said to him, "To obey is better than to sacrifice. Because you have turned away from God''s word, God has turned away from you as king."

God was sorry He had made Saul king, because Saul did not obey Him.

Saul became jealous and angry too. David, a young shepherd boy, had won a great victory over the giant Goliath, and the people sang, "Saul has killed his thousands, and David his tens of thousands!" Saul was so jealous that he tried to hurt David and chased him for years.

Saul kept going his own way instead of listening to God. God even stopped answering him, because Saul would not obey.

In the end, Saul fought a big battle against the Philistines. His sons were killed, and Saul was badly hurt. He died in that battle, and his sons died with him.

King Saul''s story teaches us an important lesson: God wants us to obey Him and trust Him completely. Being tall and strong is not enough - the most important thing is to love and obey God with all our hearts.',
  'Saul was chosen by God to be Israel''s first king, but he stopped obeying God and lost everything. Learn why obeying God matters most.',
  'junior',
  'Bible Stories',
  datetime('now')
);
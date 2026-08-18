-- Migration 0012: Add The Good Samaritan sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'The Good Samaritan',
  'the-good-samaritan',
  'https://example.com/good-samaritan',
  'One day, a man who knew the law asked Jesus a question. He asked, "Who is my neighbor?"

Jesus answered him with a story. He said: A man was traveling on the road from Jerusalem to Jericho. On the way, robbers attacked him. They beat him, took his clothes and his money, and left him lying on the road, half dead.

Soon, a priest came walking down that same road. He saw the hurt man lying there, but he crossed to the other side and kept going. He did not help him.

Then a Levite came. He also saw the hurt man, but he crossed to the other side too, and kept going. He did not help him either.

Then a Samaritan man came by. In those days, the Jews and the Samaritans did not like each other at all. But when the Samaritan saw the hurt man, he felt very sorry for him.

He went over to him and cleaned his wounds with oil and wine, and tied them up with cloth. Then he put the man on his own donkey and took him to an inn, where he took care of him.

The next day, the Samaritan gave money to the innkeeper and said, "Take care of him. If you spend more than this, I will pay you back when I return."

Then Jesus asked the man who knew the law, "Which of these three men do you think was a neighbor to the man who was hurt?"

The man answered, "The one who showed him mercy."

Jesus said to him, "Go and do the same."

Jesus wants us to help people who need us - even people we do not know, and even people who are different from us. A real neighbor is someone who shows love and kindness to others.',
  'Who is my neighbor? Jesus told the story of a man who was robbed and hurt, and the one person who stopped to help him - the Good Samaritan.',
  'junior',
  'Bible Stories',
  datetime('now')
);
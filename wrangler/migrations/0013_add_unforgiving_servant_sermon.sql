-- Migration 0013: Add The Unforgiving Servant sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'The Unforgiving Servant',
  'the-unforgiving-servant',
  'https://example.com/unforgiving-servant',
  'One day, Peter came to Jesus and asked Him, "Lord, how many times should I forgive my brother when he does something wrong to me? Up to seven times?"

Jesus said to him, "Not seven times, but seventy times seven!" That means we should forgive again and again, as many times as needed.

Then Jesus told this story: A king wanted to check the accounts of his servants. One servant was brought to him who owed him a huge amount of money - so much that he could never pay it back.

The servant could not pay, so the king said he must be sold, along with his wife and children and everything he had. But the servant fell on his knees and begged, "Please be patient with me, and I will pay you back everything!"

The king felt sorry for him, so he let him go. Not only that - he forgave him the whole debt and did not make him pay anything at all!

But then that same servant went out and found a fellow servant who owed him just a little bit of money. He grabbed him by the neck and said, "Pay me what you owe me!"

His fellow servant fell at his feet and begged, "Please be patient with me, and I will pay you back." But the servant refused. He had the man thrown into prison until he could pay the little debt.

When the other servants saw what he did, they were very upset. They went and told the king everything.

The king called the servant in and said, "You wicked servant! I forgave you that whole big debt because you begged me. Shouldn''t you have had mercy on your fellow servant, just like I had mercy on you?"

The king was so angry that he handed the servant over to be punished until he paid back everything.

Jesus said, "This is how My Father in heaven will treat you, if you do not forgive your brother from your heart."

God has forgiven us so much. Because God forgives us, we should forgive other people too - from our hearts, and as many times as they need.',
  'Jesus taught about forgiveness with a story about a king who forgave a huge debt, and a servant who would not forgive a small one. God forgives us, so we must forgive others.',
  'junior',
  'Bible Stories',
  datetime('now')
);
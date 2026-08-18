-- Migration 0019: Add The Story of David sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'The Story of David',
  'the-story-of-david',
  'https://example.com/story-of-david',
  'Long ago, God chose a young shepherd boy named David to be the next king of Israel. David was the youngest son of Jesse, and while his brothers were big and strong, David was just a boy who took care of sheep.

But God told the prophet Samuel, "People look at the outside, but the Lord looks at the heart." God chose David because David loved God with all his heart.

While David was watching his sheep, he learned to trust God. When a lion or a bear came to steal a sheep, David fought them off with his own hands. He said, "The Lord who saved me from the lion and the bear will save me too."

Then came the day of the giant. The Philistine army had a giant warrior named Goliath, who was nine feet tall! He laughed at Israel''s army and made fun of God''s people every day, and everyone was afraid - even the king.

But David was not afraid. He said, "The battle is the Lord''s!" He picked five smooth stones from the stream, took his sling, and ran to meet the giant. With one stone, David hit Goliath right in the forehead, and the giant fell down! God gave David a great victory that day.

The people loved David, but King Saul became jealous of him and tried to kill him many times. David had to run and hide in caves, but he never stopped trusting God. Even when he had the chance to hurt Saul, he said, "I will not touch the man God chose as king."

After Saul died, David became king. He was called a man after God''s own heart. He won battles, brought the ark of God back to Jerusalem, and wrote many beautiful songs to God, called psalms.

But David was not perfect. One time, he did a very bad thing - he sinned against God. When the prophet Nathan told him the truth, David was very sorry and asked God to forgive him. God forgave David, and David wrote, "Create in me a clean heart, O God."

David''s story teaches us that God looks at our hearts, not just our looks or our strength. When we trust God and obey Him, He is with us - and when we make mistakes, God forgives us when we say sorry.',
  'From shepherd boy to king! Read how David trusted God, defeated the giant Goliath, and became a man after God''s own heart.',
  'junior',
  'Bible Stories',
  datetime('now')
);
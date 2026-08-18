-- Migration 0011: Add Healing of the Ten Lepers sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'Healing of the Ten Lepers',
  'healing-of-the-ten-lepers',
  'https://example.com/ten-lepers',
  'One day, Jesus was traveling through a village. Ten men came to meet Him, but they stood far away and did not come close.

These men had a terrible skin disease called leprosy. In those days, people with leprosy had to stay away from other people so the sickness would not spread. They were lonely, and they felt sad and left out.

When they saw Jesus, they shouted with loud voices, "Jesus, Master, have mercy on us!"

Jesus saw them and said, "Go and show yourselves to the priests."

The men obeyed Jesus and started walking to the priests. And as they went, something wonderful happened - they were healed! The leprosy disappeared from their skin, and they were completely well!

All ten men were healed. But then something surprising happened. Only one of them came back to Jesus. He was shouting and praising God with a loud voice. He fell at Jesus'' feet and thanked Him again and again. This man was a Samaritan, and the other nine were from a different place.

Jesus said, "Were not all ten healed? Where are the other nine? Did no one come back to give praise to God except this one man?"

Then Jesus said to the man, "Get up and go. Your faith has made you well."

Jesus healed all ten men, but only one remembered to say thank you. God loves it when we thank Him for the good things He does for us. Let us always remember to say thank you to Jesus!',
  'Jesus healed ten men with leprosy, but only one came back to say thank you. Learn the importance of being thankful to God.',
  'junior',
  'Bible Stories',
  datetime('now')
);
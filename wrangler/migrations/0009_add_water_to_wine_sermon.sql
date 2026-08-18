-- Migration 0009: Add Water Turned into Wine at Cana sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'Water Turned into Wine at Cana',
  'water-turned-into-wine-at-cana',
  'https://example.com/water-into-wine',
  'Jesus, His mother Mary, and His disciples went to a wedding party in a town called Cana. It was a happy day, and many people came to celebrate the bride and the groom.

But then something bad happened. The party ran out of wine! There was nothing left to serve the guests. This was very embarrassing for the people who planned the wedding.

Mary saw the problem and went to Jesus. She said to Him, "They have no more wine."

Jesus did not want everyone to be embarrassed. He told the servants, "Fill the big stone jars with water."

There were six big stone jars, and the servants filled them all the way to the top with water.

Then Jesus said, "Now dip some out, and take it to the man in charge of the feast."

The servants did what Jesus said. When the man in charge tasted what was in the cup, it was not water anymore - it had become wine! And it was very good wine - even better than the wine they had before!

The man in charge did not know where the wine came from, but the servants knew. Jesus had turned the water into wine.

This was the first miracle Jesus did. It showed His glory, and His disciples believed in Him. Jesus can do amazing things - He cares about people''s problems, and He can turn what seems impossible into something wonderful.',
  'Read about Jesus'' first miracle! When a wedding party ran out of wine, Jesus turned water into wine - showing His power and His care for people.',
  'junior',
  'Bible Stories',
  datetime('now')
);
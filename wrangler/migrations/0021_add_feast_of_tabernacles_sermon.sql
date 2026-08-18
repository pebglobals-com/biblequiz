-- Migration 0021: Add The Feast of Tabernacles sermon (junior)

INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'The Feast of Tabernacles',
  'the-feast-of-tabernacles',
  'https://example.com/feast-of-tabernacles',
  'Long ago, God told His people Israel to celebrate a special feast every year called the Feast of Tabernacles. It is also called the Feast of Booths or the Feast of Shelters.

God said, "For seven days, you must live in little shelters made of branches, called tabernacles or booths. This will remind you that I brought your fathers out of Egypt and took care of them in the desert for forty years."

You see, long ago, God''s people lived in Egypt as slaves. God rescued them with His mighty power and led them through the desert to the Promised Land. For forty years, they did not have houses to live in - they stayed in tents and little shelters, and God took care of them every single day.

God gave them food to eat - bread from heaven called manna. He gave them water to drink, even in the hot desert. Their clothes did not wear out, and God never left them.

So every year, at harvest time, the people of Israel built little booths out of branches and leaves, and they lived in them for seven days. They were happy and thankful, remembering how God took care of their fathers in the desert. They also thanked God for the harvest and the good food He gave them.

Jesus Himself went to Jerusalem for the Feast of Tabernacles. On the last and greatest day of the feast, Jesus stood up and said, "If anyone is thirsty, let him come to Me and drink. Whoever believes in Me, rivers of living water will flow from his heart!"

Jesus was telling everyone that He is the One who fills our hearts - just like God filled His people with water in the desert.

The Feast of Tabernacles teaches us to remember and thank God for the way He takes care of us - in good times and hard times. God fed His people in the desert, and He will take care of us too.',
  'God told Israel to celebrate the Feast of Tabernacles by living in shelters of branches - remembering how He cared for them in the desert.',
  'junior',
  'Bible Stories',
  datetime('now')
);
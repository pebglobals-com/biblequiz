-- Migration 0024: Add Prodigal Son sermon + import 98 junior study questions from PDF

-- 1) Create The Prodigal Son sermon (junior)
INSERT INTO sermons (title, slug, source_url, content, excerpt, age_bracket, category, created_at)
VALUES (
  'The Prodigal Son',
  'the-prodigal-son',
  'https://example.com/prodigal-son',
  'One day, Jesus told a story about a father who had two sons. The younger son said to his father, "Father, give me my share of the family money now." So the father divided his property and gave the younger son his share.

  A few days later, the younger son packed all his things and traveled to a faraway country. There he wasted all his money on bad living - eating, drinking, and having fun without thinking about God.

  Soon, a big famine came to that country. The young man had no money left, and he began to be hungry. He went to work for a man in that country, who sent him into the fields to feed pigs. He was so hungry that he wished he could eat the pods the pigs ate, but no one gave him anything.

  Then he came to his senses. He said to himself, "My father has many servants, and they all have enough food to eat - and even more! But I am here dying of hunger. I will go back to my father and say to him, Father, I have sinned against heaven and against you. I am no longer worthy to be called your son. Make me like one of your hired servants."

  So he got up and went back to his father. While he was still a long way off, his father saw him. The father was filled with love and compassion. He ran to his son, threw his arms around him, and kissed him.

  The son said, "Father, I have sinned against heaven and against you. I am no longer worthy to be called your son."

  But the father said to his servants, "Quick! Bring the best robe and put it on him. Put a ring on his finger and sandals on his feet. Bring the fattened calf and kill it. Let us have a feast and celebrate! For this son of mine was dead, and is alive again; he was lost, and is found." So they began to celebrate.

  Meanwhile, the older son was out in the field. When he came near the house, he heard music and dancing. He asked a servant what was happening. The servant said, "Your brother has come home, and your father has killed the fattened calf because he has him back safe and sound."

  The older brother became angry and refused to go in. So his father went out and pleaded with him. But he answered, "Look! All these years I have worked for you like a slave, and I never disobeyed your orders. But you never gave me even a young goat so I could celebrate with my friends. But when this son of yours returns - the one who wasted your money on bad women - you kill the fattened calf for him!"

  The father said to him, "Son, you are always with me, and everything I have is yours. But we had to celebrate and be glad, because this brother of yours was dead, and is alive again; he was lost, and is found."

  Jesus told this story to teach us that God is like the loving father. When we do wrong things and turn away from God, He still loves us. When we come back to Him and say sorry, He forgives us and welcomes us with joy. No matter what we have done, God is always ready to forgive and receive us back with love.',
  'A father had two sons. The younger son wasted his inheritance in a far country, but his father welcomed him back with love - teaching us that God always forgives us when we return to Him.',
  'junior',
  'Bible Stories',
  datetime('now')
);

-- 2) Import study questions from Junior Class Bible Quiz PDF
INSERT INTO study_questions (sermon_id, question_text, answer_text, created_at) VALUES
  (18, 'Where did Jesus perform His first miracle?
A. Jerusalem
B. Cana of Galilee
C. Bethlehem
D. Nazareth', 'B. Cana of Galilee
"And the third day there was a marriage in Cana of Galilee... "  John 2:1', datetime('now')),
  (18, 'What problem occurred at the wedding feast?
A. Food finished
B. Guests left early
C. Wine finished
D. No water available', 'C. Wine finished
"They have no wine. "  John 2:3', datetime('now')),
  (18, 'What instruction did Mary give to the servants?
A. Leave the feast
B. Pray for wine
C. Do whatever Jesus says
D. Call the governor', 'C. Do whatever Jesus says
"Whatsoever he saith unto you, do it. "  John 2:5', datetime('now')),
  (18, 'What did Jesus turn water into?
A. Oil
B. Milk
C. Wine
D. Honey', 'C. Wine
"The water was made wine. "  John 2:9', datetime('now')),
  (18, 'What was the result of this miracle?
A. People were amazed and believed
B. The feast ended early
C. The servants left
D. The bride cried', 'A. People were amazed and believed
"And his disciples believed on him. "  John 2:11', datetime('now')),
  (19, 'Who was Jairus?
A. A tax collector
B. A Roman soldier
C. A synagogue ruler
D. A fisherman', 'C. A synagogue ruler
"One of the rulers of the synagogue, Jairus by name... "  Mark 5:22', datetime('now')),
  (19, 'What was Jairus'' request to Jesus?
A. Heal his servant
B. Bless his house
C. Heal his dying daughter
D. Feed his family', 'C. Heal his dying daughter
"My little daughter lieth at the point of death... "  Mark 5:23', datetime('now')),
  (19, 'What did the woman with the issue of blood do?
A. Spoke to Jesus
B. Touched His garment
C. Called His name
D. Followed Him home', 'B. Touched His garment
"She touched his garment. "  Mark 5:27', datetime('now')),
  (19, 'What was the woman''s belief?
A. Jesus would ignore her
B. Touching Jesus would heal her
C. She needed medicine
D. She must see the priest first', 'B. Touching Jesus would heal her
"If I may touch but his clothes, I shall be whole. "  Mark 5:28', datetime('now')),
  (19, 'What did Jesus say to the woman after healing her?
A. Go home quickly
B. Your faith made you whole
C. Do not return
D. You are forgiven', 'B. Your faith made you whole
"Daughter, thy faith hath made thee whole. "  Mark 5:34 Topic:', datetime('now')),
  (19, 'What happened to Jairus'' daughter?
A. She recovered
B. She was asleep
C. She died
D. She traveled', 'C. She died
"Thy daughter is dead... "  Mark 5:35', datetime('now')),
  (19, 'What did Jesus say to Jairus?
A. Cry no more
B. Only believe
C. Wait and see
D. She is gone forever', 'B. Only believe
"Be not afraid, only believe. " Mark 5:36', datetime('now')),
  (19, 'What miracle did Jesus perform for Jairus'' daughter?
A. He healed her fever
B. He raised her from death
C. He fed her
D. He gave her sight', 'B. He raised her from death
"Damsel, I say unto thee, arise. "  Mark 5:41', datetime('now')),
  (20, 'How many lepers met Jesus?
A. 5
B. 7
C. 10
D. 12', 'C. 10
"There met him ten men that were lepers... "  Luke 17:12', datetime('now')),
  (20, 'What did the lepers ask for?
A. Money
B. Mercy
C. Food
D. Healing herbs', 'B. Mercy
"Jesus, Master, have mercy on us. "  Luke 17:13', datetime('now')),
  (20, 'What instruction did Jesus give them?
A. Go home
B. Wash in the river
C. Show themselves to the priests
D. Wait for Him', 'C. Show themselves to the priests
"Go shew yourselves unto the priests. " Luke 17:14l', datetime('now')),
  (20, 'When were they healed?
A. Immediately before going
B. While praying
C. As they went
D. After returning', 'C. As they went
"As they went, they were cleansed. "  Luke 17:14', datetime('now')),
  (20, 'How many returned to thank Jesus?
A. 1
B. 5
C. 9
D. 10', 'A. 1
"One of them... turned back, and with a loud voice glorified God. " - Luke 17:15', datetime('now')),
  (20, 'What was the nationality of the grateful leper?
A. Jew
B. Roman
C. Samaritan
D. Greek', 'C. Samaritan
"And he was a Samaritan. " Luke 17:16', datetime('now')),
  (20, 'What did Jesus say to the grateful leper?
A. Go and sin no more
B. Your faith has healed you
C. Arise, go thy way; thy faith hath made thee whole
D. Follow me', 'C. Arise, go thy way; thy faith hath made thee whole
"Arise, go thy way: thy faith hath made thee whole. "  Luke 17:19', datetime('now')),
  (21, 'What question did the lawyer ask Jesus?
A. Who is my neighbor?
B. Who is God?
C. How do I pray?
D. Where is heaven?', 'A. Who is my neighbor?
"Master, what shall I do to inherit eternal life?"  Luke 10:25', datetime('now')),
  (21, 'What did Jesus say is the greatest commandment?
A. Love your enemy
B. Love God and your neighbor
C. Keep the Sabbath
D. Give offerings', 'B. Love God and your neighbor
"Thou shalt love the Lord thy God... and thy neighbour as thyself. " - Luke 10:27', datetime('now')),
  (21, 'Who is your neighbor according to Jesus'' parable?
A. Only family members
B. Only friends
C. Anyone in need
D. Only Israelites', 'C. Anyone in need
"Which now of these three... was neighbour unto him?"  Luke 10:36', datetime('now')),
  (21, 'Who helped the injured man?
A. Priest
B. Levite
C. Samaritan
D. Soldier', 'C. Samaritan
"But a certain Samaritan... had compassion on him. "  Luke 10:33', datetime('now')),
  (21, 'What lesson did Jesus give at the end?
A. Go and pray
B. Go and do likewise
C. Fast always
D. Give money', 'B. Go and do likewise
"Go, and do thou likewise. "  Luke 10:37', datetime('now')),
  (31, 'What did the younger son request from his father?
A. A blessing
B. His inheritance
C. A house
D. A servant', 'B. His inheritance
"Father, give me the portion of goods that falleth to me. "  Luke 15:12', datetime('now')),
  (31, 'What did the prodigal son do with his inheritance?
A. Invested it
B. Saved it
C. Wasted it in sinful living
D. Gave it to the poor', 'C. Wasted it in sinful living
"He wasted his substance with riotous living. "  Luke 15:13', datetime('now')),
  (31, 'What happened to the prodigal son during hardship?
A. He became rich
B. He joined the army
C. He suffered hunger
D. He became a king', 'C. He suffered hunger
"He began to be in want. "  Luke 15:14', datetime('now')),
  (31, 'What did the father do when he saw his son returning?
A. Ignored him
B. Sent him away
C. Had compassion and ran to him
D. Punished him', 'C. Had compassion and ran to him
"And ran, and fell on his neck, and kissed him. "  Luke 15:20', datetime('now')),
  (31, 'What did the father say about his son''s return?
A. He is my servant now
B. He is dead and alive again
C. He must pay back everything
D. He is not welcome', 'B. He is dead and alive again
"For this my son was dead, and is alive again... "  Luke 15:24', datetime('now')),
  (31, 'What lesson does this parable teach?
A. Wealth is everything
B. God''s forgiveness and mercy
C. Avoid family
D. Punish sinners', 'B. God''s forgiveness and mercy
"There is joy in the presence of the angels of God over one sinner that repenteth. "  Luke 15:10', datetime('now')),
  (22, 'What question did Peter ask Jesus?
A. How to pray
B. How often to forgive
C. How to fast
D. How to give', 'B. How often to forgive
"Lord, how oft shall my brother sin against me, and I forgive him?"  Matthew 18:21', datetime('now')),
  (22, 'What was Jesus'' answer about forgiveness?
A. Seven times
B. Seventy times seven
C. Ten times
D. Once', 'B. Seventy times seven
"Until seventy times seven. "  Matthew 18:22', datetime('now')),
  (22, 'How much did the servant owe the king?
A. 10 talents
B. 100 talents
C. 10,000 talents
D. 1 talent', 'C. 10,000 talents
"One was brought unto him, which owed him ten thousand talents. "  Matthew 18:24', datetime('now')),
  (22, 'What did the king do to the servant?
A. Imprisoned him immediately
B. Forgave him the debt
C. Sold him
D. Beat him', 'B. Forgave him the debt
"The lord of that servant was moved with compassion, and loosed him. "  Matthew 18:27', datetime('now')),
  (22, 'How much did the servant refuse to forgive his fellow servant?
A. 1 talent
B. 100 talents
C. 100 pence
D. 10 pence', 'C. 100 pence
"An hundred pence. "  Matthew 18:28', datetime('now')),
  (22, 'What happened when the king heard about it?
A. He praised him
B. He forgave again
C. He was angry and punished him
D. He ignored it', 'C. He was angry and punished him
"And his lord was wroth, and delivered him to the tormentors. "  Matthew 18:34', datetime('now')),
  (22, 'What is the main lesson of this parable?
A. Always seek money
B. Forgive others as God forgives you
C. Avoid debt
D. Judge others', 'B. Forgive others as God forgives you
"So likewise shall my heavenly Father do also unto you, if ye from your hearts forgive not every one his brother. "  Matthew 18:35.', datetime('now')),
  (23, 'Who did the Lord call to deliver Israel from Midian?
A. Moses
B. Joshua
C. Gideon
D. Samuel', 'C. Gideon
"And the angel of the LORD appeared unto him, and said unto him, The LORD is with thee, thou mighty man of valour. "  Judges 6:12', datetime('now')),
  (23, 'What was Gideon doing when God called him?
A. Praying
B. Fighting
C. Threshing wheat in hiding
D. Sacrificing', 'C. Threshing wheat in hiding
"Gideon threshed wheat by the winepress, to hide it from the Midianites. "  Judges 6:11', datetime('now')),
  (23, 'What sign did Gideon ask from God?
A. Rain from heaven
B. Fire from a sacrifice
C. Fleece wet with dew
D. Earthquake', 'C. Fleece wet with dew
"Let there be dew on the fleece only... "  Judges 6:37', datetime('now')),
  (23, 'How many men did God reduce Gideon''s army to?
A. 10,000
B. 5,000
C. 300
D. 1,000', 'C. 300
"And the number of them that lapped... was three hundred men. " Judges 7:6', datetime('now')),
  (23, 'What weapon did Gideon''s men use to defeat Midian?
A. Spears
B. Swords
C. Trumpets, pitchers, and lamps
D. Bows', 'C. Trumpets, pitchers, and lamps
"The trumpets in their right hands, and the pitchers, and the lamps within the pitchers. " Judges 7:20', datetime('now')),
  (23, 'What was the result of Gideon''s battle?
A. Israel was defeated
B. Midian was destroyed
C. Peace in Egypt
D. Gideon died', 'B. Midian was destroyed
"The LORD set every man''s sword against his fellow. "  Judges 7:22', datetime('now')),
  (24, 'Who was chosen before birth to be a judge of Israel?
A. Samuel
B. Saul
C. Samson
D. Elijah', 'C. Samson
"Thou shalt conceive, and bear a son; and no razor shall come on his head. "  Judges 13:5', datetime('now')),
  (24, 'What was Samson''s special strength linked to?
A. His sword
B. His faith
C. His hair (Nazirite vow)
D. His shield', 'C. His hair (Nazirite vow)
"There shall no razor come on his head... "  Judges 13:5', datetime('now')),
  (24, 'Who betrayed Samson''s secret?
A. Deborah
B. Ruth
C. Delilah
D. Esther', 'C. Delilah
"He told her all his heart... "  Judges 16:17', datetime('now')),
  (24, 'What did Delilah do to Samson?
A. Helped him
B. Married him
C. Cut his hair
D. Saved him', 'C. Cut his hair
"She made him sleep upon her knees; and she called for a man, and she caused him to shave off the seven locks of his head. "  Judges 16:19', datetime('now')),
  (24, 'What happened to Samson after his hair was cut?
A. He became king
B. He lost his strength
C. He escaped
D. He became rich', 'B. He lost his strength
"He wist not that the LORD was departed from him. "  Judges 16:20', datetime('now')),
  (24, 'How did Samson die?
A. In battle
B. By sickness
C. He destroyed the temple of the Philistines
D. In prison only', 'C. He destroyed the temple of the Philistines
"Let me die with the Philistines. And he bowed himself with all his might... "  Judges 16:30', datetime('now')),
  (25, 'Who became queen instead of Vashti?
A. Ruth
B. Esther
C. Deborah
D. Sarah', 'B. Esther
"So Esther was taken unto king Ahasuerus into his house royal. "  Esther 2:16-17', datetime('now')),
  (25, 'What was Esther''s Jewish name?
A. Hadassah
B. Miriam
C. Naomi
D. Rachel', 'A. Hadassah
"And he brought up Hadassah, that is, Esther... "  Esther 2:7', datetime('now')),
  (25, 'Who was the enemy of the Jews in Esther''s time?
A. Pharaoh
B. Haman
C. Nebuchadnezzar
D. Herod', 'B. Haman
"Haman... thought scorn to lay hands on Mordecai alone. "  Esther 3:6', datetime('now')),
  (25, 'What decree did Haman make?
A. To bless the Jews
B. To destroy the Jews
C. To crown Mordecai
D. To build a temple', 'B. To destroy the Jews
"To destroy, to kill, and to cause to perish all Jews... "  Esther 3:13', datetime('now')),
  (25, 'What risk did Esther take?
A. She left the palace
B. She approached the king without being called
C. She ran away
D. She fought soldiers', 'B. She approached the king without being called
"If I perish, I perish. "  Esther 4:16', datetime('now')),
  (25, 'What happened to Haman?
A. He became king
B. He was honored
C. He was hanged on the gallows
D. He escaped', 'C. He was hanged on the gallows
"So they hanged Haman on the gallows that he had prepared for Mordecai. "  Esther 7:10', datetime('now')),
  (25, 'What was the result of Esther''s courage?
A. Jews were destroyed
B. Jews were saved
C. Esther was punished
D. The king died', 'B. Jews were saved
"The Jews had light, and gladness, and joy, and honour. "  Esther 8:16', datetime('now')),
  (25, 'What festival was established to remember this deliverance?
A. Passover
B. Pentecost
C. Purim
D. Tabernacle', 'C. Purim
"Therefore they called these days Purim... "  Esther 9:26', datetime('now')),
  (26, 'Who was Samuel''s mother?
A. Ruth
B. Hannah
C. Deborah
D. Sarah', 'B. Hannah
"And she called his name Samuel, saying, Because I have asked him of the LORD. "  1 Samuel 1:20', datetime('now')),
  (26, 'What vow did Hannah make before Samuel was born?
A. He would be a king
B. He would be a prophet
C. He would be given to the Lord
D. He would be a warrior', 'C. He would be given to the Lord
"I will give him unto the LORD all the days of his life... "  1 Samuel 1:11', datetime('now')),
  (26, 'Where did Samuel first hear God calling him?
A. Temple
B. Battlefield
C. Tabernacle at Shiloh
D. Mountain', 'C. Tabernacle at Shiloh
"And the LORD called Samuel... "  1 Samuel 3:4', datetime('now')),
  (26, 'What message did Samuel deliver to Eli?
A. Blessing
B. Judgment on Eli''s house
C. Victory in battle
D. Wealth', 'B. Judgment on Eli''s house
"I will judge his house for ever for the iniquity which he knoweth... "  1 Samuel 3:13', datetime('now')),
  (26, 'What role did Samuel have in Israel?
A. King
B. Priest and Prophet
C. Soldier
D. Tax collector', 'B. Priest and Prophet
"And all Israel from Dan even to Beersheba knew that Samuel was established to be a prophet of the LORD. "  1 Samuel 3:20', datetime('now')),
  (27, 'Who was the first king of Israel?
A. David
B. Saul
C. Solomon
D. Samuel.', 'B. Saul
"Thou shalt anoint him to be captain over my people Israel. "  1 Samuel 9:16', datetime('now')),
  (27, 'Why was Saul chosen as king?
A. He was richest
B. He was tallest and handsome
C. He was a priest
D. He was a prophet', 'B. He was tallest and handsome
"From his shoulders and upward he was higher than any of the people. "  1 Samuel 9:2', datetime('now')),
  (27, 'What was Saul''s first major disobedience?
A. He killed Samuel
B. He offered sacrifice unlawfully
C. He ran away
D. He built an altar', 'B. He offered sacrifice unlawfully
"Thou hast done foolishly: thou hast not kept the commandment of the LORD... "  1 Samuel 13:13', datetime('now')),
  (27, 'Who replaced Saul as king?
A. Samuel
B. David
C. Solomon
D. Jonathan', 'B. David
"The LORD hath sought him a man after his own heart. "  1 Samuel 13:14', datetime('now')),
  (27, 'What was Saul''s final battle outcome?
A. He won
B. He became king of all nations
C. He died in battle
D. He became prophet', 'C. He died in battle
"So Saul died, and his three sons... "  1 Samuel 31:6', datetime('now')),
  (28, 'Who anointed David as king?
A. Elijah
B. Samuel
C. Nathan
D. Saul', 'B. Samuel
"Then Samuel took the horn of oil, and anointed him in the midst of his brethren. "  1 Samuel 16:13', datetime('now')),
  (28, 'What was David''s occupation before becoming king?
A. Farmer
B. Shepherd
C. Soldier
D. Carpenter', 'B. Shepherd
"He kept his father''s sheep. "  1 Samuel 17:15', datetime('now')),
  (28, 'Who did David defeat with a sling?
A. Saul
B. Goliath
C. Abner
D. Jonathan', 'B. Goliath
"So David prevailed over the Philistine with a sling and with a stone. "  1 Samuel 17:50', datetime('now')),
  (28, 'What was David known as?
A. A man after God''s heart
B. A fearful man
C. A priest
D. A judge', 'A. A man after God''s heart
"The LORD hath sought him a man after his own heart. "  1 Samuel 13:14', datetime('now')),
  (28, 'Who was David''s closest friend?
A. Saul
B. Jonathan
C. Nathan
D. Absalom', 'B. Jonathan
"The soul of Jonathan was knit with the soul of David. "  1 Samuel 18:1', datetime('now')),
  (28, 'What sin did David commit with Bathsheba?
A. Theft
B. Murder and adultery
C. Lying
D. Idolatry', 'B. Murder and adultery
"Thou art the man. "  2 Samuel 12:7', datetime('now')),
  (28, 'What was David''s response when he was confronted?
A. He denied it
B. He repented
C. He fled
D. He fought', 'B. He repented
"I have sinned against the LORD. "  2 Samuel 12:13', datetime('now')),
  (29, 'What did Solomon ask God for?
A. Wealth
B. Long life
C. Wisdom
D. Power', 'C. Wisdom
"Give therefore thy servant an understanding heart... "  1 Kings 3:9', datetime('now')),
  (29, 'How did God respond to Solomon''s request?
A. Gave him riches only
B. Gave him wisdom and riches
C. Denied him
D. Made him a priest', 'B. Gave him wisdom and riches
"I have given thee a wise and an understanding heart... "  1 Kings 3:12', datetime('now')),
  (29, 'What famous judgment did Solomon make?
A. Dividing the land
B. Building a temple
C. Deciding between two mothers claiming a child
D. Defeating enemies', 'C. Deciding between two mothers claiming a child
"Divide the living child in two, and give half to the one, and half to the other. "  1 Kings 3:25', datetime('now')),
  (29, 'What book of the Bible is associated with Solomon''s wisdom?
A. Psalms
B. Proverbs
C. Genesis
D. Revelation', 'B. Proverbs
"The proverbs of Solomon... "  Proverbs 1:1', datetime('now')),
  (29, 'What was Solomon''s famous temple project?
A. Tower of Babel
B. Temple in Jerusalem
C. Ark of Noah
D. Tabernacle in Egypt', 'B. Temple in Jerusalem
"He built the house of the LORD. "  1 Kings 6:1', datetime('now')),
  (30, '"Three times in a year shall all thy males appear before the LORD thy God in the place
which he shall choose... and they shall not appear before the LORD empty" .
A) what are the three festivals under reference?
b) state which among the trio is of relevance to Christians in this age and
c) cite the Bible text from which the above passage is taken', 'a) The Feast of Unleavened Bread, The Feast of Weeks, and The Feast of Tabernacles
b) of the three, only the Feast of Tabernacles is of relevance in this age. Zechariah 14:16-19
c) Deuteronomy 16:16', datetime('now')),
  (30, 'Highlight spectacular events in the month of October, as far as the history of GOD''S
KINGDOM SOCIETY is concerned', '*She was founded in the month of October
*Feast of Tabernacles celebrations were held in October, at a time
*She observes Christ''s birth anniversary in the month of October', datetime('now')),
  (30, 'Mention other Sabbaths in addition to the weekly Sabbath', '*Sabbaths of the first and last days of the Feast of Tabernacles. Leviticus 23:35,36
*Sabbath of memorial of blowing of trumpets. Leviticus 23:24
*Passover Sabbath. Exodus 12:16; John 19:31
*Sabbath of the Day of Atonement. Leviticus 23:26-32', datetime('now')),
  (30, 'Mention five synonyms for the Feast of Tabernacles', '*Feast of JESUS CHRIST
*Feast of Ingathering - Exodus 23:16; 34:22
*Feast of Rejoicing - Leviticus 23:40; Deuteronomy 16:14
*Feast of Booths - Leviticus 23:42,43; Nehemiah 8:14-17
*Feast of Blessings - Deuteronomy 16:15
*Feast of Prosperity', datetime('now')),
  (30, 'Why is the Feast of Tabernacles designated "Feast of Ingathering"?', 'It is so designated because it was observed at a time when the Israelites had gathered in
their crops. Exodus 23:16; 34:22', datetime('now')),
  (30, 'With the aid of scriptural text ONLY , why GOD''S KINGDOM SOCIETY gives premium to
the preaching of God''s word during the celebration of the Feast of Tabernacles?', 'Deuteronomy 31:10-13; Nehemiah 8:8,9; Psalm 119:9-11; Isaiah 1:16; John 7:14-16,37,38;
15:3; 17:17', datetime('now')),
  (30, 'When and where did GOD''S KINGDOM SOCIETY first celebrate the Feast of
Tabernacles?', 'In 1935 at Kakawa, Lagos', datetime('now')),
  (30, 'The ordinance concerning the celebration of Feast of Tabernacles was handed down to
the Israelites, through Moses their visible shepherd. (Leviticus 23:33-43) What two
justifications has GOD''S KINGDOM SOCIETY to take part in the observance, being non-
Israelites?', 'a) the ordinance concerning Feast of Tabernacles celebration makes allowance for
strangers dwelling among the Israelites to also join. Deuteronomy 16:14;
b) there are both spiritual and natural Jews. Spiritual Jews are persons who become
children of Abraham by reason of their faith in GOD, notwithstanding their origin. (Romans
9:6-8; 2:28,29; Galatians 3:7-9; 6:12-16) We of the G.K.S. as well as other true followers of
JESUS CHRIST are spiritual Jews, by God''s grace
c) the Leader and Founder of Christianity celebrated it as an example for his followers. John
7:1-38; Matthew 10:25; John 13:15', datetime('now')),
  (30, 'Who among the following prophets of GOD described our Lord JESUS CHRIST as a
"minister of the sanctuary, and of the true tabernacle"?
(a) Nehemiah (Nehemiah 8:2) (b) Moses (Leviticus 23:33-43) (c) Peter (Matthew 8:2) (d) Paul
(Hebrews 8:2) € none of the above', 'D. Paul. Hebrews 8:2', datetime('now')),
  (30, 'What was our Lord and Saviour JESUS CHRIST referring to when he declared: "He that
believeth on me, as the scripture hath said, out of his belly shall flow rivers of living water. "?
Cite a cogent Bible authority for your answer', 'He was making reference to the Holy Spirit which would come on those who believe on
him. John 7:39', datetime('now')),
  (30, 'It is argued by some that the brethren referred to in John chapter seven verse three
were the disciples of JESUS CHRIST. How do you respond to this view?', 'It is false. This view is held by those who insist that Mary remained a virgin forever. The
brethren under reference could not have been Christ''s disciples, since they did not believe
in him. (John 7:5) These were actually his siblings in the flesh. Matthew 12:46-50; Mark 6:3;
John 2:12', datetime('now')),
  (30, 'If the observance of the Feast of Tabernacles is actually applicable to Christians, why
then did the brethren of JESUS CHRIST have to ask him to attend? Explain this "refusal" to
be part of it', 'JESUS CHRIST at no time refused to take part in anything that answers to the will of GOD.
(John 5:17; 9:4)
His brethren were In no position to dictate to him, what he should do. (John 6:38) The point
is, the unbelieving Jews sought to take his life, so he only waited for a time most
appropriate and convenient, (John 7:6-8) as children of GOD are expected to guide their
affairs with discretion. Even when he eventually attended, he initially did not make a public
show of himself, (John 7:10) until the midst of the celebration, when, not only did he show
himself to the celebrants, but also used the opportunity to prove himself as a "minister of
the sanctuary, and of the true tabernacle" . John 7:14-19,37,38; Hebrews 8:2', datetime('now')),
  (30, 'Fill in the blank spaces
"And it shall come to pass, that every ______ ______ ______ ______ of all the nations which
______ ______ ______ shall even go up from ______ ______ ______ to worship the King, the
______ ______ ______, and to keep the feast of tabernacles. And it shall be, that ______
______ ______ come up of all the families of ______ ______ unto Jerusalem to ______ ______
______, the LORD of hosts, even upon them ______ ______ ______ ______. " Zechariah
14:16,17', '"And it shall come to pass, that every one that is left of all the nations which came against
Jerusalem shall even go up from year to year to worship the King, the LORD of hosts, and to
keep the feast of tabernacles. And it shall be, that whoso will not come up of all the families
of the earth unto Jerusalem to worship the King, the LORD of hosts, even upon them shall
be no rain. " Zechariah 14:16,17', datetime('now')),
  (30, 'Give interpretation to the following terms as used in Zechariah 14:16-19
(a) Jerusalem
(b) families of Egypt
© rain
(d) plague', '(a) God''s Kingdom Organisation
(b) the ungodly
© God''s blessing and
(d) punishment from God Almighty.', datetime('now')),
  (30, 'Why does GOD''S KINGDOM SOCIETY not offer animal sacrifice/burnt offerings as
clearly stated in the ordinance concerning the celebration of the Feast of Tabernacles?
Support your answer with two relevant Bible texts', 'In the Christian era, animal sacrifices have been abolished since our Passover, JESUS
CHRIST have been sacrificed for mankind, once and for all. (John 1:29; 1Corinthians 5:7;
Hebrews 10:5-12
However, as disciples of JESUS CHRIST, our sacrifice is spiritual, that is "the fruit of our lips
giving thanks to his name. " Hebrews 13:15', datetime('now')),
  (30, '"Observance of the Feast of Tabernacles is in obedience to God''s commandments for
which members of GOD''S KINGDOM SOCIETY will be blessed by GOD. "
Provide a Bible text that affirms God''s blessings for those who are obedient to God''s laws
(a) 1John 3:22 (b) John 3:22 (c) Leviticus 23:33-43 (d) Matthew 23:33-43 € all of the
above', 'A. 1John 3:22', datetime('now')),
  (30, 'Often times, while approaching the celebration of God''s only ordained Feast in this
age, Sermons bothering on "RECONCILIATION" , "FORGIVENESS" , "CHARITY" ,
"THANKSGIVING" etc., are treated. Of what relevance are these Sermons to the Feast of
Tabernacles? Authenticate your answer using three striking scriptural authorities', 'a) the Feast of Tabernacles celebration is a period of making offerings to GOD.
(Deuteronomy 16:16,17) In Matthew 5:23,24, JESUS CHRIST gave Christians modality on
how to offer gift items to GOD, i.e after  reconciliation with our brother or sister
b) the Holy Bible tells us that our claim to love GOD cannot be genuine if we have hatred for
our neighbours.1John 4:8,12,20
c) St. Paul categorically instructs Christians not to appear before GOD with malice, but to
purge ourselves of it. 1Corinthians 5:7,8
d) liberality/charitable works especially during the celebration helps to improve the bond
among members. (Psalm 133:1; Acts 4:32-37) It is one of the marks of God''s Organisation.
John 13:34,35', datetime('now')),
  (30, 'How do you justify shift from October to December, by GOD''S KINGDOM SOCIETY , as
far as the Feast of Tabernacles is concerned? Cite two Bible references to back your
answer', 'True, the law given to Moses states that it should be observed in the Jewish seventh month,
which corresponds with our October, however, the G.K.S. is exercising the liberty brought
about by JESUS CHRIST: "For the law was given by Moses, but grace and truth came by
Jesus Christ. " John 1:17
By extension, we are not bound by the letters of the law, but the spirit . 2Corinthians 3:6
The shift therefore is  for convenience, as December affords members the opportunity to
attend en masse (Proverbs 14:28) owing to the holidays.', datetime('now'))
;

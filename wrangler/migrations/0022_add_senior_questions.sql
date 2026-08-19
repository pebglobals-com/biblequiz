-- Migration 0022: Add senior quiz questions for the 10 live senior sermons (ids 1,2,3,9,10,11,12,13,14,15)

INSERT INTO questions (sermon_id, question_text, options, correct_answer, age_bracket, created_at) VALUES
-- WHO IS GOD? (id 1)
(1, 'What does the Hebrew word "elohim" mean?', '["A mighty or powerful one","A weak being","A servant","A king"]', 'A mighty or powerful one', 'senior', datetime('now')),
(1, 'What exclusive name did God Almighty give to Himself?', '["JEHOVAH","ALLAH","ELOHIM","ADONAI"]', 'JEHOVAH', 'senior', datetime('now')),
(1, 'What does the name JEHOVAH mean?', '["Self-existing One or One Who lives of Himself","Mighty Warrior","King of kings","Creator"]', 'Self-existing One or One Who lives of Himself', 'senior', datetime('now')),
(1, 'Which of the following is NOT one of God''s four infinite attributes?', '["Wisdom","Power","Justice","Riches"]', 'Riches', 'senior', datetime('now')),
(1, 'How did God destroy the first world?', '["With water (the flood)","With fire","With an earthquake","With a storm"]', 'With water (the flood)', 'senior', datetime('now')),
(1, 'The beginning of the creation of God was the...?', '["LOGOS (WORD)","LIGHT","SPIRIT","ANGEL"]', 'LOGOS (WORD)', 'senior', datetime('now')),

-- WHO IS JESUS CHRIST? (id 2)
(2, 'According to John 17:3, whoever does not know Jesus Christ cannot be...?', '["Saved","Baptized","Healed","Blessed"]', 'Saved', 'senior', datetime('now')),
(2, 'What does the article say about bringing Jesus into equality with the Almighty Father?', '["It is a damnable error","It is correct","It is encouraged","It is optional"]', 'It is a damnable error', 'senior', datetime('now')),
(2, 'Among the creation of God, Jesus is placed in a class distinguished beyond all others...?', '["Both in the heavenly realm and on this terrestrial globe","Only in heaven","Only on earth","Among angels"]', 'Both in the heavenly realm and on this terrestrial globe', 'senior', datetime('now')),
(2, 'During parties, why do some people exclaim "O Gracious Jesus!"?', '["When made merry by wine","Out of deep faith","When praying","During worship"]', 'When made merry by wine', 'senior', datetime('now')),

-- WAS CHRIST BORN ON CHRISTMAS DAY? (id 3)
(3, 'What is Christmas described as in the article?', '["A pagan festival with an unseemly Christian veneer","A biblical feast","A Jewish festival","A harvest festival"]', 'A pagan festival with an unseemly Christian veneer', 'senior', datetime('now')),
(3, 'According to The Explanatory Catechism of Christian Doctrine, when was Jesus born?', '["December 25 (Christmas Day)","October","April","January 6"]', 'December 25 (Christmas Day)', 'senior', datetime('now')),
(3, 'According to the article, in what month was Jesus actually born?', '["October","December","April","September"]', 'October', 'senior', datetime('now')),
(3, 'In what month did Jesus die?', '["April","December","June","October"]', 'April', 'senior', datetime('now')),
(3, 'Zacharias, the father of John the Baptist, was a successor of whom?', '["Abijah","Aaron","David","Solomon"]', 'Abijah', 'senior', datetime('now')),
(3, 'According to medical authorities, what is the span of foetal life?', '["280 days (nine months)","200 days","365 days","300 days"]', '280 days (nine months)', 'senior', datetime('now')),

-- THE FEAST OF TABERNACLES (id 9)
(9, 'Who instituted the Feast of Tabernacles?', '["The Almighty God","Moses","King David","Aaron"]', 'The Almighty God', 'senior', datetime('now')),
(9, 'On what day of the seventh month was the feast to be celebrated?', '["The 15th day","The 1st day","The 10th day","The 21st day"]', 'The 15th day', 'senior', datetime('now')),
(9, 'How many days did the feast last?', '["Eight days","Seven days","Three days","Forty days"]', 'Eight days', 'senior', datetime('now')),
(9, 'Where is the ordinance of the Feast of Tabernacles recorded?', '["Leviticus 23:33-43","Exodus 20","Genesis 1","Deuteronomy 5"]', 'Leviticus 23:33-43', 'senior', datetime('now')),
(9, 'What was the Feast of Tabernacles also known as?', '["The Feast of Ingathering","The Feast of Pentecost","The Feast of Trumpets","The Feast of Lights"]', 'The Feast of Ingathering', 'senior', datetime('now')),
(9, 'What did Jesus cry on the last great day of the feast?', '["If any man thirst, let him come unto me and drink","Repent ye","Follow me","Blessed are the poor"]', 'If any man thirst, let him come unto me and drink', 'senior', datetime('now')),

-- IS THERE ANYTHING LIKE HOLY GHOST FIRE IN THE BIBLE? (id 10)
(10, 'What do some professed Christians believe "holy ghost fire" can do?', '["Destroy one''s enemies or obstacles","Heal the sick","Raise the dead","Protect from danger"]', 'Destroy one''s enemies or obstacles', 'senior', datetime('now')),
(10, 'Who complained about the manner "Holy Ghost fire" prayers were said at a Pentecostal church?', '["Dr. Reuben Abati of The Guardian","Theophilus Olabayo","Alexander Hislop","Earl W. Count"]', 'Dr. Reuben Abati of The Guardian', 'senior', datetime('now')),
(10, 'What did Dr. Reuben Abati say the "Holy Ghost fire" prayers amounted to?', '["Arguing with God","Worshipping God","Praising God","Thanking God"]', 'Arguing with God', 'senior', datetime('now')),
(10, 'What should Christians do instead of being carried away by every wind of doctrine?', '["Carefully scrutinize what they have been taught in the light of the Scriptures","Follow every new doctrine","Trust their feelings","Listen to every prophet"]', 'Carefully scrutinize what they have been taught in the light of the Scriptures', 'senior', datetime('now')),

-- THE EVIL OF DRUNKENNESS (id 11)
(11, 'What is drunkenness said to be?', '["Voluntary madness","An accident","A disease","A blessing"]', 'Voluntary madness', 'senior', datetime('now')),
(11, 'What does wine do to those who take it too much?', '["It bites like a snake","It makes them wise","It gives them strength","It makes them happy always"]', 'It bites like a snake', 'senior', datetime('now')),
(11, 'Who has no place in God''s glorious, everlasting Kingdom?', '["A drunkard","A poor man","A sick man","A foreigner"]', 'A drunkard', 'senior', datetime('now')),
(11, 'What is drunkenness legally, according to The American Peoples Encyclopedia?', '["The lack of mental coherence and self-control produced by drinking intoxicating liquors to excess","A crime punishable by death","A form of worship","A harmless habit"]', 'The lack of mental coherence and self-control produced by drinking intoxicating liquors to excess', 'senior', datetime('now')),
(11, 'Is there a law in the Holy Bible that prohibits a Christian from drinking wine at all?', '["No, there is no such law","Yes, drinking is a sin","Only on Sundays","Only in public"]', 'No, there is no such law', 'senior', datetime('now')),

-- FACTS ABOUT COVERING OF HAIR IN WORSHIP (id 12)
(12, 'What is every woman required to cover in appearing before God for worship?', '["Her hair","Her face","Her feet","Her hands"]', 'Her hair', 'senior', datetime('now')),
(12, 'Why must a woman cover her hair in worship?', '["Required by nature and by the law of God","A human tradition","A fashion","Only in cold weather"]', 'Required by nature and by the law of God', 'senior', datetime('now')),
(12, 'What has the practice of women attending services with uncovered hair become?', '["The norm in most Churches in the world","A rare occurrence","Forbidden by law","Only for pastors"]', 'The norm in most Churches in the world', 'senior', datetime('now')),
(12, 'What do some church leaders contend about the hair?', '["The hair is the God-given covering","The veil is optional","Long hair is a sin","Hair must be cut short"]', 'The hair is the God-given covering', 'senior', datetime('now')),

-- WHAT DOES THE BIBLE SAY ABOUT DREAMS AND VISIONS? (id 13)
(13, 'What do many people who claim to see visions today do?', '["Exploit the ignorance and fears of the people for their own selfish gain","Genuinely preach the gospel","Heal the sick","Teach the Bible"]', 'Exploit the ignorance and fears of the people for their own selfish gain', 'senior', datetime('now')),
(13, 'Who openly indicted the Primate of Evangelical Church of Yahweh?', '["Nigeria''s President, Chief Olusegun Obasanjo","The Pope","The Queen of England","The UN Secretary"]', 'Nigeria''s President, Chief Olusegun Obasanjo', 'senior', datetime('now')),
(13, 'What did the president warn Nigerians to beware of?', '["False prophets and spiritualists who played on people''s intelligence with their visions","Thieves and robbers","Politicians","Foreigners"]', 'False prophets and spiritualists who played on people''s intelligence with their visions', 'senior', datetime('now')),

-- IS IT ONLY IN CATHEDRALS GOD CAN BE WORSHIPPED? (id 14)
(14, 'How is the quality of worship rendered to God assessed?', '["Not by the magnificence of the house of worship","By the size of the building","By the number of people","By the choir''s voice"]', 'Not by the magnificence of the house of worship', 'senior', datetime('now')),
(14, 'Is it a sin to have a decent place for worship?', '["No, it is not a sin","Yes, it is a sin","Only for priests","Only in Jerusalem"]', 'No, it is not a sin', 'senior', datetime('now')),
(14, 'What is important in worship according to the article?', '["Worshipping God in truth and out of a pure heart","A grand building","Fine robes","Loud music"]', 'Worshipping God in truth and out of a pure heart', 'senior', datetime('now')),
(14, 'What does the word "worship" mean?', '["To express in word and act deep love and respect, gratitude, trust, loyalty and dependence upon a higher power","To sing songs","To attend church","To give money"]', 'To express in word and act deep love and respect, gratitude, trust, loyalty and dependence upon a higher power', 'senior', datetime('now')),

-- LABOUR NOT FOR THE MEAT THAT PERISHETH (id 15)
(15, 'What is the text of this sermon?', '["John 6:27","John 4:34","Matthew 5:1","Psalm 23:1"]', 'John 6:27', 'senior', datetime('now')),
(15, 'What did Jesus say was His meat?', '["To do the will of Him that sent me, and to finish His work","To eat bread","To rest","To teach in the temple"]', 'To do the will of Him that sent me, and to finish His work', 'senior', datetime('now')),
(15, 'Who sat at Jesus'' feet listening to his preaching while Martha was busy serving?', '["Mary","Lazarus","Peter","John"]', 'Mary', 'senior', datetime('now')),
(15, 'What was Martha unhappy about?', '["That her sister Mary was not helping with the serving of guests","That the food was cold","That Jesus was late","That the guests were many"]', 'That her sister Mary was not helping with the serving of guests', 'senior', datetime('now')),
(15, 'What did Christ teach his disciples by saying "My meat is to do the will of Him that sent me"?', '["That the work of God supersedes all else","That eating is important","That Martha was wrong","That rest is necessary"]', 'That the work of God supersedes all else', 'senior', datetime('now'));
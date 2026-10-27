USE sports_academy;

INSERT INTO TEAMS (TEAM_NAME, COACH_NAME, HOME_GROUND) VALUES
('Falcon Strikers', 'Rahul Mehta', 'Central Stadium'),
('Thunder Warriors', 'Amit Sharma', 'City Arena'),
('Royal Challengers', 'Vikram Singh', 'National Sports Ground'),
('Blue Panthers', 'Suresh Kumar', 'Victory Field');

INSERT INTO COACH (COACH_NAME, EXPERIENCE, COACH_AGE, TEAM_ID) VALUES
('Rahul Mehta', 10, 45, 1),
('Amit Sharma', 8, 42, 2),
('Vikram Singh', 12, 48, 3),
('Suresh Kumar', 7, 40, 4);

INSERT INTO PLAYERS (PLY_NAME, POSITION, TEAM_ID) VALUES
('Arjun Patel', 'Forward', 1),
('Karan Joshi', 'Midfielder', 1),
('Rohit Nair', 'Defender', 2),
('Nikhil Rao', 'Goalkeeper', 2),
('Manav Shah', 'Forward', 3),
('Dev Malhotra', 'Defender', 3),
('Aditya Verma', 'Midfielder', 4),
('Sameer Khan', 'Forward', 4);

INSERT INTO MATCHS (DATE, GROUND, HOME_TEAM_ID, AWAY_TEAM_ID) VALUES
('2026-06-01', 'Central Stadium', 1, 2),
('2026-06-05', 'National Sports Ground', 3, 4),
('2026-06-10', 'City Arena', 2, 3);

INSERT INTO SCORE (MATCH_ID, HOME_SCORE, AWAY_SCORE, WIN_TEAM) VALUES
(1, 3, 1, 'Falcon Strikers'),
(2, 2, 2, 'Draw'),
(3, 0, 1, 'Royal Challengers');

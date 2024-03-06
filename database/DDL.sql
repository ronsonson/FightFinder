/*
    Project Group 84 Step 4 SQL Data Definition Queries
    Group Members: Ross Hoelscher and Ronson Imfeld
*/

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- SQL Definitions for tables for Fight Finder

-- Tournament Organizers Table
CREATE OR REPLACE TABLE Tournament_Organizers(
    organizer_id int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    first_name varchar(45) NOT NULL,
    last_name varchar(45) NOT NULL,
    username varchar(45) NOT NULL,
    PRIMARY KEY(organizer_id)
);

-- Players Table
CREATE OR REPLACE TABLE Players
(
    player_id int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    first_name varchar(45) NOT NULL,
    last_name varchar(45) NOT NULL,
    username varchar(45) NOT NULL,
    PRIMARY KEY(player_id)
);

-- Tournaments Table
CREATE OR REPLACE TABLE Tournaments
(
    tournament_id int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    date_of_tournament date NOT NULL,
    tournament_name varchar(45) NOT NULL,
    is_online tinyint(1) NOT NULL,
    location varchar(45) NOT NULL,
    prize_pool varchar(45) NOT NULL,
    organizer_id int(11),
    game_id int(11) NOT NULL,
    FOREIGN KEY (organizer_id) REFERENCES Tournament_Organizers(organizer_id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES Games(game_id) ON DELETE CASCADE,
    PRIMARY KEY(tournament_id)
);

-- Games Table
CREATE OR REPLACE TABLE Games
(
    game_id int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    game_name varchar(45) NOT NULL,
    PRIMARY KEY(game_id)
);

--Characters Table
CREATE OR REPLACE TABLE Characters
(
    character_name varchar(45) NOT NULL,
    character_id int(11) AUTO_INCREMENT UNIQUE NOT NULL, 
    is_legal tinyint(1) NOT NULL,
    game_id int(11) NOT NULL,
    PRIMARY KEY(character_id),
    FOREIGN KEY(game_id) REFERENCES Games(game_id) ON DELETE CASCADE
);

-- Characters and Players intersection Table
CREATE OR REPLACE TABLE Characters_player_plays
(
    character_player_plays_id int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    player_id int(11),
    character_id int(11),
    game_id int(11),
    PRIMARY KEY (character_player_plays_id),
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE,
    FOREIGN KEY (character_id) REFERENCES Characters(character_id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES Games(game_id) ON DELETE CASCADE


);

-- Players and Tournaments intersection Table
CREATE OR REPLACE TABLE Players_in_tournaments
(
    tournament_entry_id int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    tournament_id int(11),
    organizer_id int(11),
    player_id int(11),
    PRIMARY KEY (tournament_entry_id),
    FOREIGN KEY (tournament_id) REFERENCES Tournaments(tournament_id) ON DELETE CASCADE,
    FOREIGN KEY (organizer_id) REFERENCES Tournament_Organizers(organizer_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES Players(player_id) ON DELETE CASCADE
);

-- Inserting sample data into database

-- Tournament Organizers Sample Data
INSERT INTO Tournament_Organizers(
    first_name,
    last_name,
    username
)
VALUES(
    "Bob",
    "Walker",
    "b_walk"
),
(
    "Jeffrey",
    "Smith",
    "j_smith"
),
(
    "Roberto",
    "Rodriguez",
    "RSquared"
),
(
    "Zoey",
    "Gates",
    "Gatekeeper"
),
(
    "Michael",
    "Purdy",
    "mp5000"
);

-- Players Sample Data
INSERT INTO Players(
    first_name,
    last_name,
    username
)
VALUES(
    "Justin",
    "Wong",
    "jwong"
),
(
    "Stephen",
    "Lyon",
    "Sajam"
),
(
    "Daigo",
    "Umehara",
    "Daigo"
),
(
    "Dominique",
    "McLean",
    "SonicFox"
),
(
    "Kim",
    "Jae-won",
    "Daru"
);

-- Tournaments Sample Data
INSERT INTO Tournaments(
    date_of_tournament,
    tournament_name,
    is_online,
    prize_pool,
    organizer_id,
    location,
    game_id
)
VALUES(
    '2024-02-07',
    'WNF 12',
    0,
    "5000",
    2,
    "Chicago, IL",
    5
),
(
    '2023-12-10',
    'CEO 2023',
    0,
    "10000",
    3,
    "Tampa, FL",
    2
),
(
    '2020-07-03',
    'Coinbox Online',
    1,
    "10000",
    1,
    "Online",
    3
),
(
    '2023-08-04',
    'Evo 2023',
    0,
    "100000",
    4,
    "Las Vegas, NV",
    1
),
(
    '2024-01-17',
    'WNF 9',
    1,
    "2500",
    1,
    "Online",
    3
);

-- Games Sample Data
INSERT INTO Games(
    game_name
)
VALUES(
    "Street Fighter 6"
),
(
    "Tekken 8"
),
(
    "Guilty Gear Strive"
),
(
    "Tekken 7"
),
(
    "Granblue Fantasy Versus: Rising"
);

-- Characters Sample Data
INSERT INTO Characters(
    character_name,
    is_legal,
    game_id
)
VALUES(
    "Sol Badguy",
    1,
    3
),
(
    "Ryu",
    1,
    1
),
(
    "Reina",
    1,
    2
),
(
    "Vira",
    1,
    5
),
(
    "Ken",
    1,
    1
);

-- Characters and Players Intersection Table Sample Data
INSERT INTO Characters_player_plays(
    player_id,
    character_id,
    game_id
)
VALUES(
    1,
    2,
    1
),
(
    2,
    4,
    5
),
(
    3,
    5,
    1
),
(
    4,
    3,
    2
),
(
    5,
    1,
    3
);

-- Players and Tournaments Intersection Table Sample Data
INSERT INTO Players_in_tournaments(
    tournament_id,
    organizer_id,
    player_id
)
VALUES(
    4,
    4,
    1
),
(
    4,
    4,
    3
),
(
    1,
    2,
    2
),
(
    2,
    3,
    5
),
(
    5,
    1,
    5
);



SET FOREIGN_KEY_CHECKS=1;
COMMIT;
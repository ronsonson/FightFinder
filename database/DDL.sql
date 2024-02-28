/*
    Project Group 84 Step 2 SQL Data Definition Queries
    Group Members: Ross Hoelscher and Ronson Imfeld
*/

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;


CREATE OR REPLACE TABLE Tournament_Organizers(
    organizerID int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    first_name varchar(45) NOT NULL,
    last_name varchar(45) NOT NULL,
    username varchar(45) NOT NULL,
    PRIMARY KEY(organizerID)
);

CREATE OR REPLACE TABLE Players
(
    playerID int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    first_name varchar(45) NOT NULL,
    last_name varchar(45) NOT NULL,
    username varchar(45) NOT NULL,
    PRIMARY KEY(playerID)
);

CREATE OR REPLACE TABLE Tournaments
(
    tournamentID int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    date_of_tournament date NOT NULL,
    is_online tinyint(1) NOT NULL,
    location varchar(45) NOT NULL,
    prize_pool varchar(45) NOT NULL,
    organizerID int(11) NOT NULL,
    gameID int(11) NOT NULL,
    FOREIGN KEY (organizerID) REFERENCES Tournament_Organizers(organizerID),
    FOREIGN KEY (gameID) REFERENCES Games(gameID),
    PRIMARY KEY(tournamentID)
);

CREATE OR REPLACE TABLE Games
(
    gameID int(11) AUTO_INCREMENT UNIQUE NOT NULL,
    game_name varchar(45) NOT NULL,
    PRIMARY KEY(gameID)
);

CREATE OR REPLACE TABLE Characters
(
    character_name varchar(45) NOT NULL,
    characterID int(11) AUTO_INCREMENT UNIQUE NOT NULL, 
    is_legal tinyint(1) NOT NULL,
    gameID int(11) NOT NULL,
    PRIMARY KEY(characterID),
    FOREIGN KEY(gameID) REFERENCES Games(gameID)
);

CREATE OR REPLACE TABLE Characters_player_plays
(
    playerID int(11),
    characterID int(11),
    gameID int(11),
    FOREIGN KEY(playerID) REFERENCES Players(playerID),
    FOREIGN KEY (characterID) REFERENCES Characters(characterID),
    FOREIGN KEY (gameID) REFERENCES Games(gameID)


);

CREATE OR REPLACE TABLE Players_in_tournaments
(
    tournamentID int(11),
    organizerID int(11),
    playerID int(11),
    FOREIGN KEY (tournamentID) REFERENCES Tournaments(tournamentID),
    FOREIGN KEY (organizerID) REFERENCES Tournament_Organizers(organizerID),
    FOREIGN KEY (playerID) REFERENCES Players(playerID)
);

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

INSERT INTO Tournaments(
    date_of_tournament,
    is_online,
    prize_pool,
    organizerID,
    location,
    gameID
)
VALUES(
    '2024-02-07',
    0,
    "5000",
    2,
    "Chicago, IL",
    5
),
(
    '2023-12-10',
    0,
    "10000",
    3,
    "Tampa, FL",
    2
),
(
    '2020-07-03',
    1,
    "10000",
    1,
    "Online",
    3
),
(
    '2023-08-04',
    0,
    "100000",
    4,
    "Las Vegas, NV",
    1
),
(
    '2024-01-17',
    1,
    "2500",
    1,
    "Online",
    3
);

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

INSERT INTO Characters(
    character_name,
    is_legal,
    gameID
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

INSERT INTO Characters_player_plays(
    playerID,
    characterID,
    gameID
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

INSERT INTO Players_in_tournaments(
    tournamentID,
    organizerID,
    playerID
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
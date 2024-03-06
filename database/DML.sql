/*
    Project Group 84 Step 3 SQL Data Manipulation Queries
    Group Members: Ross Hoelscher and Ronson Imfeld
*/

-- Prepopulate Game IDs and Names into Game dropdown
SELECT game_id, game_name FROM Games;

-- CRUD operations for Characters
SELECT character_id, character_name, is_legal, Games.game_name FROM Characters INNER JOIN Games ON Characters.game_id = Games.game_id;
UPDATE Characters SET character_name = :character_name_input, is_legal = :is_legal_input, game_id = :game_id_from_dropdown WHERE character_id = :character_id_from_update_form;
INSERT INTO Characters (character_name, is_legal, game_id) VALUES (:character_name_input, :is_legal_input, :game_id_from_dropdown);

-- CRUD operations for Games
SELECT game_id, game_name FROM Games;
UPDATE Games SET game_name = :game_name_input WHERE game_id = :game_id_from_update_form;
INSERT INTO Games (game_name) VALUES (:game_name_input);

-- CRUD operations for Tournament Organizers
SELECT organizer_id, first_name, last_name, username FROM Tournament_Organizers;
INSERT INTO Tournament_Organizers (first_name, last_name, username) VALUES (:organizer_first_name_input, :organizer_last_name_input, :organizer_username_input);

-- CRUD operations for Players
SELECT player_id, first_name, last_name, username FROM Players;
INSERT INTO Players (first_name, last_name, username) VALUES (:player_first_name_input, :player_last_name_input, :player_username_input)
UPDATE Players SET first_name = :player_first_name_input, last_name = :player_last_name_input, username = :player_username_input WHERE player_id = :player_id_from_update_form
DELETE FROM Players WHERE player_id = :player_id_from_browse_page

-- CRUD operations for Tournaments
SELECT tournament_id, tournmanent_name, date_of_tournament, is_online, location, prize_pool, Tournament_Organizers.username, Games.game_name FROM Tournaments 
INNER JOIN Tournament_Organizers ON Tournaments.organizer_id = Tournament_Organizers.organizer_id
INNER JOIN Games ON Tournaments.game_id = Games.game_id;
UPDATE Tournaments SET tournmanent_name = :tournmanent_name_input, date_of_tournament = :date_of_tournament_input, is_online = :is_online_input, location = :location_input, prize_pool = :prize_pool_input, organizer_id = :organizer_id_from_update_form, game_id = :game_id_from_update_form;
INSERT INTO Tournaments (tournmanent_name, date_of_tournament, is_online, location, prize_pool, organizer_id, game_id) VALUES (:tournmanent_name_input, :date_of_tournament_input, :is_online_input, :location_input, :prize_pool_input, :organizer_id_from_dropdown, :game_id_from_dropdown);

-- Prepopulate Tournament IDs and Names, Organizer IDs Usernames, and Player IDs Usernames into dropdowns
SELECT tournament_id, tournmanent_name from Tournaments;
SELECT organizer_id, username FROM Tournament_Organizers;
SELECT player_id, username FROM Player;

-- CRUD operations for Players_in_tournaments
SELECT tourname_entry_id, Tournaments.tournmanent_name, Tournament_Organizers.username, Players.username FROM Players_in_tournaments 
INNER JOIN Tournaments ON Players_in_tournaments.tournament_id = Tournaments.tournament_id
INNER JOIN Tournament_Organizers ON Players_in_tournaments.organizer_id = Tournament_Organizers.organizer_id
INNER JOIN Players ON Players_in_tournaments.player_id = Players.player_id;
INSERT INTO Players_in_tournaments (tournament_id, organizer_id, player_id) VALUES (:tournament_id_from_dropdown, :organizer_id_from_dropdown, :player_id_from_dropdown)

-- Prepopulate Player IDs and Usernames, Character IDs and Names, and Game IDs and Names into dropdowns
SELECT player_id, username FROM Players;
SELECT character_id, character_name FROM Characters;
SELECT game_id, game_name FROM Games;

-- CRUD operations for Characters_player_plays
SELECT character_player_plays_id, Players.username, Characters.character_name, Games.game_name FROM Characters_player_plays
INNER JOIN Players ON Characters_player_plays.player_id = Players.player_id
INNER JOIN Characters ON Characters_player_plays.character_id = Characters.character_id
INNER JOIN Games ON Characters_player_plays.game_id = Games.game_id;
INSERT INTO Characters_player_plays (player_id, character_id, game_id) VALUES (:player_id_from_dropdown, :character_id_from_dropdown, :game_id_from_dropdown);
UPDATE Characters_player_plays SET player_id = :player_id_from_dropdown, character_id = :character_id_from_dropdown, game_id = :game_id_from_dropdown WHERE character_player_plays_id = :character_player_plays_id_from_update_form;
DELETE FROM Characters_player_plays WHERE character_player_plays_id = :character_player_plays_id_from_browse_page;
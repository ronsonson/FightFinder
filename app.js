// App.js


//SETUP
    



// Database

var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 58936;                 // Set a port number at the top so it's easy to change in the future

var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
/*
    ROUTES
*/

app.get('/games', function(req, res)
    {  
        let query1 = "SELECT * FROM Games;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('games', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });          
app.get('/characters', function(req, res)              
    {
        let query1 = "SELECT character_id, character_name, is_legal, Games.game_name FROM Characters INNER JOIN Games ON Characters.game_id = Games.game_id;"
        let query2 = "SELECT * FROM Games;"
        db.pool.query(query1, function (error, rows, fields)
        {
            db.pool.query(query2, function (error, gamerows, fields){
                res.render('characters', {data: rows, gameData: gamerows});
            })
        })
    });
app.get('/tournaments', function(req, res)              
    {
        // Define our queries
        let query1 = "SELECT tournament_id, tournament_name, date_of_tournament, is_online, location, prize_pool, Tournament_Organizers.username, Games.game_name FROM Tournaments INNER JOIN Tournament_Organizers ON Tournaments.organizer_id = Tournament_Organizers.organizer_id INNER JOIN Games ON Tournaments.game_id = Games.game_id; ";
        let query2 = "SELECT * FROM Tournament_Organizers;";
        let query3 = "SELECT * FROM Games;";
        db.pool.query(query1, function (error, rows, fields)
        {
            db.pool.query(query2, function (error, organizer_rows, fields){
                db.pool.query(query3, function(error, game_rows, fields){
                    res.render('tournaments', {data: rows, organizerData: organizer_rows, gameData: game_rows});
                })
            })
        })
    });

    app.get('/tournamentsRoster', function(req, res)              
    {
        // Define our queries
        let query1 = `SELECT tournament_entry_id, tournament_name, Tournament_Organizers.username AS organizer_name, Players.username FROM Players_in_tournaments 
                            INNER JOIN Tournaments ON Players_in_tournaments.tournament_id = Tournaments.tournament_id 
                            INNER JOIN Tournament_Organizers ON Players_in_tournaments.organizer_id = Tournament_Organizers.organizer_id 
                            INNER JOIN Players ON Players_in_tournaments.player_id = Players.player_id;`;
        let query2 = "SELECT * FROM Tournaments";
        let query3 = "SELECT * FROM Tournament_Organizers;";
        let query4 = "SELECT * FROM Players;";
        db.pool.query(query1, function (error, rows, fields)
        {
            db.pool.query(query2, function(error, tournament_rows, fields){
                db.pool.query(query3, function(error, organizer_rows, fields){
                    db.pool.query(query4, function(error, player_rows, fields){
                        res.render('tournamentsRoster', {data: rows, tournamentData: tournament_rows, organizerData: organizer_rows, playerData: player_rows});
                    })
                })
            })

        })
    });

    app.get('/playersRoster', function(req, res)              
    {
        // Define our queries
        let query1 = "SELECT character_player_plays_id, Players.username, Characters.character_name, Games.game_name FROM Characters_player_plays INNER JOIN Players ON Characters_player_plays.player_id = Players.player_id INNER JOIN Characters ON Characters_player_plays.character_id = Characters.character_id INNER JOIN Games ON Characters_player_plays.game_id = Games.game_id;"
        let query2 = "SELECT * FROM Players";
        let query3 = "SELECT * FROM Characters;";
        let query4 = "SELECT * FROM Games;";
        db.pool.query(query1, function (error, rows, fields)
        {
            db.pool.query(query2, function(error, player_rows, fields){
                db.pool.query(query3, function(error, character_rows, fields){
                    db.pool.query(query4, function(error, game_rows, fields){
                        res.render('playersRoster', {data: rows, playerData: player_rows, characterData: character_rows, gameData: game_rows});
                    })
                })
            })

        })
    });


    app.get('/organizers', function(req, res)              
    {
        // Define our queries
        let query1 = "SELECT organizer_id, first_name, last_name, username FROM Tournament_Organizers;"
        db.pool.query(query1, function (error, rows, fields)
        {
            res.render('organizers', {data: rows});
        })
    });

app.get('/players', function(req, res)              
    {
        // Define our queries
        let query1 = "SELECT * FROM Players;"
        db.pool.query(query1, function (error, rows, fields)
        {
            res.render('players', {data: rows});
        })
       
      
    });  

app.get('/', function(req, res)              
    {
        // Define our queries
        //let query1 = "SELECT * FROM Players;"
        //db.pool.query(query1, function (error, rows, fields)
        {
            res.render('index');
        }
       
      
    });                                         
    app.post('/add-player', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Capture NULL values
        let username = data.username
        
  
    
        // Create the query and run it on the database
        let query1 = `INSERT INTO Players (first_name, last_name, username) VALUES ('${data.first_name}', '${data.last_name}', '${data.username}');`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT
                let query2 = `SELECT * FROM Players;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });
    app.post('/add-tournament', function(req, res)
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body

        let query1 = `INSERT INTO Tournaments (tournament_name, date_of_tournament, is_online, location, prize_pool, organizer_id, game_id) VALUES ('${data.tournament_name}', '${data.date_of_tournament}', '${data.is_online}', '${data.location}', '${data.prize_pool}', '${data.organizer_id}', '${data.game_id}');`;
        db.pool.query(query1, function(error, rows, fields)
        {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                let query2 = 'SELECT tournament_id, tournament_name, date_of_tournament, is_online, location, prize_pool, Tournament_Organizers.username, Games.game_name FROM Tournaments INNER JOIN Tournament_Organizers ON Tournaments.organizer_id = Tournament_Organizers.organizer_id INNER JOIN Games ON Tournaments.game_id = Games.game_id; ';
                db.pool.query(query2, function(error, rows, fields)
                {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.send(rows)
                    }
                })
            }
        })
    });
app.post('/add-organizer', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    let query1 = `INSERT INTO Tournament_Organizers (first_name, last_name, username) VALUES ('${data.first_name}', '${data.last_name}', '${data.username}');`;
    db.pool.query(query1, function(error, rows, fields)
    {
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else{
            let query2 = 'SELECT organizer_id, first_name, last_name, username FROM Tournament_Organizers;';
            db.pool.query(query2, function(error, rows, fields)
            {
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.send(rows);
                }
            })
        }
    })
});
app.post('/add-player-roster', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    let query1 = `INSERT INTO Characters_player_plays (player_id, character_id, game_id) VALUES ('${data.player_id}', '${data.character_id}', '${data.game_id}');`;
    db.pool.query(query1, function(error, rows, fields)
    {
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else{
            let query2 = "SELECT character_player_plays_id, Players.username, Characters.character_name, Games.game_name FROM Characters_player_plays INNER JOIN Players ON Characters_player_plays.player_id = Players.player_id INNER JOIN Characters ON Characters_player_plays.character_id = Characters.character_id INNER JOIN Games ON Characters_player_plays.game_id = Games.game_id;";
            db.pool.query(query2, function(error, rows, fields)
            {
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-tournament-roster', function(req, res)
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    let query1 = `INSERT INTO Players_in_tournaments (tournament_id, organizer_id, player_id) VALUES ('${data.tournament_id}', '${data.organizer_id}', '${data.player_id}');`;
    db.pool.query(query1, function(error, rows, fields)
    {
        if (error){
            console.log(error);
            res.sendStatus(400);
        }
        else{
            let query2 = `SELECT tournament_entry_id, tournament_name, Tournament_Organizers.username AS organizer_name, Players.username FROM Players_in_tournaments 
            INNER JOIN Tournaments ON Players_in_tournaments.tournament_id = Tournaments.tournament_id 
            INNER JOIN Tournament_Organizers ON Players_in_tournaments.organizer_id = Tournament_Organizers.organizer_id 
            INNER JOIN Players ON Players_in_tournaments.player_id = Players.player_id;`;
            db.pool.query(query2, function(error, rows, fields)
            {
                if (error){
                    console.log(error);
                    res.sendStatus(400);
                }
                else{
                    res.send(rows);
                }
            })
        }
    })
});
    app.delete('/delete-player', function(req,res,next){
        let data = req.body;
        let player_id = parseInt(data.player_id);
        let deletePlayer_Char = `DELETE FROM Characters_player_plays WHERE player_id = ?`;
        let deletePlayer= `DELETE FROM Players WHERE player_id = ?`;
        let deletePlayer_Tourn = `DELETE FROM Players_in_tournaments WHERE player_id = ?`;
      
              // Run the 1st query
              if (!(isNaN(player_id)))
              {
                db.pool.query(deletePlayer_Tourn, [player_id], function(error, rows, fields)
                {
              db.pool.query(deletePlayer_Char, [player_id], function(error, rows, fields)
              {
                  if (error) {
      
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
                  }
      
                  else 
                  
                  {
                      // Run the second query
                      db.pool.query(deletePlayer, [player_id], function(error, rows, fields) {
      
                          if (error) {
                              console.log(error);
                              res.sendStatus(400);
                          } else {
                              res.sendStatus(204);
                          }
                      })
                  }
      })})}});

      app.delete('/delete-organizer', function(req, res, next){
        let data = req.body;
        let organizer_id = parseInt(data.organizer_id);
        let deleteOrganizer = `DELETE FROM Tournament_Organizers WHERE organizer_id = ?`

        db.pool.query(deleteOrganizer, [organizer_id], function(error, rows, fields)
        {
            if (error){
                console.log(error);
                res.sendStatus(400);
            }
            else{
                res.sendStatus(204);
            }
        })
      });

      app.delete('/delete-player-roster', function(req, res, next){
        let data = req.body;
        let character_player_plays_id = parseInt(data.character_player_plays_id);
        let deletePlayerRoster = `DELETE FROM Characters_player_plays WHERE character_player_plays_id = ?`

        db.pool.query(deletePlayerRoster, [character_player_plays_id], function(error, rows, fields)
        {
            if (error){
                console.log(error);
                res.sendStatus(400);
            }
            else{
                res.sendStatus(204);
            }
        })
      });

      app.delete('/delete-tournament-roster', function(req, res, next){
        let data = req.body;
        let tournament_entry_id = parseInt(data.tournament_entry_id);
        let deleteTournamentRoster = `DELETE FROM Players_in_tournaments WHERE tournament_entry_id = ?`

        db.pool.query(deleteTournamentRoster, [tournament_entry_id], function(error, rows, fields)
        {
            if (error){
                console.log(error);
                res.sendStatus(400);
            }
            else{
                res.sendStatus(204);
            }
        })
      });

      app.delete('/delete-tournament', function(req, res, next){
        let data = req.body;
        let tournamentID = parseInt(data.tournament_id);
        let deleteTournament = 'DELETE FROM Tournaments WHERE tournament_id = ?';
        let deletePlayers_in_Tournaments = 'DELETE FROM Players_in_tournaments WHERE tournament_id = ?';

        db.pool.query(deletePlayers_in_Tournaments, [tournamentID], function (error, rows, fields){
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                db.pool.query(deleteTournament, [tournamentID], function(error, rows, fields){
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.sendStatus(204);
                    }
                })
            }
        })
      });

      app.put('/put-player-ajax', function(req,res,next){
        let data = req.body;
      
        //let username = parseInt(data.username);
        let player = parseInt(data.fullname);
      
        let queryUpdatePlayer = `UPDATE Players SET username = ? WHERE player_id = ?;`
        let selectPlayer = `SELECT * FROM Players WHERE player_id = ?;`
      
              // Run the 1st query
              db.pool.query(queryUpdatePlayer, [data.username, player], function(error, rows, fields){
                  if (error) {
      
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
                  }
      
                  // If there was no error, we run our second query and return that data so we can use it to update the people's
                  // table on the front-end
                  else
                  {
                      // Run the second query
                      db.pool.query(selectPlayer, [player], function(error, rows, fields) {
      
                          if (error) {
                              console.log(error);
                              res.sendStatus(400);
                          } else {
                              res.send(rows);
                          }
                      })
                  }
      })});

      app.put('/put-organizer-ajax', function(req, res, next){
        let data = req.body;

        let username = data.username;
        let organizer_id = data.organizer_id;

        let queryUpdateUsername = `UPDATE Tournament_Organizers SET username = ? WHERE organizer_id = ?;`;
        let selectOrganizer = `SELECT * FROM Tournament_Organizers WHERE organizer_id = ?;`;

        db.pool.query(queryUpdateUsername, [username, organizer_id], function(error, rows, fields){
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            if(error){
                console.log(error);
                res.sendStatus(400);
            }
            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                db.pool.query(selectOrganizer, [organizer_id], function(error, rows, fields){
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
        })});

        app.put('/put-tournament-ajax', function(req, res, next){
            let data = req.body;
    
            let tournament_id = data.tournament_id;
            let date_of_tournament = data.date_of_tournament;
            let is_online = data.is_online;
            let location = data.location;
            let prize_pool = data.prize_pool;
            let organizer_id = data.organizer_id;
            let game_id = data.game_id;
    
            let queryUpdateTournament = `UPDATE Tournaments SET date_of_tournament = ?, is_online = ?, location = ?, prize_pool = ?, organizer_id = ?, game_id = ? WHERE tournament_id = ?`;
            let selectTournament = `SELECT tournament_id, tournament_name, date_of_tournament, is_online, location, prize_pool, username, game_name FROM Tournaments 
                                            INNER JOIN Tournament_Organizers ON Tournaments.organizer_id = Tournament_Organizers.organizer_id
                                            INNER JOIN Games ON Tournaments.game_id = Games.game_id
                                        WHERE tournament_id = ?;`;
    
            db.pool.query(queryUpdateTournament, [date_of_tournament, is_online, location, prize_pool, organizer_id, game_id, tournament_id], function(error, rows, fields){
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    db.pool.query(selectTournament, [tournament_id], function(error, rows, fields){
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
            })});

        app.put('/put-player-roster-ajax', function(req, res, next){
            let data = req.body;
    
            let character_id = data.character_id;
            let game_id = data.game_id;
            let player_roster_id = data.character_player_plays_id;
    
            let queryUpdatePlayerRoster = `UPDATE Characters_player_plays SET character_id = ?, game_id = ? WHERE character_player_plays_id = ?;`;
            let selectPlayerRoster = `SELECT 
                                            character_player_plays_id, 
                                            username, 
                                            character_name, 
                                            game_name 
                                        FROM Characters_player_plays 
                                            INNER JOIN Players ON Characters_player_plays.player_id = Players.player_id 
                                            INNER JOIN Characters ON Characters_player_plays.character_id = Characters.character_id 
                                            INNER JOIN Games ON Characters_player_plays.game_id = Games.game_id 
                                        WHERE character_player_plays_id = ?;`;
    
            db.pool.query(queryUpdatePlayerRoster, [character_id, game_id, player_roster_id], function(error, rows, fields){
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    db.pool.query(selectPlayerRoster, [player_roster_id], function(error, rows, fields){
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
            })});


        app.put('/put-game-ajax', function(req, res, next){
            let data = req.body;
    
            let gameName = data.gameName;
            let game_id = data.game_id;
    
            let queryUpdateGameName = `UPDATE Games SET game_name = ? WHERE game_id = ?;`;
            let selectGame = `SELECT * FROM Games WHERE game_id = ?;`;
    
            db.pool.query(queryUpdateGameName, [gameName, game_id], function(error, rows, fields){
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                if(error){
                    console.log(error);
                    res.sendStatus(400);
                }
                // If there was no error, we run our second query and return that data so we can use it to update the people's
                // table on the front-end
                else
                {
                    db.pool.query(selectGame, [game_id], function(error, rows, fields){
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.send(rows);
                        }
                    })
                }
            })});

            app.put('/put-character-ajax', function(req, res, next){
                let data = req.body;
        
                let legal = data.is_legal;
                let character_id = data.character_id;
        
                let queryUpdateCharacter = `UPDATE Characters SET is_legal = ? WHERE character_id = ?;`;
                let selectCharacter = `SELECT * FROM Characters WHERE character_id = ?;`;
        
                db.pool.query(queryUpdateCharacter, [legal, character_id], function(error, rows, fields){
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    if(error){
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If there was no error, we run our second query and return that data so we can use it to update the people's
                    // table on the front-end
                    else
                    {
                        db.pool.query(selectCharacter, [character_id], function(error, rows, fields){
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                res.send(rows);
                            }
                        })
                    }
                })});
      app.post('/add-game', function(req, res) 
      {
          // Capture the incoming data and parse it back to a JS object
          let data = req.body;
      
          let gameName = data.game_name;
    
      
          // Create the query and run it on the database
          query1 = `INSERT INTO Games (game_name) VALUES ('${gameName}');`;
          db.pool.query(query1, function(error, rows, fields){
      
              // Check to see if there was an error
              if (error) {
      
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error)
                  res.sendStatus(400);
              }
              else
              {
                  // If there was no error, perform a SELECT
                  query2 = `SELECT * FROM Games;`;
                  db.pool.query(query2, function(error, rows, fields){
      
                      // If there was an error on the second query, send a 400
                      if (error) {
                          
                          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                          console.log(error);
                          res.sendStatus(400);
                      }
                      // If all went well, send the results of the query back.
                      else
                      {
                          res.send(rows);
                      }
                  })
              }
          })
      });
  
      app.delete('/delete-game', function(req,res,next){
          let data = req.body;
          let game_id = parseInt(data.game_id);
          let deleteGame_Char = `DELETE FROM Characters_player_plays WHERE game_id = ?`;
          let deleteGame= `DELETE FROM Games WHERE game_id = ?`;
          let deleteGame_Tourn = `DELETE FROM Tournaments WHERE game_id = ?`;
        
                // Run the 1st query
                if (!(isNaN(game_id)))
                {
                  db.pool.query(deleteGame_Tourn, [game_id], function(error, rows, fields)
                  {
                db.pool.query(deleteGame_Char, [game_id], function(error, rows, fields)
                {
                    if (error) {
        
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                    }
        
                    else 
                    
                    {
                        // Run the second query
                        db.pool.query(deleteGame, [game_id ], function(error, rows, fields) {
        
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                res.sendStatus(204);
                            }
                        })
                    }
        })})}});
        app.post('/add-character', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Capture NULL values
        //let username = data.username
        
  
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Characters (character_name, is_legal, game_id) VALUES ('${data.character_name}', '${data.is_legal}', '${data.character_game}');`;
        db.pool.query(query1, function(error, rows, fields){
    
            // Check to see if there was an error
            if (error) {
    
                // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT
                query2 = `SELECT character_id, character_name, is_legal, Games.game_name FROM Characters INNER JOIN Games ON Characters.game_id = Games.game_id;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    // If there was an error on the second query, send a 400
                    if (error) {
                        
                        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                        console.log(error);
                        res.sendStatus(400);
                    }
                    // If all went well, send the results of the query back.
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });
    app.delete('/delete-character', function(req,res,next){
        let data = req.body;
        let character_id = parseInt(data.character_id);
        let deletePlayer_Char = `DELETE FROM Characters_player_plays WHERE character_id = ?`;
        let deleteCharacter= `DELETE FROM Characters WHERE character_id = ?`;
    
      
              // Run the 1st query
              if (!(isNaN(character_id)))
              {
                
              db.pool.query(deletePlayer_Char, [character_id], function(error, rows, fields)
              {
                  if (error) {
      
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
                  }
      
                  else 
                  
                  {
                      // Run the second query
                      db.pool.query(deleteCharacter, [character_id], function(error, rows, fields) {
      
                          if (error) {
                              console.log(error);
                              res.sendStatus(400);
                          } else {
                              res.sendStatus(204);
                          }
                      })
                  }
      })}});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
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
        let query1 = "SELECT * FROM Characters;";
        let query2 = "SELECT * FROM Games;";
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
        //let query1 = "SELECT * FROM Players;"
        //db.pool.query(query1, function (error, rows, fields)
        {
            res.render('tournamentsRoster');
        }
    });

    app.get('/playersRoster', function(req, res)              
    {
        // Define our queries
        //let query1 = "SELECT * FROM Players;"
        //db.pool.query(query1, function (error, rows, fields)
        {
            res.render('playersRoster');
        }
    });


    app.get('/organizers', function(req, res)              
    {
        // Define our queries
        let query1 = "SELECT * FROM Tournament_Organizers;"
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
        query1 = `INSERT INTO Players (first_name, last_name, username) VALUES ('${data.first_name}', '${data.last_name}', '${data.username}');`;
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
                query2 = `SELECT * FROM Players;`;
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

        query1 = `INSERT INTO Tournaments (tournament_name, date_of_tournament, is_online, location, prize_pool, organizer_id, game_id) VALUES ('${data.tournament_name}', '${data.date_of_tournament}', '${data.is_online}', '${data.location}', '${data.prize_pool}', '${data.organizer_id}', '${data.game_id}');`;
        db.pool.query(query1, function(error, rows, fields)
        {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            }
            else
            {
                query2 = 'SELECT tournament_id, tournament_name, date_of_tournament, is_online, location, prize_pool, Tournament_Organizers.username, Games.game_name FROM Tournaments INNER JOIN Tournament_Organizers ON Tournaments.organizer_id = Tournament_Organizers.organizer_id INNER JOIN Games ON Tournaments.game_id = Games.game_id; ';
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
    })

    app.delete('/delete-player', function(req,res,next){
        let data = req.body;
        let playerID = parseInt(data.playerID);
        let deletePlayer_Char = `DELETE FROM Characters_player_plays WHERE playerID = ?`;
        let deletePlayer= `DELETE FROM Players WHERE playerID = ?`;
        let deletePlayer_Tourn = `DELETE FROM Players_in_tournaments WHERE playerID = ?`;
      
              // Run the 1st query
              if (!(isNaN(playerID)))
              {
                db.pool.query(deletePlayer_Tourn, [playerID], function(error, rows, fields)
                {
              db.pool.query(deletePlayer_Char, [playerID], function(error, rows, fields)
              {
                  if (error) {
      
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
                  }
      
                  else 
                  
                  {
                      // Run the second query
                      db.pool.query(deletePlayer, [playerID], function(error, rows, fields) {
      
                          if (error) {
                              console.log(error);
                              res.sendStatus(400);
                          } else {
                              res.sendStatus(204);
                          }
                      })
                  }
      })})}});

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
      
        let queryUpdatePlayer = `UPDATE Players SET username = ? WHERE playerID = ?;`
        let selectPlayer = `SELECT * FROM Players WHERE playerID = ?;`
      
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
                      db.pool.query(selectPlayer, [data.username], function(error, rows, fields) {
      
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
          let gameID = parseInt(data.gameID);
          let deleteGame_Char = `DELETE FROM Characters_player_plays WHERE gameID = ?`;
          let deleteGame= `DELETE FROM Games WHERE gameID = ?`;
          let deleteGame_Tourn = `DELETE FROM Tournaments WHERE gameID = ?`;
        
                // Run the 1st query
                if (!(isNaN(gameID)))
                {
                  db.pool.query(deleteGame_Tourn, [gameID], function(error, rows, fields)
                  {
                db.pool.query(deleteGame_Char, [gameID], function(error, rows, fields)
                {
                    if (error) {
        
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                    }
        
                    else 
                    
                    {
                        // Run the second query
                        db.pool.query(deleteGame, [gameID], function(error, rows, fields) {
        
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                res.sendStatus(204);
                            }
                        })
                    }
        })})}});
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
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
    })});
app.get('/tournaments', function(req, res)              
    {
        // Define our queries
        //let query1 = "SELECT * FROM Players;"
        //db.pool.query(query1, function (error, rows, fields)
        {
            res.render('tournaments');
        }
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
        //let query1 = "SELECT * FROM Players;"
        //db.pool.query(query1, function (error, rows, fields)
        {
            res.render('organizers');
        }
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
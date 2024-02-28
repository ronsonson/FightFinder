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
app.get('/', function(req, res)              
    {
        // Define our queries
        let query1 = "SELECT * FROM Players;"
        db.pool.query(query1, function (error, rows, fields)
        {
            res.render('index', {data: rows});
        })
       
      
    });                                         
    app.post('/add-player', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        // Capture NULL values
    
    
  
    
        // Create the query and run it on the database
        query1 = `INSERT INTO Players (first_name, last_name, username) VALUES ('${data.first_name}', '${data.last_name}', ${data.username})`;
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



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
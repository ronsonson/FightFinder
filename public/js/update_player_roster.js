// Get the objects we need to modify
let updatePlayerRosterForm = document.getElementById('update-player-roster');

// Modify the objects we need
updatePlayerRosterForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("update-player-roster-id");
    let inputCharacterID = document.getElementById("update-character-id");
    let inputGameID = document.getElementById("update-game-id");

    // Get the values from the form fields
    let idValue = inputID.value;
    let characterIDValue = inputCharacterID.value;
    let gameIDValue = inputGameID.value;
    


    // Put our data we want to send in a javascript object
    let data = {
        character_player_plays_id: idValue,
        character_id: characterIDValue,
        game_id: gameIDValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-player-roster-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, idValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, playerRosterID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("player-roster-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == playerRosterID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let character_cell = updateRowIndex.getElementsByTagName("td")[2];
            let game_cell = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            character_cell.innerHTML = parsedData[0].character_name; 
            game_cell.innerHTML = parsedData[0].game_name;
       }
    }
}
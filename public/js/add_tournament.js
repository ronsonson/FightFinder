// Get the objects we need to modify
let addTournamentForm = document.getElementById('add-tournament');

// Modify the objects we need
addTournamentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    
    let inputTournamentName = document.getElementById("input-tname");
    let inputTournamentDate = document.getElementById("input-tdate");
    let inputIsOnline = document.getElementById("input-is-online");
    let inputLocation = document.getElementById("input-location");
    let inputPrizePool = document.getElementById("input-prize-pool");
    let inputOrganizer = document.getElementById("input-organizer-ajax");
    let inputGame = document.getElementById("input-game-ajax");
    

    // Get the values from the form fields
    
    let tournamentNameValue = inputTournamentName.value;
    let tournamentDateValue = inputTournamentDate.value;
    let isOnlineValue = inputIsOnline.value;
    let locationValue = inputLocation.value;
    let prizePoolValue = inputPrizePool.value;
    let organizerValue = inputOrganizer.value;
    let gameValue = inputGame.value;
    

    // Put our data we want to send in a javascript object
    let data = {   
        tournament_name: tournamentNameValue,
        date_of_tournament: tournamentDateValue,
        is_online: isOnlineValue,
        location: locationValue,
        prize_pool: prizePoolValue,
        organizer_id: organizerValue,
        game_id: gameValue
    }
    
    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-tournament", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTournamentName.value = '';
            inputTournamentDate.value = '';
            inputIsOnline.value = '';
            inputLocation.value = '';
            inputPrizePool.value = '';
            inputOrganizer.value = '';
            inputGame.value = '';
            
            
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("tournaments-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let tournamentNameCell = document.createElement("TD");
    let tournamentDateCell = document.createElement("TD");
    let isOnlineCell = document.createElement("TD");
    let tournamentLocationCell = document.createElement("TD");
    let prizePoolCell = document.createElement("TD");
    let organizerUsernameCell = document.createElement("TD");
    let gameNameCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.tournament_id;
    tournamentNameCell.innerText = newRow.tournament_name;
    tournamentDateCell.innerText = newRow.date_of_tournament;
    isOnlineCell.innerText = newRow.is_online;
    tournamentLocationCell.innerText = newRow.location;
    prizePoolCell.innerText = newRow.prize_pool;
    organizerUsernameCell.innerText = newRow.username;
    gameNameCell.innerText = newRow.game_name;
    
   
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteTournament(newRow.tournament_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(tournamentNameCell);
    row.appendChild(tournamentDateCell);
    row.appendChild(isOnlineCell);
    row.appendChild(tournamentLocationCell);
    row.appendChild(prizePoolCell);
    row.appendChild(organizerUsernameCell);
    row.appendChild(gameNameCell);
    row.appendChild(deleteCell);
    
    row.setAttribute('data-value', newRow.tournament_id);
    // Add the row to the table
    currentTable.appendChild(row);
}
// Get the objects we need to modify
let addTournamentRosterForm = document.getElementById('add-tournament-roster');

// Modify the objects we need
addTournamentRosterForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTournamentID = document.getElementById("input-tournament-ajax");
    let inputOrganizerID = document.getElementById("input-organizer-ajax");
    let inputPlayerID = document.getElementById("input-player-ajax");

    

    // Get the values from the form fields
    let tournamentIDValue = inputTournamentID.value;
    let organizerIDValue = inputOrganizerID.value;
    let playerIDValue = inputPlayerID.value;

    

    // Put our data we want to send in a javascript object
    let data = {
        tournament_id: tournamentIDValue,
        organizer_id: organizerIDValue,
        player_id: playerIDValue    
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-tournament-roster", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTournamentID.value = '';
            inputOrganizerID.value = '';
            inputPlayerID = '';
            
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
    let currentTable = document.getElementById("tournament-roster-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let tournamentCell = document.createElement("TD");
    let organizerCell = document.createElement("TD");
    let playerCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.tournament_entry_id;
    tournamentCell.innerText = newRow.tournament_name;
    organizerCell.innerText = newRow.organizer_name;
    playerCell.innerText = newRow.username;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteTournamentRoster(newRow.tournament_entry_id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(tournamentCell);
    row.appendChild(organizerCell);
    row.appendChild(playerCell);
    row.appendChild(deleteCell);
    
    row.setAttribute('data-value', newRow.tournament_entry_id);
    // Add the row to the table
    currentTable.appendChild(row);

}
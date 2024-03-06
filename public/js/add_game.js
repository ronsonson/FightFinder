// Get the objects we need to modify
let addGameForm = document.getElementById('add-game');

// Modify the objects we need
addGameForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    
    let inputGameName = document.getElementById("input-game_name");
    

    // Get the values from the form fields
    
    let gameNameValue = inputGameName.value;
    

    // Put our data we want to send in a javascript object
    let data = {   
        game_name: gameNameValue 
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-game", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputGameName.value = '';
            
            
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
    let currentTable = document.getElementById("games-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let gameNameCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.gameID;
    gameNameCell.innerText = newRow.game_name;
   
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteGame(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(gameNameCell);
    row.appendChild(deleteCell);
    
    row.setAttribute('data-value', newRow.id);
    // Add the row to the table
    currentTable.appendChild(row);
}
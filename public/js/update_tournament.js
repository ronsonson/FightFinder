
// Get the objects we need to modify
let updateTournamentForm = document.getElementById('update-tournament');

// Modify the objects we need
updateTournamentForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTournamentID = document.getElementById("update-tname-ajax");
    let inputDate = document.getElementById("update-tdate");
    let inputOnline = document.getElementById("update-is-online");
    let inputLocation = document.getElementById("update-location");
    let inputPrizePool = document.getElementById("update-prize-pool");
    let inputOrganizerID = document.getElementById("update-organizer-ajax");
    let inputGameID = document.getElementById("update-game-ajax");

    // Get the values from the form fields
    let tournamentIDValue = inputTournamentID.value;
    let dateValue = inputDate.value;
    let onlineValue = inputOnline.value;
    let locationValue = inputLocation.value;
    let prizePoolValue = inputPrizePool.value;
    let organizerIDValue = inputOrganizerID.value;
    let gameIDValue = inputGameID.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld




    // Put our data we want to send in a javascript object
    let data = {
        tournament_id: tournamentIDValue,
        date_of_tournament: dateValue,
        is_online: onlineValue,
        location: locationValue,
        prize_pool: prizePoolValue,
        organizer_id: organizerIDValue,
        game_id: gameIDValue,
    }
    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-tournament-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, tournamentIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, tournament_id){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("tournaments-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == tournament_id) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of username value
            let date = updateRowIndex.getElementsByTagName("td")[2];
            let is_online = updateRowIndex.getElementsByTagName("td")[3];
            let location = updateRowIndex.getElementsByTagName("td")[4];
            let prize_pool = updateRowIndex.getElementsByTagName("td")[5];
            let organizer = updateRowIndex.getElementsByTagName("td")[6];
            let game = updateRowIndex.getElementsByTagName("td")[7];

            // Reassign homeworld to our value we updated to
            date.innerHTML = parsedData[0].date_of_tournament;
            is_online.innerHTML = parsedData[0].is_online; 
            location.innerHTML = parsedData[0].location; 
            prize_pool.innerHTML = parsedData[0].prize_pool; 
            organizer.innerHTML = parsedData[0].username; 
            game.innerHTML = parsedData[0].game_name;  
       }
    }
}

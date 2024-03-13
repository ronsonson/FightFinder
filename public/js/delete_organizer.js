function deleteOrganizer(organizer_id) {
    // Put our data we want to send in a javascript object
   
    let data = {
        organizer_id: organizer_id
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-organizer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(organizer_id);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(organizer_id){
    
    let table = document.getElementById("organizers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == organizer_id) {
            table.deleteRow(i);
            deleteDropDownMenu(organizer_id);
            break;
       }
    }
}

function deleteDropDownMenu(personID){
    let selectMenu = document.getElementById("mySelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(organizer_id)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }
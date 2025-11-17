/*
Movie Name: No validation, but check for null
Age Rating: Accept only values from dropdown, but check for null
Movie Rating: Only 1-10, must be float of 0.1 (rounds up if 2 d.p or more), check for null
Genre: Same like age rating
Movie Duration: No negative or 0 minute movies, check for null, and must be integer
Year: Only from this year (2025) to 1970, check for null, and must be integer
Description: No validation, but check for null
Movie Image: Any image type actually (so gif, jpg, png, jpeg, etc.)
*/

//remove initial values from dropdown menu
function removeValue() {
    document.getElementById(`forminput2`).value = ""
    document.getElementById(`forminput4`).value = ""
}

//check if user uploaded an image
const fileUploaded = document.getElementById("forminput8");

fileUploaded.addEventListener('change', () => {
    const file = fileUploaded.files[0];
    if (file.type.startsWith('image/')) {
        document.querySelector(".Image").src = "./images/image_received.png"
        document.getElementById("imageurl").innerHTML = `${file.name}`
    } else {
        alert("Please upload an image!");
        fileUploaded.value = "";
    }
});

function submitNewReview() {
    var response = "";
    // Create an object to hold form data
    var jsonData = new Object();
    jsonData.Title = document.getElementById("forminput1").value;
    jsonData.Age_Rating = document.getElementById("forminput2").value;
    jsonData.Movie_Rating = document.getElementById("forminput3").value;
    jsonData.Genre = document.getElementById("forminput4").value;
    jsonData.Duration = document.getElementById("forminput5").value;
    jsonData.Year = document.getElementById("forminput6").value;
    jsonData.Description = document.getElementById("forminput7").value;
    jsonData.Image = document.getElementById("forminput8").value;
    // Validate required fields (all must be filled in)
    if (jsonData.Title == "" || jsonData.Age_Rating == "" || jsonData.Movie_Rating == "" || jsonData.Genre == "" || jsonData.Duration == "" || jsonData.Year == "" || jsonData.Description == "" || jsonData.Image == "") {
        alert('All fields are required to have a value!');
        return; // Stop execution if validation fails
    }
    if (jsonData.Movie_Rating < 1 || jsonData.Movie_Rating > 10) {
        alert('Movie Rating must be around 1-10!');
        return; // Stop execution if validation fails
    } else {
        jsonData.Movie_Rating = Math.round(jsonData.Movie_Rating * 10) / 10;
    }
    jsonData.Duration = Number(jsonData.Duration) // makes sure duration is number
    if (!Number.isInteger(jsonData.Duration)) { // edited logic
        alert('Movie Duration must be integer!');
        return; // Stop execution if validation fails
    } else if (jsonData.Duration <= 0) {
        alert('Movie Duration cannot be negative or zero minutes!');
        return; // Stop execution if validation fails
    }
    jsonData.Year = Number(jsonData.Year) // makes sure year is number
    if (!Number.isInteger(jsonData.Year)) { // edited logic
        alert('Movie Year must be integer!');
        return; // Stop execution if validation fails
    } else if (jsonData.Year < 1970 || jsonData.Year > 2025) {
        alert('Movie Year must be between 1970 - 2025!');
        return; // Stop execution if validation fails
    }
    // Configure the request to POST data to /add-movie-review
    var request = new XMLHttpRequest();
    request.open("POST", "/add-movie-review", true);
    request.setRequestHeader('Content-Type', 'application/json');
    // Define what happens when the server responds
    request.onload = function () {
        response = JSON.parse(request.responseText); // Parse JSON response
        // If no error message is returned → success
        if (response.message == undefined) {
            alert('Added ' + jsonData.Title + ' as a new movie review!');
            // Clear form fields after success
            for (i = 1; i <= 8; i++) {
                document.getElementById(`forminput${i}`).value = ""
            }
            document.querySelector(".Image").src = "./images/upload_image.png"
            document.getElementById("imageurl").innerHTML = `Upload Image`
        } else {
            // Show error if resource could not be added
            alert(`Unable to add movie review!\nReason: ${response.message}`);
            return; // Stop execution if validation fails
        }
    };
    // Send the request with JSON-formatted data
    request.send(JSON.stringify(jsonData));
}

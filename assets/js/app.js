$(document).ready(function(){
    var config = {
        apiKey: "AIzaSyDMKZdeRfwGsXvP_b9zLLvqIqdp3DlwHuY",
        authDomain: "trains-1440b.firebaseapp.com",
        databaseURL: "https://trains-1440b.firebaseio.com/",
        projectId: "trains-1440b",
        storageBucket: "trains-1440b.appspot.com",
    };
    firebase.initializeApp(config);

    // Reference firebase database
    var database = firebase.database();

    // Train information variables
    var name;
    var destination;
    var firstTrain;
    var frequency = 0;

    $("#add-train").on("click", function() {
        event.preventDefault();
        // Set train information variables to user input
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        // Push the information to the firebase database and reset form
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $("form")[0].reset();
    });


    //Use Moment.js to calculate the next arrival time given the first departure time and frequency time
  
    database.ref().on("child_added", function(childSnapshot) {
        var minsAway;
        // Change year so first train time comes before the current time
        var firstTrainNew = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");

        // Difference between the current time and firstTrain time
        var diffTime = moment().diff(moment(firstTrainNew), "minutes");
        var tRemainder = diffTime % childSnapshot.val().frequency;

        // Minutes until next train
        var minsAway = childSnapshot.val().frequency - tRemainder;

        // Next train time
        var nextTrain = moment().add(minsAway, "minutes");
        nextTrain = moment(nextTrain).format("hh:mm");

        $("#train-display").append("<tr><td>" + childSnapshot.val().name +
                "</td><td>" + childSnapshot.val().destination +
                "</td><td>" + childSnapshot.val().frequency +
                "</td><td>" + nextTrain + 
                "</td><td>" + minsAway + "</td></tr>");

    });
});
//**********************************************************************
//* By using firebase and moment.js, this train scheduler allows the   *
//* user to add initial departure times and frequency of the train and *
//* using moment.js calculates when the next departure time is and how *
//* many minutes until the train leaves. Train information is pushed   *
//* firebase and retains information even if the user exits the page.  *
//**********************************************************************
$(document).ready(function() {

// initialize firebase
    var config = {
        apiKey: "AIzaSyBtF0LunIbIEM3r7yduYVAdHMzDiKaagzk",
        authDomain: "trainscheduler-f6fd1.firebaseapp.com",
        databaseURL: "https://trainscheduler-f6fd1.firebaseio.com",
        projectId: "trainscheduler-f6fd1",
        storageBucket: "trainscheduler-f6fd1.appspot.com",
        messagingSenderId: "284621328349"
    };
  firebase.initializeApp(config);
  var database = firebase.database();  

  // This function is called when the user fills in the train information and clicks submit
  $("#submit").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();

    
    name = $("#name").val().trim();
    destination = $("#destination").val().trim();
    time = $("#time").val().trim();
    frequency = $("#freq").val().trim();
    

    // This pushes a new train to the database and sets the users inputs to a train in the data base
    var pushRef = database.ref('/trains').push();
        pushRef.set({
            name : name,
            destination : destination,
            time : time,
            frequency : frequency

        });
    });

    // This listens for a child to be added to the database table '/trains'
    database.ref('/trains').on("child_added", function(snapshot) {

        // // Log everything that's coming out of snapshot
        // console.log(snapshot.val().name);
        // console.log(snapshot.val().destination);
        // console.log(snapshot.val().time);
        // console.log(snapshot.val().frequency);
    
        var train = snapshot.val();
    
        
        var name = train.name;
        var destination = train.destination;
        var firstTime = train.time;
        var frequency = parseInt(train.frequency);

        // Makes sure the first train comes before the current time
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        // console.log(firstTimeConverted);

        // Calculates the difference between now and the first time leaving
        var diff = moment().diff(moment(firstTimeConverted), "minutes");
        // console.log(diff);
       
        // Gets the remainder of the difference of time since first departure and frequency
        var diffMod = diff % frequency;
        // console.log(diffMod)

        
        var minutesUntil = frequency - diffMod;
        // console.log(minutesUntil)


        var nextTrain = moment().add(minutesUntil, "minutes");
        // console.log(moment(nextTrain).format("HH:mm"));

        // Creates a new row and then adds a td element for each train info
        var tbl = $("<tr>");
        var attributes = [name, destination, frequency, moment(nextTrain).format('h:mm a'), minutesUntil];

        for(var i = 0; i < 5; i++) {
            tbl.append('<td class="table-info">' + attributes[i] + '</td>');
    
        }
    
        // Appends the new row to the table
        $("#row").append(tbl);
    
    
        // Handle the errors
      }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });

});
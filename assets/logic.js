$( document ).ready(function() {

  var config = {
    apiKey: "AIzaSyDoJZ1ElCj9JA1F8aWd5EnIv9_FddOgLyg",
    authDomain: "train-scheduler-b1ec5.firebaseio.com",
    databaseURL: "https://train-scheduler-b1ec5.firebaseio.com/",
    projectId: "train-scheduler-b1ec5",
    storageBucket: "train-scheduler-b1ec5.appspot.com",
    messagingSenderId: "1091521198933"
  };
  
  firebase.initializeApp(config);


 var database = firebase.database();


$("#trainInfoBtn").on("click", function(event) {
	event.preventDefault(); 

	
	var trainName = $("#name").val().trim();
	var destination = $("#dest").val().trim();

	
	var firstTime = moment($("#firstTime").val().trim(), "hh:mm").subtract(1, "years").format("X");

	var frequency = $("#freq").val().trim();
	
	var currentTime = moment();
	console.log("CURRENT TIME: " +  moment(currentTime).format("hh:mm"));

	 
	var newTrain = {

		train: trainName,
		trainGoing: destination,
		trainComing: firstTime,
		everyXMin: frequency
	};


	database.ref().push(newTrain);
	
	$("#name").val("");
	$("#dest").val("");
	$("#firstTime").val("");
	$("#freq").val("");

	//supposed to prevent from moving to a new page... how?
	return false;

}); 


database.ref().on("child_added", function(childSnapshot, prevChildKey) { 

		console.log(childSnapshot.val());

		var trainName = childSnapshot.val().train;
		var destination =childSnapshot.val().trainGoing;
		var firstTime = childSnapshot.val().trainComing;
		var frequency = childSnapshot.val().everyXMin;


		var trainTime = moment.unix(firstTime).format("hh:mm");
		
		var difference =  moment().diff(moment(trainTime),"minutes");

		
		var trainRemain = difference % frequency;


		var minUntil = frequency - trainRemain;


		var nextArrival = moment().add(minUntil, "minutes").format('hh:mm');

		 
		$("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minUntil + "</td></tr>");

});
});
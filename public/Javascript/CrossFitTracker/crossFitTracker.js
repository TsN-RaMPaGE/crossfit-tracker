/**
 *
 */

// Globals
//var content = $("#contentContainer");
var workoutTypes = {'1' : 'AMRAP', '2' : 'Time', '3' : 'Max', '4' : 'Tabata'};
var exerciseFields = ['Name:', 'Weight:', 'Reps:', 'Features:'];

function CFTrackerHome(container) {

  content = $(container);
	content.html('<div id="calendarContainer"></div>');
	$('#calendarContainer').html('<div id="calendar"></div>');
	$('#calendar').fullCalendar({
        // Options and Callbacks
        height: 450,

        dayClick: function(date, allDay, jsEvent, view ) {

        	// TODO:Perform AJAX call to get work out data
        	var workoutData = getDateWorkout(date);

        	initializeCFTrackerWorkout(workoutData);
        }
	});
}

function initializeCFTrackerWorkout(workoutData) {
	$('#calendarContainer').remove();

	var dataDisplayerOptions = {
		addButtonText : 'Add Workout',
		defaultInnerTitle : 'Exercise',
		defaultTitle : 'Workout',
		inputTitles : exerciseFields,
		primaryColor:'#0099ff',
		//primaryColor: '#666666',
		smallAddButtonText: 'Add Exercise',
	};

	// Initialize dataDisplayer
	var dataDisplayer = content.dataDisplayer(dataDisplayerOptions);

	// Add a dataBox for each workout
	var workouts = workoutData;
	$.each(workouts, function(i, workout) {
		content.dataDisplayer('addDataBox',i);

		// Add custom components to workout
		initializeWorkout(i, workout.selectOption);

		// Add an innerDatabox for each exercise
		$.each(workouts[i].items, function(j, exercise) {
			content.dataDisplayer('addInnerDataBox', i, j);

			// Create an array to hold exercise data
			var exerciseData = new Array();
			$.each(exerciseFields, function(k, field) {
				exerciseData.push({name: field, value: exercise['field'+k]});
			});

			// Populate innerDataBox with exerciseData
			content.dataDisplayer('populateInnerDataBox', i, j, exerciseData);

			// Set the name of the exercise to reflect its attributes
			var exerciseName = exercise['field2'] + ' ' + exercise['field0'] + ' at ' + exercise['field1'] + 'lbs' ;
			content.dataDisplayer('setInnerTitleBarText', i, j, exerciseName);

			// Add custom components to exercise
			initializeExercise(i, j);

			//Toggle all innerDataBoxes closed
			content.dataDisplayer('toggleInnerDataBox',i,j);
		});

		// Add header/footer depending on what type of workout it is
		if(workout.selectOption == 'AMRAP') {
			createAmrapDataBox(i);
		} else if(workout.selectOption == 'Time') {
			createTimeDataBox(i);
		} else if(workout.selectOption == 'Tabata') {
			createTabataDataBox(i);
		}

		// Toggle all dataBoxes closed except for the first one
		if(i != 0) {
			content.dataDisplayer('toggleDataBox',i);
		}
	});

	// Add a selector box with the workout types to each workout dataBox when the "Add Workout" button is pressed
	dataDisplayer.bind('click-bigAddButton', function(e) {
		var workoutIndex = content.dataDisplayer('getNextDataBoxIndex');

		// Add custom components to workout
		initializeWorkout(workoutIndex);

		// Add default header/footer
		createAmrapDataBox(workoutIndex);
	});

// TODO: Need this?
/*
	dataDisplayer.bind('click-smallAddButton', function(e) {
		var dataBoxIndex = content.dataDisplayer('getCurrentDataBoxIndex', $(event.target));
    alert(dataBoxIndex);
		var innerDataBoxIndex = content.dataDisplayer('getNextInnerDataBoxIndex', dataBoxIndex);

		// Add custom components to exercise
		initializeExercise(dataBoxIndex, innerDataBoxIndex);
	});*/

	// Change the title of the exercise when data is entered to the exercise fields
	dataDisplayer.bind('change-innerDataBoxField', function(e, dataBoxIndex, innerDataBoxIndex, name, value) {

		// Get innerDataBox data to construct string
		var innerData = content.dataDisplayer('getInnerDataBoxData', dataBoxIndex, innerDataBoxIndex);

		// Construct string depending on the innerDataBox data and the field that is being changed
		var exerciseTitle = constructExerciseTitle(name, value, innerData, innerDataBoxIndex);

		content.dataDisplayer('setInnerTitleBarText', dataBoxIndex, innerDataBoxIndex, exerciseTitle);
	});
};

/**************************************************************************************************/
function getDateWorkout(date) {


	/*exercise = {
		name,
		weight,
		reps,
		features
	}*/

	// TODO: create function that would convert an "exercise"(any) array into an innerDataBox
	// array with field0, field1, field2, field3

	// TEST DATA
	var exercise1 = {
		field0 : 'Front Squat',
		field1 : 95,
		field2 : 10,
		field3 : ''
	};
	var exercise2 = {
		field0 : 'Overhead Squat',
		field1 : 95,
		field2 : 5,
		field3 : ''
	};
	var exercise3 = {
		field0 : 'Kettlebell Swings',
		field1 : 35,
		field2 : 21,
		field3 : 'American'
	};

	var exercise4 = {
		field0 : 'Kettlebell Swings',
		field1 : 35,
		field2 : 21,
		field3 : 'Russian'
	};

	// TODO: create function that converts a "workout" (any) array into a dataBox array with selectOption, items, and footerInput

	var workout1 = {
		name : 'Trent',
		selectOption : 'AMRAP',
		items : [exercise1, exercise2],
		footerInput:100
	};

	var workout2 = {
		name : 'Fran',
		selectOption : 'Tabata',
		items : [exercise1],
		footerInput : 185
	};

	var workout3 = {
		name : '',
		selectOption : 'Time',
		items : [exercise1, exercise2, exercise3, exercise4],
		footerInput : 250
	};

	return new Array(workout1, workout2, workout3);
};

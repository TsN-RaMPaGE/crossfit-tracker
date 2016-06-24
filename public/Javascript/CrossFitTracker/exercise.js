/**
 * Contains methods relating to the exercise level of CrossFitTracker
 *
*/
//Sets custom elements for all innerDataBoxes
function initializeExercise(dataBoxIndex, innerDataBoxIndex) {

	// Add "Edit Exercise" functionality
	addEditExerciseFunctionality(dataBoxIndex, innerDataBoxIndex);

	// Set listeners for double click on each exercise field
	var exercise = content.dataDisplayer('getInnerDataBox', dataBoxIndex, innerDataBoxIndex);
	var exerciseFieldNames = exercise.find('.inputTitleText');
	$.each(exerciseFieldNames, function(fieldIndex, exerciseFieldName) {
		var inputContainer = $(exerciseFieldName).parent();
		var exerciseFieldInputContainer = inputContainer.find('.inputFieldContainer');

		// Add units after input field
		var units = $('<p class="unitsText"></p>');
		units.appendTo(inputContainer);

		if(fieldIndex == 1) {
			// Add double click edit functionality
			addEditExerciseInputFunctionality(exerciseFieldName, fieldIndex);

			// Set width of field1 input
			exerciseFieldInputContainer.css('width','10%');

			// Set units after input field
			units.text('lbs');
		} else if(fieldIndex == 2) {
			// Add double click edit functionality
			addEditExerciseInputFunctionality(exerciseFieldName, fieldIndex);

			// Set width of field1 input
			exerciseFieldInputContainer.css('width','8%');
		}
	});

	// Check RX workout
	checkRxWorkout(exercise.parent());
};

// Adds "Edit Exercise" functionality
function addEditExerciseFunctionality(workoutIndex, exerciseIndex) {
	var exercise = content.dataDisplayer('getInnerDataBox', workoutIndex, exerciseIndex);
	var innerContainer = exercise.parent();
	var exerciseTitleBar = exercise.find('.smallButton');
	var exerciseTitle = exerciseTitleBar.children('.smallButtonText');
	exerciseTitle.removeClass('leftCenterAlignment');
	exerciseTitle.css('padding-top','1%');

	// Set delete image
	var deleteButton = $('<img class="smallDeleteImage" src="images/CrossFitTracker/erase.png"/>');
	exerciseTitle.before(deleteButton);

	// Set RX image
	var rxButton = $('<img class="smallRxImage" src="images/CrossFitTracker/rx.png"/>');
	rxButton.appendTo(exerciseTitleBar);

	// Add Listener for delete button
	deleteButton.on('mousedown', function() {
		var id = workoutIndex + '-' + exerciseIndex;
		$.prompt('Are you sure you want to delete the exercise?', {
			buttons: { "Yes": true, "No": false },
			position: { container: '#innerTitleBar'+id, x: 25, y: -5, width: 300, arrow: 'lt' },
			submit: function(event, answer, message, form) {
				// If the user chooses yes delete the exercise
				if(answer == true) {
					// Call dataDisplayer to delete innerDataBox at workoutIndex
					content.dataDisplayer('deleteInnerDataBox', workoutIndex, exerciseIndex);

					// Check if workout is RX after deleting exercise
					checkRxWorkout(innerContainer);
				}
			}
		});

		// Prevent toggle of workout dataBox when delete button is pressed
		event.stopPropagation();
	});

	// Change to selected RX image when rxbutton is pressed
	rxButton.click(function() {
		// Toggle the rx button
		if(rxButton.hasClass('selected')) {
			rxButton.attr('src','images/CrossFitTracker/rx.png');
			rxButton.removeClass('selected');
		} else {
			rxButton.attr('src','images/CrossFitTracker/rxSelected.png');
			rxButton.addClass('selected');
		}

		// Check if workout is RX after selecting RX for exercise
		checkRxWorkout(innerContainer);

		event.stopPropagation();
	});

	event.stopPropagation();
};

// Adds "Edit Exercise Input" functionality to an exercise field
function addEditExerciseInputFunctionality(exerciseFieldName, fieldIndex) {
	$(exerciseFieldName).dblclick(function() {
		var inputContainer = $(exerciseFieldName).parent();
		var exerciseFieldInput = inputContainer.find('.inputFieldContainer');
		var fieldText = $(exerciseFieldName).text();
		var fieldSelectorContainer = $('<div class="fieldSelectorContainer"></div>');
		var fieldSelector = $('<select class="fieldSelector"></select>');
		$.each(getExerciseFieldOptions(fieldIndex), function(i, option) {
			selectOption = $('<option></option>').attr('value',option).text(option);
			if(option == fieldText) {
				selectOption.attr('selected',true);
			}
			selectOption.appendTo(fieldSelector);
		});
		fieldSelector.appendTo(fieldSelectorContainer);
		$(exerciseFieldName).replaceWith(fieldSelectorContainer);
		fieldSelector.focus();

		// Remove edit mode
		$('.fieldSelector').focusout(function() {
			$(exerciseFieldName).text($('.fieldSelector').find(':selected').text());
			addEditExerciseInputFunctionality($(exerciseFieldName), fieldIndex);
			exerciseFieldInput.before($(exerciseFieldName));
			$('.fieldSelectorContainer').remove();
		});

		// When a field name is changed, change the units and input box size
		$('.fieldSelector').change(function() {
			var selectedName = $(this).find(':selected').text();
			var unitsText = '';
			var inputWidth = '';
			if(selectedName == 'Weight') {
				unitsText = 'lbs';
				inputWidth = '40px';

				// TODO: Remove edit functionality of units
				$( ".unitsText" ).off();

			} else if(selectedName == 'Distance'){
				unitsText = 'meters';
				inputWidth = '40px';

				//Add edit functionality to Distance units
				addEditUnitsFunctionality(inputContainer.find('.unitsText'),1.1);
			}else if(selectedName == 'Reps') {
				unitsText = '';
				inputWidth = '30px';
			} else if(selectedName == 'Time') {
				unitsText = 'mm:ss';
				inputWidth = '55px';
			}

			$(exerciseFieldInput).find('.inputField').css('width', inputWidth);
			inputContainer.find('.unitsText').text(unitsText);
		});
	});
};

// Add "Edit Units" functionality to units of exercise field
function addEditUnitsFunctionality(units, fieldIndex) {
	$(units).dblclick(function(){
		var inputContainer = $(units).parent();
		var unitsText = $(units).text();
		var unitsSelectorContainer = $('<div class="unitsSelectorContainer"></div>');
		var unitsSelector = $('<select id="unitsSelector"></select>');
		$.each(getExerciseFieldOptions(fieldIndex), function(i, option) {
			selectOption = $('<option></option>').attr('value',option).text(option);
			if(option == unitsText) {
				selectOption.attr('selected',true);
			}
			selectOption.appendTo(unitsSelector);
		});
		unitsSelector.appendTo(unitsSelectorContainer);
		$(units).replaceWith(unitsSelectorContainer);
		unitsSelector.focus();

		// Remove edit mode
		$('#unitsSelector').focusout(function() {
			$(units).text($('#unitsSelector').find(':selected').text());
			addEditUnitsFunctionality($(units), fieldIndex);
			$(units).appendTo(inputContainer);
			$('.unitsSelectorContainer').remove();
		});
	});
}

//Get all the possible exercise field name options
function getExerciseFieldOptions(fieldIndex) {

	// TODO: Make AJAX call to get possible exercise field name options
	if(fieldIndex == 1) {
		return ['Weight', 'Distance'];
	} else if (fieldIndex == 1.1) {
		return ['meters', 'miles', 'calories'];
	} else if(fieldIndex == 2) {
		return ['Reps', 'Time'];
	}
}

// Constructs the exercise title depending on its field values
function constructExerciseTitle(name, value, innerData, innerDataBoxIndex) {
	var exerciseName;
	if(name == 'Name') {
		exerciseName = value;
	} else {
		exerciseName = innerData[0].value;
	}

	var weight;
	if(name == 'weight') {
		weight = value;
	} else {
		weight = innerData[1].value;
	}

	var reps;
	if(name == 'Reps') {
		reps = value;
	} else {
		reps = innerData[2].value;
	}

	var exerciseTitle = reps + ' ' + exerciseName + ' ' + weight;

	// If exercise title is empty set it to default exercise title
	if($.trim(exerciseTitle).length == 0) {
		exerciseTitle = 'Exercise' + (innerDataBoxIndex + 1);
	}

	return exerciseTitle;
}

/**
 * Contains methods relating to the workout level of CrossFitTracker
 *
*/
// Add custom components to workout dataBox
function initializeWorkout(workoutIndex, workoutType) {
	content.dataDisplayer('addElementToTitleBar', workoutIndex, createWorkoutTypeSelector(workoutIndex, workoutType));

	// Add "Edit Workout Functionality"
	addEditWorkoutFunctionality(workoutIndex);
};

//Adds "Edit Workout Title" functionality
function addEditWorkoutFunctionality(workoutIndex) {
	var workoutTitleBar = content.dataDisplayer('getDataBox', workoutIndex).find('.bigButton');
	var workoutTitle = workoutTitleBar.children('.bigButtonText');
	workoutTitle.removeClass('leftCenterAlignment');
	workoutTitle.css('padding-top','1%');

	// Add edit button
	var editButton = $('<img class="editImage" src="images/CrossFitTracker/pen.png"/>');
	workoutTitle.before(editButton);

	// Initialize titleInput
	var titleInput = $('<input type="text" class="titleInput" value="' + workoutTitle.text() + '">');

	editButton.click(function() {
		// Set delete image
		var deleteButton = $('<img class="editImage" src="images/CrossFitTracker/erase.png"/>');
		editButton.replaceWith(deleteButton);

		// Set title as an input box
		workoutTitle.replaceWith(titleInput);
		titleInput.focus();

		var deleteFlag = false;
		// Add Listener for delete button
		deleteButton.on('mousedown', function() {
			deleteFlag = true;

			$.prompt('Are you sure you want to delete the workout?', {
				buttons: { "Yes": true, "No": false },
				position: { container: '#titleBar' + workoutIndex, x: 30, y: 0, width: 300, arrow: 'lt' },
				submit: function(event, answer, message, form) {
					// If the user chooses yes delete the exercise
					if(answer == true) {
						// Call dataDisplayer to delete innerDataBox at workoutIndex
						content.dataDisplayer('deleteDataBox', workoutIndex);
					} else {
						// Give focus back to titleInput
						titleInput.focus();
						deleteFlag = false;
					}
				}
			});

			// Prevent toggle of workout dataBox when delete button is pressed
			event.stopPropagation();
		});

		// Prevent toggle of workoutDataBox when titleInput is pressed
		titleInput.click(function() {
			event.stopPropagation();
		});

		// When the user clicks away from the titleInput remove "edit" mode
		titleInput.focusout(function() {
			if(!deleteFlag) {
				// Set title
				workoutTitle.text(titleInput.val());
				titleInput.replaceWith(workoutTitle);
				addEditWorkoutFunctionality(workoutIndex);

				deleteButton.remove();
			}
		});

		// Remove edit mode if user pressed enter
		$(document).keypress(function(e) {
			var focused= $(':focus');
		    if(e.which == 13 && focused.attr('class') == 'titleInput') {
		        focused.focusout();
		    }
		});

		event.stopPropagation();
	});
};

// Create a select option menu with the types of workouts
var createWorkoutTypeSelector = function(dataBoxIndex, workoutType) {

	var selectorContainer = $('<div class="selectorContainer"></div>');

	// Add selector box to selector container
	var selector = $('<select></select>');
	$.each(workoutTypes, function(key,value) {

		selectOption = $('<option></option>').attr('value',value).text(value);
		if(workoutType == value) {
			selectOption.attr('selected',true);
		}

		selectOption.appendTo(selector);
	});
	selector.appendTo(selectorContainer);

	// Prevent the toggle of the dataBox when selector is pressed
	selector.click(function(event) {
		event.stopPropagation();
	});

	// Change dataBox to reflect new selected workout type
	selector.change(function() {
		// Clear header and footer
		content.dataDisplayer('clearHeader', dataBoxIndex);
		content.dataDisplayer('clearFooter', dataBoxIndex);

		// Set header and footer height back to default
		content.dataDisplayer('setHeaderHeight', dataBoxIndex, 'default');
		content.dataDisplayer('setFooterHeight', dataBoxIndex, 'default');

		if(selector.val() == 'AMRAP') {
			createAmrapDataBox(dataBoxIndex);
		} else if(selector.val() == 'Time') {
			createTimeDataBox(dataBoxIndex);
		} else if(selector.val() == 'Tabata') {
			createTabataDataBox(dataBoxIndex);
		}
	});

	return selectorContainer;
};

// Create a dataBox for an AMRAP workout
function createAmrapDataBox(dataBoxIndex) {
	// Increase header height
	content.dataDisplayer('setHeaderHeight', dataBoxIndex, 50);

	// Add header elements
	var headerTextHolder = $('<div class="headerTextHolder alignLeft"></div>');
	//headerTextHolder.css('width','14%'); // Width is dependent on header text length

	var headerText = $('<p>Time</p>');
	headerText.appendTo(headerTextHolder);
	content.dataDisplayer('addElementToHeader', dataBoxIndex, headerTextHolder);

	var headerInputHolder = $('<div class="headerInputHolder"></div>');
	var headerInput = $('<input type="text" class="headerInput"></input>');
	headerInput.appendTo(headerInputHolder);
	content.dataDisplayer('addElementToHeader', dataBoxIndex, headerInputHolder);

	addFooterInput(dataBoxIndex, 'Score');
};

// Create dataBox for a Time workout
function createTimeDataBox(dataBoxIndex) {
	// Increase header height
	content.dataDisplayer('setHeaderHeight', dataBoxIndex, 50);

	// Add "Rounds:" text to header
	var headerTextHolder = $('<div class="headerTextHolder alignLeft"></div>');
	//headerTextHolder.css('width','18%'); // Width is dependent on header text length

	headerText = $('<p>Rounds:</p>');
	headerText.appendTo(headerTextHolder);
	content.dataDisplayer('addElementToHeader', dataBoxIndex, headerTextHolder);

	// Add container to hold all the rounds input boxes
	var roundsContainer = $('<div class="roundsContainer alignLeft"></div>');

	// Add an add button for the input boxes
	var roundContainer = $('<div class="roundContainer alignRight"></div>');
	var addRoundButton = $('<div class="addRoundButton"><img class="addRoundImage" src="images/CrossFitTracker/AddRound.gif"/></div>');
	addRoundButton.appendTo(roundContainer);
	roundContainer.appendTo(roundsContainer);

	// Add a round input as default
	addRoundInput(roundsContainer);

	// Add a round input whenever the add button is pressed
	addRoundButton.click(function() {
		addRoundInput(roundsContainer);
	});

	content.dataDisplayer('addElementToHeader', dataBoxIndex, roundsContainer);

	addFooterInput(dataBoxIndex, 'Score');
};

//Adds a small input box for a round during a timed workout
function addRoundInput(roundsContainer) {
	var inputContainer = $('<div class="roundContainer alignRight"></div>');
	var input = $('<input type="text" class="roundInput"></div>');
	input.val(' '); // center cursor
	input.appendTo(inputContainer);
	inputContainer.appendTo(roundsContainer);

	input.focusout(function() {
		var input = $.trim($(this).val());
		var inputLength = input.length;

		// if the input's length is 1 add a space indent
		if(inputLength == 1) {
			$(this).val(' ' + input);
		}
		// If the input's length is greater than 1 remove space indent
		else if(inputLength > 1) {
			$(this).val(input);
		}
	});
};

// Create dataBox for tabata workout
function createTabataDataBox(dataBoxIndex) {
	addFooterInput(dataBoxIndex, 'Score');
};

// Adds an input box to the footer of the dataBox
function addFooterInput(dataBoxIndex, text) {
	// Increase the size of of the footer
	content.dataDisplayer('setFooterHeight', dataBoxIndex, 60);

	// Add footer elements
	var footerTextHolder = $('<div class="footerTextHolder alignLeft"></div>');

	var footerText = $('<p>'+ text+ ':</p>');
	footerText.appendTo(footerTextHolder);
	content.dataDisplayer('addElementToFooter',dataBoxIndex, footerTextHolder);

	var footerInputHolder = $('<div class="footerInputHolder"></div>');
	var footerInput = $('<input type="text" class="footerInput"></input>');
	footerInput.appendTo(footerInputHolder);

	content.dataDisplayer('addElementToFooter',dataBoxIndex, footerInputHolder);
}

//Checks if all exercise fields are RX. If they are then add RX image to workout title bar
function checkRxWorkout(innerContainer) {
	// If all exercises are selected as RX display RX in workout title bar
	var exercises = innerContainer.find('.innerDataBoxContainerBorder');

	var allSelected;
	if(exercises.length == 0) {
		allSelected = false;
	} else {
		allSelected = true;
		$.each(exercises, function(index, exercise) {
			if(!$(exercise).find('.smallRxImage').hasClass('selected')) {
				allSelected = false;
			}
		});
	}

	// Add RX to workout title bar
	var workoutTitleBar = innerContainer.parent().find('.bigButton');
	if(allSelected) {
		if(workoutTitleBar.children('.bigRxImage').length == 0) {
			var workoutRxButton = $('<img class="bigRxImage" src="images/CrossFitTracker/rxSelected.png"/>');
			workoutRxButton.appendTo(workoutTitleBar);
		}
	} else {
		workoutTitleBar.find('.bigRxImage').remove();
	}
}

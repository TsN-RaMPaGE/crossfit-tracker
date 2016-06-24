/**
 * JQuery UI Data Displayer
 */

// Constants
var CLOSED_DATA_BOX_PADDING = 10;
var DEFAULT_HEADER_HEIGHT = 15;
var DEFAULT_FOOTER_HEIGHT = 25;
var ANIMATION_SPEED = .3; // pixels/ millisecond

// innerDataBox Constants
var INNER_DATA_BOX_HEIGHT; // Calculated based on number of innerDataBox input fields
var INNER_ADD_BUTTON_HEIGHT = 30;
var INNER_DATA_BOX_CLOSED_HEIGHT = INNER_ADD_BUTTON_HEIGHT + CLOSED_DATA_BOX_PADDING;
var INPUT_CONTAINER_HEIGHT = 40;

;(function ($)
{
	var methods =
	{
		// Initialize
		init : function(options)
		{
			return this.each(function ()
			{
				var
					$this = $(this),
					data = $this.data('dataDisplayer'),
					container = $('<div id="dataDisplayerContainer"></div>'), // Container to hold DataDisplayer (need this?)
					dataBoxes = new Array(),
				    settings = $.extend(
					{
						// Default settings
						// TODO: Add settings for primary, secondary, and text color
						addButtonText : (options && options.addButtonText) ? options.addButtonText : 'Add DataBox',
						defaultInnerTitle : (options && options.defaultInnerTitle) ? options.defaultInnerTitle : 'InnerDataBox',
						defaultTitle : (options && options.defaultTitle) ? options.defaultTitle : 'DataBox',
						inputTitles : (options && options.inputTitles) ? options.inputTitles : ['Field1','Field2'],
						primaryColor : (options && options.primaryColor) ? options.primaryColor : '#000000',
						secondaryColor : (options && options.secondaryColor) ? options.secondaryColor :'#FFFFFF',
						smallAddButtonText : (options && options.smallAddButtonText) ? options.smallAddButtonText : 'Add InnerDataBox',
					}, options);

				// Determine the height of the inner data box from the number of input containers needed
				INNER_DATA_BOX_HEIGHT = INNER_ADD_BUTTON_HEIGHT + INPUT_CONTAINER_HEIGHT*settings.inputTitles.length;

				if (!data) {
          $(this).data('dataDisplayer', {
              'target': $this,
              'settings': settings,
              'container' : container,
              'dataBoxes' : dataBoxes,
          });

    			// Mount the DataDisplayer
          $this.dataDisplayer('mount', container, settings);

          // Add Listener for the Big Add Button
  				$('#bigAddButton').click(function() {
  					$this.trigger('click-bigAddButton');
  				});

  				// Set default behavior for clicking bigAddButton
  				$this.on('click-bigAddButton', function(event){
  					// Add new DataBox before the bigAddButton
  					$this.dataDisplayer('addDataBox');

						// Animate new dataBox
						var dataBoxIndex = $(this).dataDisplayer('getNextDataBoxIndex');
						$this.dataDisplayer('animateAdd', dataBoxIndex);
  				});

          // Set default behavior for clicking a dataBoxTitleBar
          $this.on('click-dataBoxTitleBar', function(event, dataBoxIndex) {
          	$this.dataDisplayer('animateDataBoxToggle', dataBoxIndex);
          });

          // Set default behavior for clicking an innerDataboxTitleBar
          $this.on('click-innerDataBoxTitleBar', function(event, dataBoxIndex, innerDataBoxIndex){
          	$this.dataDisplayer('animateInnerDataBoxToggle', dataBoxIndex, innerDataBoxIndex);
          });

          // Set default behavior for clicking smallAddButton
          $this.on('click-smallAddButton', function(event, dataBoxIndex, innerDataBoxIndex, elementList) {
          	$this.dataDisplayer('addInnerDataBox', dataBoxIndex, innerDataBoxIndex);

          	// Populate innerDataBox data
          	$this.dataDisplayer('populateInnerDataBox', dataBoxIndex, innerDataBoxIndex, elementList);
          });

          // Allow the user to make custom handler for changing innerDataBox input field
          $this.on('change-innerDataBoxField', function(event, dataBoxIndex, innerDataBoxIndex, name, value) {});
				}
			});
		},

		/** Use dataDisplayer object in methods with $(this).dataDisplayer('methodName'); **/

		// Add dataBox to dataDisplayer
		addDataBox : function() {
			// Get the dataBoxIndex of the dataBox
			var dataDisplayer = this.data('dataDisplayer');
			var dataBoxIndex = dataDisplayer.dataBoxes.length;

			// Get the settings from the dataDisplayer
			var settings = dataDisplayer.settings;

			// Create dataBoxContainerBorder
			var dataBoxContainerBorder = $('<div class="dataBoxContainerBorder"  id="dataBoxContainerBorder' + dataBoxIndex + '"></div>');
			dataBoxContainerBorder.css('background-color', settings.primaryColor);

			// Add the container to the DataBox object
			var dataBoxContainer = $('<div class="dataBoxContainer" id="dataBoxContainer' + dataBoxIndex + '"></div>');
			dataBoxContainer.css('background-color',settings.secondaryColor);
			dataBoxContainer.appendTo(dataBoxContainerBorder);

			// Append titleBar to dataBoxContainerBorder
			var dataBoxNumber = $('#dataDisplayerContainer').find('.dataBoxContainerBorder').length+1;
			var titleBarContainer = $('<div class="bigButton" id="titleBar' + dataBoxIndex + '"></div>');
			titleBarContainer.css('background-color',settings.primaryColor);
			var titleBarText = $('<p class="bigButtonText leftCenterAlignment alignLeft" id="titleBarText' + dataBoxIndex + '">' + settings.defaultTitle  + dataBoxNumber + '</p>');
			titleBarText.css('color', settings.secondaryColor);
			titleBarText.appendTo(titleBarContainer);
			titleBarContainer.appendTo(dataBoxContainer);

			// Add Listener for titleBar
			titleBarContainer.click(function() {
				dataDisplayer.target.trigger('click-dataBoxTitleBar', dataBoxIndex);
			});

			// Add dataBoxContent to dataBoxContainer
			var dataBoxContent = $('<div id=dataBoxContent'+dataBoxIndex+'></div>');
			dataBoxContent.appendTo(dataBoxContainer);

			// Add header to dataBoxContainer
			var header = $('<div class="dataBoxHeader" id="dataBoxHeader'+dataBoxIndex+'"></div>');
			header.height(DEFAULT_HEADER_HEIGHT + 'px');
			header.appendTo(dataBoxContent);

			// Add innerContainer to DataBoxContainer
			var innerContainer = $('<div class="innerContainer" id="innerContainer'+ dataBoxIndex +'"></div>');
			innerContainer.css('color',settings.secondaryColor);
			innerContainer.appendTo(dataBoxContent);

			// Add innerAddButton to innerContainer
			var smallAddButton = $('<div class="smallButton topBox bottomBox" id="smallAddButton' + dataBoxIndex + '"></div>');
			var smallAddButtonText = $('<p class="smallButtonText leftCenterAlignment">' + settings.smallAddButtonText + '</p>');
			smallAddButtonText.css('color',settings.secondaryColor);
			smallAddButtonText.appendTo(smallAddButton);
			smallAddButton.css('height',INNER_ADD_BUTTON_HEIGHT);
			smallAddButton.css('background-color', settings.primaryColor);
			smallAddButton.appendTo(innerContainer);

			// Add listener to innerAddButton
			smallAddButton.click(function() {
				// Add a new innerDataBox
				var innerDataBoxIndex = dataDisplayer.dataBoxes[dataBoxIndex].length;
				dataDisplayer.target.trigger('click-smallAddButton', [dataBoxIndex, innerDataBoxIndex]);
			});

			// Append footer to dataBoxContainer
			var footer = $('<div class="dataBoxFooter" id="dataBoxFooter' + dataBoxIndex + '"></div>');
			footer.height(DEFAULT_FOOTER_HEIGHT + 'px');
			footer.appendTo(dataBoxContent);

			// If the first dataBox is being added..
			if($('#dataDisplayerContainer').find('.dataBoxContainerBorder').length == 0) {
				// Remove "topBox" class from the add button
				$('#bigAddButton').removeClass('topBox');

				// Add "topBox" class to dataBoxContainerBorder
				dataBoxContainerBorder.addClass('topBox');
			}

			// Increment the number of dataBoxes
			dataDisplayer.dataBoxes[dataBoxIndex] = new Array();

			// Add the dataBox before the addButton
			//$('#bigAddButton').before(dataBoxContainerBorder);
			dataBoxContainerBorder.appendTo($('#dataBoxesContainer'));
		},

		// Add DOM element to Footer at a given dataBoxIndex
		addElementToFooter : function(dataBoxIndex, element) {
			element.appendTo($('#dataBoxFooter'+dataBoxIndex));
		},

		// Add DOM element to header at a given dataBoxIndex
		addElementToHeader : function(dataBoxIndex, element) {
			element.appendTo('#dataBoxHeader'+dataBoxIndex);
		},

		// Add DOM element to innerTitleBar at a given dataBoxIndex and innerDataBoxIndex
		addElementToInnerTitleBar : function(dataBoxIndex, innerDataBoxIndex, element) {
			var id = dataBoxIndex + '-' + innerDataBoxIndex;
			element.appendTo($('#innerTitleBar'+id));
		},

		// Add DOM element to titleBar at a given dataBoxIndex
		addElementToTitleBar : function(dataBoxIndex, element) {
			element.appendTo($('#titleBar'+dataBoxIndex));
		},

		// Add innerDataBox to dataBox at given dataBoxIndex and innerDataBoxIndex
		addInnerDataBox : function(dataBoxIndex, innerDataBoxIndex) {
			var dataDisplayer = this.data('dataDisplayer');
			var settings = dataDisplayer.settings;

			// Get dataBoxIndex of the innerDataBox
			var dataBoxArray = dataDisplayer.dataBoxes;
			var addButton = $('#smallAddButton'+dataBoxIndex);

			// Increase the size of innerContainer that holds the innerDataBoxContainer
			var innerContainer = $('#innerContainer' + dataBoxIndex);

			// Increase the size of dataBoxContainerBorder that holds the innerContainer
			var dataBoxContainerBorder = $('#dataBoxContainerBorder' + dataBoxIndex);

			// Create innerDataBoxContainerBorder
			var id = dataBoxIndex + '-' + innerDataBoxIndex;
			var innerDataBoxContainerBorder = $('<div class="innerDataBoxContainerBorder" id="innerDataBoxContainerBorder'+id+'"></div>');
			innerDataBoxContainerBorder.css('background-color',settings.primaryColor);

			// Add innerDataBoxContainer to innerDataBoxContainerBorder
			var innerDataBoxContainer = $('<div class="innerDataBoxContainer"></div>');
			innerDataBoxContainer.css('background-color',settings.secondaryColor);
			innerDataBoxContainer.appendTo(innerDataBoxContainerBorder);

			// Append innerTitleBar to dataBoxContainerBorder
			var innerDataBoxNumber = innerContainer.find('.innerDataBoxContainerBorder').length+1;
			var innerTitleBarContainer = $('<div class="smallButton" id="innerTitleBar' + id + '"></div>');
			innerTitleBarContainer.css('background-color', settings.primaryColor);
			var innerTitleBarText= $('<p class="smallButtonText leftCenterAlignment alignLeft" id="innerTitleBarText' + id + '">'+ dataDisplayer.settings.defaultInnerTitle + innerDataBoxNumber + '</p>');
			innerTitleBarText.css('color',settings.secondaryColor);
			innerTitleBarText.appendTo(innerTitleBarContainer);
			innerTitleBarContainer.css('height', INNER_ADD_BUTTON_HEIGHT);
			innerTitleBarContainer.appendTo(innerDataBoxContainer);

			// Add Listener for innerTitleBar
			innerTitleBarContainer.click(function() {
				dataDisplayer.target.trigger('click-innerDataBoxTitleBar', [dataBoxIndex, innerDataBoxIndex]);
			});

			// If the first innerDataBox is being added..
			if(innerContainer.find('.innerDataBoxContainerBorder').length == 0) {
				// Remove "topBox" class from the small add button
				addButton.removeClass('topBox');

				// Add "topBox" class to the innerDataBoxContainerBorder
				innerDataBoxContainerBorder.addClass('topBox');
			}

			// Increment the dataBox's innerDataBox count
			var innerArray = dataBoxArray[dataBoxIndex];
			innerArray[innerDataBoxIndex] = 0;

			// Place inner data box before smallAddButton
			addButton.before(innerDataBoxContainerBorder);
		},

		// Animates adding a dataBox
		animateAdd : function(dataBoxIndex) {

			var bigAddButton = $('#bigAddButton');
			var bigAddButtonScreen = $('#bigAddButtonScreen');
			var buttonDifference = -bigAddButton.height();
			var duration = Math.abs(buttonDifference/ANIMATION_SPEED);

			//Toggle the new dataBox closed
			$(this).dataDisplayer('toggleDataBox', dataBoxIndex);

			// Animate add button down past the newly added dataBox
			bigAddButton.animate({
				bottom:buttonDifference
			}, duration, function() {
				bigAddButton.css('bottom', 'auto');

			});

			bigAddButtonScreen.animate({
				bottom:buttonDifference
			}, duration, function() {
				bigAddButtonScreen.css('bottom', 'auto');
				$(this).dataDisplayer('animateDataBoxToggle', dataBoxIndex);
			});

		},

		// Animate a dataBox open or closed
		animateDataBoxToggle : function(dataBoxIndex) {
			var dataBox = $('#dataBoxContainerBorder' + dataBoxIndex);
			var dataBoxContent = $('#dataBoxContent'+dataBoxIndex);

			var marginTop = $('#dataBoxContainer'+ dataBoxIndex).css('margin-top');
			var dataBoxPadding = Math.round(parseFloat(marginTop.substring(0,marginTop.length-2)));

			var closedHeight = $('#bigAddButton').height() + CLOSED_DATA_BOX_PADDING;
			var openHeight = dataBox.height() + dataBoxContent.height() - dataBoxPadding;

			animateOpenClose(dataBox, closedHeight, openHeight);
		},

		// Animate innerDataBox open or closed
		animateInnerDataBoxToggle : function(dataBoxIndex, innerDataBoxIndex) {
			var id = dataBoxIndex + '-' + innerDataBoxIndex;
			var innerDataBoxContainerBorder = $('#innerDataBoxContainerBorder'+id);

			animateOpenClose(innerDataBoxContainerBorder,INNER_DATA_BOX_CLOSED_HEIGHT, INNER_DATA_BOX_HEIGHT);
		},

		// Clear the header of a dataBox at a given dataBoxIndex
		clearHeader : function(dataBoxIndex) {
			$.each($('#dataBoxHeader'+dataBoxIndex).children(), function(index, child) {
				child.remove();
			});
		},

		// Clear the footer of a dataBox at a given dataBoxIndex
		clearFooter : function(dataBoxIndex) {
			$.each($('#dataBoxFooter'+dataBoxIndex).children(), function(index, child) {
				child.remove();
			});
		},

		// Delete dataBox at a given dataBoxIndex
		deleteDataBox : function(dataBoxIndex) {
			// Remove the dataBoxBorder
			$('#dataBoxContainerBorder'+dataBoxIndex).remove();

			// Update dataBox titles
			var defaultTitle = this.data('dataDisplayer').settings.defaultTitle;
			var dataBoxes = $('#dataDisplayerContainer').find('.dataBoxContainerBorder');
			$.each(dataBoxes, function(index, box) {
				var myBox = $(box);

				if(index == 0) {
					myBox.addClass('topBox');
				}

				var id = myBox.attr('id');
				if(id.substr(id.length-1) > dataBoxIndex) {
					var currentTitle = myBox.find('.bigButtonText').text();
					if(currentTitle.indexOf(defaultTitle) > -1) {
						myBox.find('.bigButtonText').text(defaultTitle+''+ (index+1));
					} else {
						myBox.find('.bigButtonText').text(currentTitle);
					}
				}
			});

			// Give add button 'topBox' class when there are no dataBoxes
			if(dataBoxes.length == 0) {
				$('#dataDisplayerContainer').children('#bigAddButton').addClass('topBox');
			}
		},

		// Delete innerDataBox index given a dataBoxIndex and innerDataBoxIndex
		deleteInnerDataBox : function(dataBoxIndex, innerDataBoxIndex) {
			// Remove the innerDataBox
			var id = dataBoxIndex + '-' + innerDataBoxIndex;
			$('#innerDataBoxContainerBorder'+id).remove();

			// Resize dataBox
			resizeDataBoxContainer(dataBoxIndex);

			// Update dataBox titles
			var defaultInnerTitle = this.data('dataDisplayer').settings.defaultInnerTitle;
			var dataBoxContainer = $('#dataBoxContainerBorder'+dataBoxIndex);
			var innerDataBoxes = dataBoxContainer.find('.innerDataBoxContainerBorder');
			$.each(innerDataBoxes, function(index, box) {
				var myBox = $(box);

				if(index == 0) {
					myBox.addClass('topBox');
				}

				var id = myBox.attr('id');
				if(id.substr(id.length-1) > innerDataBoxIndex) {
					var currentTitle = myBox.find('.smallButtonText').text();
					if(currentTitle.indexOf(defaultInnerTitle) > -1) {
						myBox.find('.smallButtonText').text(defaultInnerTitle+''+ (index+1));
					} else {
						myBox.find('.smallButtonText').text(currentTitle);
					}
				}
			});

			// Give add button round edges if there are no innerDataBoxes
			if(innerDataBoxes.length == 0) {
				dataBoxContainer.find('#smallAddButton'+dataBoxIndex).addClass('topBox');
			}
		},
/*
		// Get the current dataBox when either the small or add button is pressed
		getCurrentDataBoxIndex : function(button) {
			var currentDataBoxIndex = -1;
			// return dataBoxIndex if the big button was pressed
			if(button.attr('class').indexOf('big') > 0) {
				var buttonId = button.attr('id');
				currentDataBoxIndex = buttonId.substr(buttonId.length-1);
			} else {
				// return dataBoxIndex if the small button was pressed
				var buttonId = button.parent().attr('id');
				currentDataBoxIndex = buttonId.substr(buttonId.length-1);
			}
			return currentDataBoxIndex;
		},*/

		// Get dataBox at given dataBoxIndex
		getDataBox : function(dataBoxIndex) {
			return $('#dataBoxContainerBorder'+dataBoxIndex);
		},

		// Get innerDataBoxIndex at given dataBoxIndex and innerDataBoxIndex
		getInnerDataBox : function(dataBoxIndex, innerDataBoxIndex) {
			var id = dataBoxIndex + '-' + innerDataBoxIndex;
			return $('#innerDataBoxContainerBorder'+id);
		},

		// Returns an array of the innerDataBox data with attributes for name and value
		getInnerDataBoxData : function(dataBox, innerDataBox) {
			var innerDataElements = $('#innerDataBoxContainerBorder' + dataBox + "-" + innerDataBox).find('.inputContainer');
			var innerDataArray = new Array();
			$.each(innerDataElements, function(i, data) {
				innerDataArray.push({name: $(data).find('.inputTitleText').text(), value: $(data).find('.inputField').val()});
			});
			return innerDataArray;
		},

		// Get the next dataBoxIndex
		getNextDataBoxIndex : function() {
			return this.data('dataDisplayer').dataBoxes.length-1;
		},

		// Get the next innerDataBoxIndex
		getNextInnerDataBoxIndex : function(dataBoxIndex) {
			var innerDataBoxes = $('#dataBoxContainerBorder' + dataBoxIndex).find('.innerDataBoxContainerBorder');
			var lastInnerDataBoxId = $(innerDataBoxes[innerDataBoxes.length-1]).attr('id');
			var lastInnerDataBoxIndex = lastInnerDataBoxId.substr(lastInnerDataBoxId.length-1);

			return +lastInnerDataBoxIndex;
		},

		// Mount dataDisplayer to container with specified settings
		mount : function(container, settings)
		{
			var dataDisplayer = this;

			// Create container for DataDisplayer
			container.appendTo(dataDisplayer);

			// Create a container to hold all dataBoxes
			$('<div id="dataBoxesContainer"></div>').appendTo(container);

			// Add a Big Button to container for adding DataBoxes
			var bigAddButton = $('<div class="bigButton topBox bottomBox" id="bigAddButton"></div>').appendTo(container);
			bigAddButton.css('background-color',settings.primaryColor);

			var bigAddButtonScreen = $('<div id="bigAddButtonScreen"></div>');
			bigAddButtonScreen.appendTo(container);

			// Add text to add button
			var addButtonText = $('<p class="bigButtonText leftCenterAlignment">' + settings.addButtonText + '</p>');
			addButtonText.css('color',settings.secondaryColor);
			addButtonText.appendTo(bigAddButton);
		},

		// Populate innerDataBox with array of data that has 2 attributes per entry of name and value
		populateInnerDataBox : function(dataBoxIndex, innerDataBoxIndex, elementData) {

			var id = dataBoxIndex + '-' + innerDataBoxIndex;
			var innerDataBoxContainer = $('#innerDataBoxContainerBorder'+id).children('.innerDataBoxContainer');
			var dataDisplayer = this.data('dataDisplayer');
			var innerDataBoxContent = $('<div id="innerDataBoxContent' + id + '"></div>');
			innerDataBoxContent.appendTo(innerDataBoxContainer);

			// Create a default array of inputTitles and blank values for element data
			if(elementData == null) {
				elementData = new Array();
				for(var i=0; i < this.data('dataDisplayer').settings.inputTitles.length;i++) {
					// push new element onto elementData
					elementData.push({name: this.data('dataDisplayer').settings.inputTitles[i], value:''});
				}
			}

			// Create a DOM element for each elementData
			jQuery.each(elementData, function(i, data) {

				// Create container for input field and title
				var inputContainer = $('<div class="inputContainer"></div>');
				inputContainer.css('height', INPUT_CONTAINER_HEIGHT);

				// Add field name to container
				var inputTitleText = $('<p class="inputTitleText leftCenterAlignment">' + data.name + '</p>');
				inputTitleText.css('color',dataDisplayer.settings.primaryColor);

				inputTitleText.appendTo(inputContainer);

				// Add inputFieldContainer to inputContainer
				var inputFieldContainer = $('<div class="inputFieldContainer"><div>');
				inputFieldContainer.appendTo(inputContainer);

				// Add text input to container
				var inputField = $('<input type="text" class="inputField" value="' + data.value +'">');
				inputField.appendTo(inputFieldContainer);

				// Add listener to each inputField
				inputField.keyup(function(){
					var input = inputField.val();
					dataDisplayer.target.trigger('change-innerDataBoxField', [dataBoxIndex, innerDataBoxIndex, data.name, input]);
				});

				inputContainer.appendTo(innerDataBoxContent);
			});
		},

		// Set footer height of dataBox
		setFooterHeight : function(dataBoxIndex, height) {
			if(height == 'default') {
				$('#dataBoxFooter'+dataBoxIndex).height(DEFAULT_FOOTER_HEIGHT);
			}

			$('#dataBoxFooter'+dataBoxIndex).height(height);
			resizeDataBoxContainer(dataBoxIndex);
		},

		// Set header height of dataBox
		setHeaderHeight : function(dataBoxIndex, height) {
			if(height == 'default') {
				$('#dataBoxHeader'+dataBoxIndex).height(DEFAULT_HEADER_HEIGHT);
			}

			$('#dataBoxHeader'+dataBoxIndex).height(height);
			resizeDataBoxContainer(dataBoxIndex);
		},

		// Set innerTitleBarText of innerDataBox
		setInnerTitleBarText : function(dataBoxIndex, innerDataBoxIndex, text) {
			var id = dataBoxIndex + '-' + innerDataBoxIndex;
			$('#innerTitleBarText'+id).text(text);
		},

		// Set titleBarText of dataBox
		setTitleBarText : function(dataBoxIndex, text) {
			$('#TitleBarText'+dataBoxIndex).text(text);
		},

		// Toggle a dataBox open or closed
		toggleDataBox : function(dataBoxIndex) {
			var dataBox = $('#dataBoxContainerBorder' + dataBoxIndex);
			var dataBoxContent = $('#dataBoxContent'+dataBoxIndex);

			var closedHeight = $('#bigAddButton').height() + CLOSED_DATA_BOX_PADDING;
			var openHeight = dataBox.height() + dataBoxContent.height();

			toggleOpenClose(dataBox, closedHeight, openHeight);
		},

		// Toggle innerDataBox open or closed
		toggleInnerDataBox : function(dataBoxIndex, innerDataBoxIndex) {
			var id = dataBoxIndex + '-' + innerDataBoxIndex;
			var innerDataBoxContainerBorder = $('#innerDataBoxContainerBorder'+id);

			toggleOpenClose(innerDataBoxContainerBorder,INNER_DATA_BOX_CLOSED_HEIGHT, INNER_DATA_BOX_HEIGHT);
		}
	};

	// Bridge to access dataDisplayer
	$.fn.dataDisplayer = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on ');
        }
    };
})(jQuery);

// Toggles the given dataBox open or closed
var toggleOpenClose = function(dataBox, closedHeight, openHeight) {
	if(dataBox.height() > closedHeight) {

		dataBox.css('height',closedHeight);
	} else {
		dataBox.css('height', 'auto');
	}

};

// Animates the given dataBox open or closed
var animateOpenClose = function(dataBox, closedHeight, openHeight) {

	var dataBoxHeight = dataBox.height();

	if(dataBox.height() > closedHeight) {
		var heightDifference = Math.abs(dataBoxHeight - closedHeight);
		duration = heightDifference/ANIMATION_SPEED;

		dataBox.animate({
			height:closedHeight
		}, duration);
	} else {
		var heightDifference = Math.abs(openHeight-closedHeight);
		duration = heightDifference/ANIMATION_SPEED;

		dataBox.animate({
			height:openHeight
		}, duration, function() {
			dataBox.css('height','auto');
		});
	}
};

// TODO: Need this?
// Calculate the initial dataBoxHeight
var getInitialDataBoxContainerHeight = function(dataBoxIndex) {
	return $('.bigButton').height() +
		   $('#dataBoxHeader'+dataBoxIndex).height() +
	       INNER_ADD_BUTTON_HEIGHT +
	       $('#dataBoxFooter'+dataBoxIndex).height();
};

// TODO: Need this?
//Calculates the height of dataBoxContainerBorder with all the elements inside of it
var getDataBoxContainerHeight = function(container, dataBoxIndex) {
	var openHeight = getInitialDataBoxContainerHeight(dataBoxIndex);

	// If dataBoxContainerBorder is passed in
	var innerContainer = container.children('.dataBoxContainer').children('.innerContainer');
	innerContainer.children('.innerDataBoxContainerBorder').each(function(i) {

		if($(this).hasClass('open')) {
			openHeight += INNER_DATA_BOX_HEIGHT;
		} else {
			openHeight += INNER_DATA_BOX_CLOSED_HEIGHT;
		}

	});

	return openHeight;
};

// TODO: Need this?
// Resize dataBoxContainer after toggling innerDataBoxContainer
var resizeDataBoxContainer = function(dataBoxIndex) {
	var innerContainer = $('#innerContainer' + dataBoxIndex);
	var dataBoxContainerBorder = $('#dataBoxContainerBorder' + dataBoxIndex);

/*
	var updatedHeight = getDataBoxContainerHeight(dataBoxContainerBorder, dataBoxIndex);
	dataBoxContainerBorder.css('height',updatedHeight);
  innerContainer.css('height', updatedHeight - ($('.bigButton').height() + $('#dataBoxFooter'+dataBoxIndex).height() + $('#dataBoxHeader'+dataBoxIndex).height()));
*/
};

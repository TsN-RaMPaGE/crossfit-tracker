/*
	Author: Brian Redd
	Version: 0.1
	Description: This file builds the template of the
	website layout
*/

/*********************************************/
/* Globals                                   */
/*********************************************/

// Site Navigation Options
var CFTrackerNavOption = {
	'title': 'CF Tracker',
	'buttonId' : 'CFTrackerNavButton',
	//'link' : '/cftracker',
	'imageElementString' : '<img src="/images/CrossFitTracker/kettlebell_white.png" id="subNavKettleBell"/>',
	'subTitles' : ['Calendar', 'Search Workout'],
	'subLinks' : ['CFTracker/calendar','CFTracker/searchWorkout']
}
var libraryNavOption = {
	'title': 'Library',
	'buttonId' : 'libraryNavButton',
	//'link' : '/library',
	'imageElementString' : '<div class="subNavGlyphicon glyphicon glyphicon-book"></div>',
	'subTitles' : [],
	'subLinks' : []
}
var projectsNavOption = {
	'title': 'Projects',
	'buttonId' : 'projectsNavButton',
	//'link' : '/projects',
	'imageElementString' : '<div class="subNavGlyphicon glyphicon glyphicon-tower"></div>',
	'subTitles' : ['Goobies', 'Line Follower', 'Mapping Robot', 'Virtual Painter'],
	'subLinks' : ['goobies', 'lineFollower', 'mappingRobot', 'virtualPainter']
}
var tutorialsNavOption = {
	'title': 'Tutorials',
	'buttonId' : 'tutorialsNavButton',
	//'link' : '/tutorials',
	'imageElementString' : '<div class="subNavGlyphicon glyphicon glyphicon-star" style="padding-left:10%;"></div>',
	'subTitles' : [ 'Android', 'c#', 'Java', 'JavaScript', 'Spring', 'Node.js'],
	"subLinks" : ['android', 'cSharp', 'java', 'javascript', 'spring', 'nodeJs']
}

var siteNavOptions = [CFTrackerNavOption, libraryNavOption, projectsNavOption, tutorialsNavOption];

// Flag so slide menu doesn't close when mouse leaves nav button
var slideMenuFlag = false;

/*********************************************/
/* Initialize Page                           */
/*********************************************/

$(document).ready(function() {

	// Add events and actions to navigation menu
	buildSiteNavigationMenu(siteNavOptions);

	// Remove slide menu if the mouse enters any other part of the page except navigation
	var nonMenuElements = ['#headerContainer', '#pageContent', '#rightContainer'];
	$.each(nonMenuElements, function(i,element) {
		// Show slide menu when mouse enters navigation button
		$(element).mouseenter(function() {
			if(slideMenuFlag) {
				$('#contentWrapper').removeClass('slideMenuAction');
				slideMenuFlag = false;
			}
		});
	});
});

/*********************************************/
/* Function Calls                            */
/*********************************************/

// Builds the site navigation menu buttons with a list of json obejcts
function buildSiteNavigationMenu(navOptions) {

	// Append all navigation option buttons to siteNavContainer
	var navigationContainer = $('#siteNavigationContainer');

	// For each nav option create a click event, mouseenter event, mouseleave event, and a sub navigation slide menu
	$.each(navOptions, function(i, navOption) {

		// Create mouseenter event
		$('#'+navOption.buttonId).mouseenter(function() {
			$(this).addClass('navButtonHover');

			var hasSlideMenu = (navOption.subLinks.length > 0);
			if(!hasSlideMenu) {
				$('#contentWrapper').removeClass('slideMenuAction');
				slideMenuFlag = false;
			} else {
				if($('#contentWrapper').hasClass('slideMenuAction') && !slideMenuFlag) {
					$('#contentWrapper').removeClass('slideMenuAction');
					slideMenuFlag = false;
				} else {
					if(navOption.subLinks.length > 0) {
							$('#contentWrapper').addClass('slideMenuAction');
							slideMenuFlag = true;

						// Build navOption slide menu
						buildNavSlideMenu(navOption);
					}
				}
			}
		});

		// Create mouseleave event
		$('#'+navOption.buttonId).mouseleave(function() {
			$(this).removeClass('navButtonHover');
		});
	});
};

// Create navigation option slide menu
function buildNavSlideMenu(navOption) {
	// Remove the current slide menu if it exists
	$('#contentCanvas').find('#navSlideMenu').remove();

	// Create a div to hold new slide menu
	var menu = $('<div id="navSlideMenu"></div>');

	// Add title and image to slide menu
	var slideMenuHeader = $('<div id="slideMenuHeader" class="subNavLink"></div>');
	var subNavTitleTextContainer = $('<div id="subNavTitleTextContainer"></div>');
	$('<div class="subNavTitleText">' + navOption.title + '</div>').appendTo(subNavTitleTextContainer);
	var subNavImageContainer = $('<div id="subNavImageContainer"></div>');
	$(navOption.imageElementString).appendTo(subNavImageContainer);
	subNavTitleTextContainer.appendTo(slideMenuHeader);
	subNavImageContainer.appendTo(slideMenuHeader);
	slideMenuHeader.appendTo(menu);

	// Add each sub title to the slide menu
	var subNavLinksContainer = $('<div id="subNavLinksContainer"></div>');
	$.each(navOption.subTitles, function(i, title) {
		var textBox = $('<div class="subNavTextBox"></div');
		subNavLink = $('<a href="' + navOption.subLinks[i] + '" class="subNavText subNavLink">'+ title + '</a>');
		subNavLink.css('text-decoration','none').css('color','white');
		subNavLink.appendTo(textBox);
		textBox.appendTo(subNavLinksContainer);
	});
	subNavLinksContainer.appendTo(menu);
	menu.appendTo('#contentCanvas');

	// Add listener for hovering over slideMenuHeader
	$('#slideMenuHeader').mouseenter(function() {
		$(this).addClass('slideMenuHeaderHover');
	});

	// Add listeners for hovering over links
	$('.subNavTextBox').mouseenter(function() {
		$(this).addClass('subNavTextBoxHover');
	});

	// Add listeners for leaving a hover from links
	$('.subNavTextBox').mouseleave(function() {
		$(this).removeClass('subNavTextBoxHover');
	});

	// Close slide menu when a link is pressed
	$('.subNavLink').click(function() {
		$('#contentWrapper').removeClass('slideMenuAction');
	});
};

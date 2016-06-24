
var routeCFTracker = function($routeProvider) {

$routeProvider
  .when('/CFTracker/home', {
    templateUrl:'html/CrossFitTracker/home.html',
    controller:'CFTrackerHomeController'
  })

  .when('/CFTracker/calendar', {
    templateUrl:'html/CrossFitTracker/calendar.html',
    controller:'CFTrackerCalendarController'
  })

  .when('/CFTracker/searchWorkout', {
    templateUrl:'html/CrossFitTracker/search.html',
    controller:'CFTrackerSearchController'
  });

};

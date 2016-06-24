
  var myApp = angular.module('myApp', ['ngRoute']);
  myApp.config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/home', {
        templateUrl: 'html/home.html',
        controller: 'HomeController'
      })

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
      })

      .when('/library', {
        templateUrl:'html/library.html',
        controller:'LibraryController'
      })

      .when('/projects', {
        templateUrl:'html/projects.html',
        controller:'ProjectsController'
      })

      .when('/tutorials', {
        templateUrl:'html/tutorials.html',
        controller:'TutorialsController'
      })

      .otherwise({
        redirectTo: '/home'
      });

      //routeCFTracker($routeProvider);

    $locationProvider.html5Mode(true);
  });

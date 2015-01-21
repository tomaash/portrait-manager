'use strict';

angular.module('portraitManager', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'ui.bootstrap', 'angularFileUpload'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    // .state('home', {
    //   url: '/',
    //   templateUrl: 'app/main/main.html',
    //   controller: 'MainCtrl'
    // })
    .state('people', {
      url: '/people',
      templateUrl: 'app/people/people.html',
      controller: 'PeopleCtrl as vm'
    })
      .state('teachers', {
        url: '/teachers',
        templateUrl: 'app/teachers/teachers.html',
        controller: 'TeachersCtrl as vm'
      })
      .state('grades', {
        url: '/grades',
        templateUrl: 'app/grades/grades.html',
        controller: 'GradesCtrl as vm'
      });
    $urlRouterProvider.otherwise('/people');
  }).config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setRestangularFields({
      id: '_id'
    });
  });
'use strict';

angular.module('portraitManager', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'restangular', 'ui.router', 'ui.bootstrap'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    // .state('home', {
    //   url: '/',
    //   templateUrl: 'app/main/main.html',
    //   controller: 'MainCtrl'
    // })
    .state('portrait', {
      url: '/',
      templateUrl: 'app/portrait/portrait.html',
      controller: 'PortraitCtrl as vm'
    });
    $urlRouterProvider.otherwise('/');
  }).config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
  });
'use strict';

angular.module('portraitManager')
  .controller('NavbarCtrl', function ($scope, $state) {
    $scope.date = new Date();
    $scope.state = $state;
  });

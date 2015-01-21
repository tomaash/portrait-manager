'use strict';

angular.module('portraitManager')
  .controller('TeachersCtrl', function($scope, $upload, Restangular) {

    var vm = this;
    vm.currentTeacher = {};

    var teachers = Restangular.all('teachers');

    // This will query accounts and return a promise.
    vm.reload = function() {
      teachers.getList().then(function(teachers) {
        vm.teachers = teachers;
      });
    };

    vm.addTeacher = function() {
      teachers.post(vm.currentTeacher);
      vm.reload();
    };

  });
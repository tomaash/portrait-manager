'use strict';

angular.module('portraitManager')
  .controller('PortraitCtrl', function($scope, Restangular) {

    var vm = this;
    vm.currentPerson = {};

    var people = Restangular.all('people');

    // This will query accounts and return a promise.
    vm.reload = function() {
      people.getList().then(function(people) {
        vm.people = people;
      });
    };

    vm.addPerson = function() {
      people.post(vm.currentPerson);
      vm.reload();
    };

    vm.reload();
  });
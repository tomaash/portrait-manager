'use strict';

angular.module('portraitManager')
.controller('GradesCtrl', function($scope, $upload, $state, Restangular, editModal) {

    var vm = this;
    vm.currentItem = {};
    vm.editMode = false;

    var resource = Restangular.all('grades');

    vm.openEditor = function (item) {
      editModal.open (item, {
        vm: vm,
        templateUrl: 'app/grades/grade-form.html',
        size: 'md'
      });
    };

    vm.reload = function() {
      resource.getList().then(function(data) {
        vm.collection = data;
      });
    };

    vm.create = function() {
      console.log(vm.currentItem);
      resource.post(vm.currentItem).then(function() {
        vm.currentItem = {};
        vm.reload();
      });
    };

    vm.update = function() {
      vm.currentItem.put().then(function() {
        vm.currentItem = {};
        vm.editMode = false;
        vm.reload();
      });
    };

    vm.destroy = function(item) {
      item.remove().then(function() {
        vm.reload();
      });
    };

    vm.cancel = function() {
      vm.editMode = false;
      vm.currentItem = {};
    };

    vm.openPortraits = function (item) {
      $state.go ('people-opt', {selectionType : 'Grade',
                                selectionValue : item._id});
    };

    vm.reload();

  });
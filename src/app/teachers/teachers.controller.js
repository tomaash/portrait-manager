'use strict';

angular.module('portraitManager')
.controller('TeachersCtrl', function($scope, $upload, $state, Restangular, editModal) {

    var vm = this;
    vm.currentItem = {};
    vm.editMode = false;

    var resource = Restangular.all('teachers');

    vm.openEditor = function (item) {
      editModal.open (item, {
        vm: vm,
        templateUrl: 'app/teachers/teacher-form.html',
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
      $state.go ('people-opt', {selectionType : 'Teacher',
                                selectionValue : item._id});
    };

    vm.reload();
  });
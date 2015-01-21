'use strict';

angular.module('portraitManager')
  .controller('TeachersCtrl', function($scope, $upload, Restangular) {

    var vm = this;
    vm.currentItem = {};
    vm.editMode = false;

    var resource = Restangular.all('teachers');

    vm.reload = function() {
      resource.getList().then(function(data) {
        vm.collection = data;
      });
    };

    vm.edit = function(item) {
      vm.currentItem = Restangular.copy(item);
      vm.editMode = true;
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

    vm.reload();
  });
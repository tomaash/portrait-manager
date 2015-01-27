'use strict';
angular.module('portraitManager')
  .controller('EditModalController', function ($modalInstance, item) {
  var vm = this;
  vm.currentItem = item;

  if (item._id) {
    vm.editMode = true;
  }

  vm.ok = function() {
    $modalInstance.close(vm.currentItem);
  };

  vm.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
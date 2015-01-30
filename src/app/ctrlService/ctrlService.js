/**
 * Service for creating controllers.
 */

'use strict';

angular.module('portraitManager')
.factory ('CtrlService', function ($modal, $state, Restangular, editModal) {
  return {
    create: function (vm, cfg) {
      vm.currentItem = {};
      vm.editMode = false;

      var resource = Restangular.all(cfg.what);

      vm.openEditor = function (item) {
        editModal.open (item, _.merge ({
          vm: vm
        }, cfg));
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
        $state.go (cfg.state, {selectionType : cfg.selectionType,
                               selectionValue : item._id});
      };
      
      vm.reload();
    }
  };
});
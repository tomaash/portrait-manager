/**
 * Modal for creating and editing item attributes.  
 */

'use strict';

angular.module('portraitManager')
.factory ('editModal', function ($modal, Restangular) {
  return {
    open: function (item, cfg) {
      var vm = cfg.vm;

      var updateFromEditor = function (item) {
        vm.currentItem = item;
        if (item._id) {
          vm.update();
        } else {
          vm.create();
        }
      };

      if (item) {
        vm.currentItemReference = item;
        vm.currentItem = Restangular.copy(item);
      } else {
        vm.currentItem = {};
        vm.currentItemReference = null;
      }
      var modalInstance = $modal.open({
        templateUrl: cfg.templateUrl,
        controller: (cfg.controller || 'EditModalController') + ' as vm',
        size: cfg.size || 'lg',
        resolve: _.merge ({
          item: function() {
            return vm.currentItem;
          }
        }, cfg.resolve)
      });

      modalInstance.result.then(updateFromEditor);
    }
  };
});
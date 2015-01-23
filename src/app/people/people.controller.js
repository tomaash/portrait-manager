'use strict';

angular.module('portraitManager')
  .controller('PeopleCtrl', function($scope, $upload, $timeout, Restangular) {

    var vm = this;
    vm.currentItem = {};
    vm.editMode = false;

    var resource = Restangular.all('people');

    var PERSON_ATTRIBUTES = [
      'firstName',
      'lastName',
      'imageId'
    ];

    var updateItem = function(dest, src) {
      PERSON_ATTRIBUTES.forEach(function(attr) {
        dest[attr] = src[attr];
      });
    };

    vm.reload = function() {
      resource.getList().then(function(data) {
        vm.collection = data;
      });
    };

    vm.edit = function(item) {
      vm.currentItemReference = item;
      vm.currentItem = Restangular.copy(item);
      vm.editMode = true;
    };

    vm.create = function() {
      vm.uploadIfModified();
      resource.post(vm.currentItem).then(function(item) {
        item.thumbnailUrl = vm.currentItem.thumbnailUrl;
        vm.collection.push(item);

        vm.currentItem = {};
        vm.editMode = false;
        vm.file = null;
      });
    };

    vm.update = function() {
      vm.uploadIfModified();
      vm.currentItem.put().then(function(item) {
        vm.currentItemReference.thumbnailUrl = vm.currentItem.thumbnailUrl;
        updateItem(vm.currentItemReference, item);

        vm.currentItem = {};
        vm.editMode = false;
        vm.file = null;
      });
    };

    vm.destroy = function(item) {
      item.remove().then(function() {
        var idx = vm.collection.indexOf(item);
        if (idx !== -1) {
          vm.collection.splice(idx, 1);
        }
      });
    };

    vm.cancel = function() {
      vm.editMode = false;
      vm.currentItem = {};
    };

    vm.reload();

    vm.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);


    vm.fileSelected = function() {
      var file = vm.file[0];
      console.log(file);
      if (file) {
        vm.generateThumb(file);
      }
    };

    vm.uploadIfModified = function() {
      if (vm.file) {
        var hash = Math.round(Math.random() * 1e16).toString(32);
        vm.currentItem.imageId = vm.currentItem.imageId || hash;
        if (vm.currentItemReference) {
          vm.currentItemReference.thumbnailUrl = vm.currentItem.thumbnailUrl;
          vm.currentItemReference.imageId = vm.currentItem.imageId;
        }
        vm.upload(vm.currentItem.imageId);
      }
    };

    vm.generateThumb = function(file) {
      if (file != null) {
        if (vm.fileReaderSupported && file.type.indexOf('image') > -1) {
          $timeout(function() {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            console.log('will read');
            fileReader.onload = function(e) {
              $timeout(function() {
                console.log('have url');
                console.log(e.target.result);
                vm.currentItem.thumbnailUrl = e.target.result;
              });
            };
          });
        }
      }
    };

    vm.upload = function(itemId) {
      $upload.upload({
        url: '/upload?personId=' + itemId,
        file: vm.file[0]
      }).progress(function(evt) {
        console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.file.name);
      }).success(function(data, status, headers, config) {
        console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
      });
    };
  });
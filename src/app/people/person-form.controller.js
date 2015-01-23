'use strict';
angular.module('portraitManager')
  .controller('PersonFormCtrl', function($scope, $timeout, $modalInstance, $upload, Restangular, item) {
    var vm = this;
    vm.currentItem = item;

    var teachers = Restangular.all('teachers');
    var grades = Restangular.all('grades');

    vm.getTeachersAndGrades = function() {
      teachers.getList().then(function(data) {
        vm.teachers = data;
      });
      grades.getList().then(function(data) {
        vm.grades = data;
      });
    };

    vm.getTeachersAndGrades();

    if (item._id) {
      vm.editMode = true;
    }

    vm.ok = function() {
      vm.uploadIfModified();
      $modalInstance.close(vm.currentItem);
    };

    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

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
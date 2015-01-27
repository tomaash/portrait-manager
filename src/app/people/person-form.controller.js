'use strict';
angular.module('portraitManager')
  .controller('PersonFormCtrl', function($scope, $timeout, $modalInstance, $upload, Restangular, imageRepoUrl, item, teachers, grades) {
    var vm = this;
    vm.currentItem = item;
    vm.teachers = teachers;
    vm.grades = grades;

    // Watch file change with jquery due to ng-angular-upload bug
    $timeout(function() {
      $('input:file')
      .off('change', vm.generateThumbIfChanged)
      .on('change', vm.generateThumbIfChanged);
    }, 0);

    vm.progress = {
      show: false,
      percent: 0
    };

    vm.generateThumbIfChanged = function() {
      if (vm.file && vm.file[0]) {
        vm.generateThumb(vm.file[0]);
      }
    };

    vm.imageRepoUrl = imageRepoUrl;

    if (item._id) {
      vm.editMode = true;
    }
    var closeModal = function() {
      $modalInstance.close(vm.currentItem);
    };

    vm.ok = function() {
      if (vm.file) {
        console.log(vm.file[0]);
        vm.upload('foobar', function(data) {
          console.log(data);
          vm.currentItem.imageId = data.id;
          closeModal();
        });
      } else {
        closeModal();
      }
    };

    vm.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    vm.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

    vm.generateThumb = function(file) {
      console.log(file);
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

    vm.upload = function(itemId, callback) {
      vm.progress.show = true;
      vm.progress.error = null;
      $upload.upload({
        url: vm.imageRepoUrl + '/api_1_0/images',
        file: vm.file[0],
        data: {
          name: itemId,
          url: 'foo',
          width: 300,
          height: 300,
          type: 'jpeg'
        },
        fileFormDataName: 'file1',
        // method: 'POST',
        headers: {
          'project_id': '002f60ef38a841f28497b30dac37c026',
          'user_id': '42153675f85844829ef64b74230b4a65'
        }
        // url: '/upload?personId=' + itemId,
        // file: vm.file[0]
      }).progress(function(evt) {
        vm.progress.percent = parseInt(100.0 * evt.loaded / evt.total, 10);
        console.log('progress: ' + vm.progress.percent + '% file :' + evt.config.file.name);
      }).success(function(data, status, headers, config) {
        vm.progress.show = false;
        console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
        callback(data);
      }).error(function(evt) {
        vm.progress.show = false;
        vm.progress.error = 'Upload failed';
        console.log('error');
        console.log(evt);
      });
    };
  });
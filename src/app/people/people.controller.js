'use strict';

angular.module('portraitManager')
  .controller('PeopleCtrl', function($scope, $upload, $timeout, Restangular) {

    var vm = this;
    vm.currentItem = {};
    vm.editMode = false;

    var resource = Restangular.all('people');
    var teachers = Restangular.all('teachers');
    var grades = Restangular.all('grades');

    var generateCacheBuster = function() {
      vm.cachebuster = Math.round(Math.random() * 1000000);
    };

    var setImageIdIfModified = function() {
      if (vm.file) {
        var hash = Math.round(Math.random() * 1e16).toString(32);
        vm.currentItem.imageId = vm.currentItem.imageId || hash;
      }
    };

    // var refreshCacheTimer = function() {
    //   $timeout(function() {
    //     generateCacheBuster();
    //   }, 10000);
    // };

    vm.reload = function() {
      resource.getList().then(function(data) {
        vm.collection = data;
      });
    };

    vm.getTeachersAndGrades = function () {
      teachers.getList ().then (function (data) {
        vm.teachers = data;
      });
      grades.getList ().then (function (data) {
        vm.grades = data;
      });
    };
  
    vm.edit = function(item) {
      console.log('edit');
      console.log(item);
      generateCacheBuster();
      vm.currentItemReference = item;
      vm.currentItem = Restangular.copy(item);
      vm.editMode = true;
    };

    vm.create = function() {
      console.log(vm.currentItem);
      setImageIdIfModified();
      vm.uploadIfModified();
      resource.post(vm.currentItem).then(function(item) {
        vm.currentItem = item;
        item.thumbnailUrl = vm.thumbnailUrl;
        vm.currentItemReference = item;
        vm.collection.push(item);
        vm.currentItem = {};
        vm.thumbnailUrl = null;
        // vm.reload();
        // refreshCacheTimer();
      });
    };

    vm.update = function() {
      console.log(vm.currentItem);
      // vm.currentItem.__v += 1;
      setImageIdIfModified();
      vm.uploadIfModified();
      vm.currentItem.put().then(function(item) {
        console.log('update');
        console.log(item);
        vm.currentItemReference = item;
        vm.currentItem = {};
        vm.editMode = false;
        vm.thumbnailUrl = null;
        // vm.reload();
        // refreshCacheTimer();
      });
    };

    vm.destroy = function(item) {
      console.log(item);
      item.remove().then(function() {
        vm.reload();
      });
    };

    vm.cancel = function() {
      vm.editMode = false;
      vm.thumbnailUrl = null;
      vm.currentItem = {};
    };

    vm.reload();
    vm.getTeachersAndGrades ();

    vm.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    vm.thumbnailUrl = null;


    generateCacheBuster();

    vm.fileSelected = function() {
      var file = vm.file[0];
      console.log(file);
      if (file) {
        vm.generateThumb(file);
      }
    };

    vm.uploadIfModified = function() {
      if (vm.file) {
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
                vm.thumbnailUrl = e.target.result;
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
'use strict';

angular.module('portraitManager')
  .controller('PeopleCtrl', function($scope, $upload, $timeout, Restangular) {

    var vm = this;

    vm.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

    vm.currentItem = {};

    vm.editMode = false;

    vm.thumbnailUrl = null;

    var generateCacheBuster = function() {
      vm.cachebuster = Math.round(Math.random() * 1000000);
    };

    generateCacheBuster();

    var resource = Restangular.all('people');

    // This will query accounts and return a promise.
    vm.reload = function() {
      resource.getList().then(function(data) {
        vm.collection = data;
      });
    };

    vm.edit = function(item) {
      generateCacheBuster();
      vm.currentItem = Restangular.copy(item);
      vm.editMode = true;
    };

    vm.create = function() {
      console.log(vm.currentItem);
      resource.post(vm.currentItem).then(function(item) {
        vm.currentItem = item;
        vm.uploadIfModified();
        vm.currentItem = {};
        vm.thumbnailUrl = null;
        vm.reload();
      });
    };

    vm.update = function() {
      console.log(vm.currentItem);
      vm.uploadIfModified();
      vm.currentItem.put().then(function() {
        vm.currentItem = {};
        vm.editMode = false;
        vm.thumbnailUrl = null;
        vm.reload();
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

    vm.fileSelected = function() {
      var file = vm.file[0];
      console.log(file);
      if (file) {
        vm.generateThumb(file);
      }
    };

    vm.reload();

    vm.uploadIfModified = function() {
      if (vm.file) {
        vm.upload(vm.currentItem._id);
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
                vm.thumbnailUrl = e.target.result;
              });
            };
          });
        }
      }
    };

    vm.upload = function(itemId) {
      $upload.upload({
        url: '/upload?personId=' + itemId, // upload.php script, node.js route, or servlet url
        //method: 'POST' or 'PUT',
        //headers: {'Authorization': 'xxx'}, // only for html5
        //withCredentials: true,
        // data: {
        //   personId: 'foo'
        // },
        file: vm.file[0], // single file or a list of files. list is only for html5
        //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
        //fileFormDataName: myFile, // file formData name ('Content-Disposition'), server side request form name
        // could be a list of names for multiple files (html5). Default is 'file'
        //formDataAppender: function(formData, key, val){}  // customize how data is added to the formData. 
        // See #40#issuecomment-28612000 for sample code

      }).progress(function(evt) {
        console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.file.name);
      }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log('file ' + config.file.name + 'is uploaded successfully. Response: ' + data);
      });
    };
  });
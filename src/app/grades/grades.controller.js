'use strict';

angular.module('portraitManager')
  .controller('GradesCtrl', function($scope, $upload, Restangular) {

    var vm = this;
    vm.currentPerson = {};

    var people = Restangular.all('people');

    // This will query accounts and return a promise.
    vm.reload = function() {
      people.getList().then(function(people) {
        vm.people = people;
      });
    };

    vm.addPerson = function() {
      people.post(vm.currentPerson);
      vm.reload();
    };

    vm.fileSelected = function(files, event) {
      console.log(files);
      console.log(event);
    };

    vm.reload();

    vm.upload = function() {
      $upload.upload({
        url: '/upload', // upload.php script, node.js route, or servlet url
        //method: 'POST' or 'PUT',
        //headers: {'Authorization': 'xxx'}, // only for html5
        //withCredentials: true,
        data: {
          personId: 'foo'
        },
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
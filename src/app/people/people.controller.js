'use strict';

angular.module('portraitManager')
  .controller('PeopleCtrl', function($scope, $modal, $upload, $timeout, Restangular) {

    var vm = this;
    vm.currentItem = {};
    vm.editMode = false;

    var resource = Restangular.all('people');
    var teachers = Restangular.all('teachers');
    var grades = Restangular.all('grades');

    var PERSON_ATTRIBUTES = [
      'firstName',
      'lastName',
      'teacher',
      'grade',
      'imageId'
    ];

    var updateItem = function(dest, src) {
      PERSON_ATTRIBUTES.forEach(function(attr) {
        dest[attr] = src[attr];
      });
    };

    var makeCache = function (list) {
      return _.reduce (list, function (cache, item) {
               cache [item._id] = item;
               return cache;
             }, {});
    };

    vm.reload = function() {
      resource.getList().then(function(data) {
        vm.collection = data;
      });
    };

    vm.getTeachersAndGrades = function () {
      teachers.getList ().then (function (data) {
        vm.teachers = data;
        vm.teachersCache = makeCache (data);
      });
      grades.getList ().then (function (data) {
        vm.grades = data;
        vm.gradesCache = makeCache (data);
      });
    };
  
    vm.edit = function(item) {
      vm.currentItemReference = item;
      vm.currentItem = Restangular.copy(item);
      vm.editMode = true;
    };

    vm.openEditor = function(item) {
      if (item) {
        vm.currentItemReference = item;
        vm.currentItem = Restangular.copy(item);
      } else {
        vm.currentItem = {};
        vm.currentItemReference = null;
      }
      var modalInstance = $modal.open({
        templateUrl: 'app/people/person-form.html',
        controller: 'PersonFormCtrl as vm',
        size: 'lg',
        resolve: {
          item: function() {
            return vm.currentItem;
          },
          teachers: function () {
            return vm.teachers;
          },
          grades: function () {
            return vm.grades;
          }
        }
      });

      modalInstance.result.then(vm.updateFromEditor);
    };

    vm.updateFromEditor = function(item) {
      vm.currentItem = item;
      if (item._id) {
        vm.update();
      } else {
        vm.create();
      }
    };

    vm.create = function() {
      resource.post(vm.currentItem).then(function(item) {
        item.thumbnailUrl = vm.currentItem.thumbnailUrl;
        vm.collection.push(item);

        vm.currentItem = {};
        vm.editMode = false;
        vm.file = null;
      });
    };

    vm.update = function() {
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
    vm.getTeachersAndGrades ();

  });
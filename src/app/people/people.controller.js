'use strict';

angular.module('portraitManager')
  .controller('PeopleCtrl', function($scope, $upload, $timeout, Restangular, imageRepoUrl, editModal) {

    var vm = this;
    vm.currentItem = {};
    vm.editMode = false;
    vm.imageRepoUrl = imageRepoUrl;

    vm.selectOptions = ['All', 'Teacher', 'Grade'];
    vm.selectionBy = 'All';
    vm.selectedEntity = {};

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

    var makeCache = function(list) {
      return _.reduce(list, function(cache, item) {
        cache[item._id] = item;
        return cache;
      }, {});
    };

    vm.imageForItem = function(item) {
      if (item.imageId && !item.thumbnailUrl) {
        return vm.imageRepoUrl + '/api_1_0/images/blob/' + item.imageId;
      } else {
        return item.thumbnailUrl;
      }
    };

    vm.reload = function() {
      resource.getList().then(function(data) {
        vm.collection = data;
      });
    };

    vm.getTeachersAndGrades = function() {
      teachers.getList().then(function(data) {
        vm.teachers = data;
        vm.teachersCache = makeCache(data);
      });
      grades.getList().then(function(data) {
        vm.grades = data;
        vm.gradesCache = makeCache(data);
      });
    };

    vm.openEditor = function(item) {
      editModal.open(item, {
        vm: vm,
        templateUrl: 'app/people/person-form.html',
        controller: 'PersonFormCtrl',
        size: 'lg',
        resolve: {
          teachers: function() {
            return vm.teachers;
          },
          grades: function() {
            return vm.grades;
          }
        }
      });
    };

    vm.openViewer = function(item) {
      editModal.open(item, {
        vm: vm,
        templateUrl: 'app/people/person-show.html',
        controller: 'ShowModalController',
        size: 'lg',
        resolve: {
          teacher: function() {
            return vm.teachersCache[item.teacher];
          },
          grade: function() {
            return vm.gradesCache[item.grade];
          }
        }
      });
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
    vm.getTeachersAndGrades();

  });
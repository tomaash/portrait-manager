'use strict';
angular.module('portraitManager')
  .controller('ShowModalController', function($modalInstance, imageRepoUrl, item, teacher, grade) {
    var vm = this;
    vm.teacher = teacher;
    vm.grade = grade;
    vm.imageRepoUrl = imageRepoUrl;
    vm.currentItem = item;

    vm.close = function() {
      $modalInstance.dismiss('close');
    };
  });
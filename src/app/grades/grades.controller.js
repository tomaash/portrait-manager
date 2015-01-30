'use strict';

angular.module('portraitManager')
.controller('GradesCtrl', function(CtrlService) {

  CtrlService.create (this, {
      templateUrl: 'app/grades/grade-form.html',
      size: 'md',
      state: 'people-opt',
      selectionType : 'Grade',
      what: 'grades'
    });

  });
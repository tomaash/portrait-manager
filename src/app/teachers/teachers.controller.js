'use strict';

angular.module('portraitManager')
.controller('TeachersCtrl', function(CtrlService) {

  CtrlService.create (this, {
    templateUrl: 'app/teachers/teacher-form.html',
    size: 'md',
    portraitState: 'people-opt',
    portraitSelectionType : 'Teacher',
    what: 'teachers'
  });

});
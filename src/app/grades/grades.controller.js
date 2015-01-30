'use strict';

angular.module('portraitManager')
.controller('GradesCtrl', function(CtrlService) {

  CtrlService.create (this, {
    templateUrl: 'app/grades/grade-form.html',
    size: 'md',
    portraitState: 'people-opt',
    portraitSelectionType : 'Grade',
    what: 'grades'
  });

});
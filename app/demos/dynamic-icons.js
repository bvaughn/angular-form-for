angular.module('formForDocumentation').controller('DynamicIconsDemoController',
  function($scope, FormForConfiguration, flashr) {
    FormForConfiguration.enableAutoLabels();

    $scope.bindableAfterIcon = 'fa fa-arrow-circle-o-left';
    $scope.bindableBeforeIcon = 'fa fa-arrow-circle-o-right';

    $scope.formController = {};
    $scope.formData = {};

    $scope.validationRules = {
      email: {
        required: true,
        pattern: /\w+@\w+\.\w+/
      },
      password: {
        required: true,
        pattern: {
          rule: /[0-9]/,
          message: 'Your password must contain at least 1 number'
        }
      }
    };

    $scope.submit = function(data) {
      flashr.now.info('Your form has been submitted');
    };
  });

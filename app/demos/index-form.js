angular.module('formForDocumentation').controller('IndexFormDemoController',
  function($scope, FormForConfiguration, flashr) {
    FormForConfiguration.enableAutoLabels();

    $scope.formData = {};

    $scope.validationAndViewRules = {
      email: {
        inputType: 'text',
        pattern: /\w+@\w+\.\w+/,
        required: true
      },
      password: {
        inputType: 'password',
        pattern: {
          rule: /[0-9]/,
          message: 'Your password must contain at least 1 number'
        },
        required: true
      }
    };

    $scope.submit = function(data) {
      flashr.now.info('Your form has been submitted');
    };
  });

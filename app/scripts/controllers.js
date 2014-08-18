angular.module('formForDocumentation').
  controller('IndexController', function($q, $scope, $timeout) {
    $scope.formData = {};
    $scope.validationRules = {
      iAgreeToTheTermsOfService: {
        required: true
      },
      email: {
        type: 'email'
      },
      password: {
        minlength: 6,
        pattern: {
          rule: /[0-9]/,
          message: 'Your password must contain at least 1 number'
        }
      }
    };
    $scope.reset = function() {
      $scope.formData = {};
      $timeout($scope.formController.resetErrors);
    };
    $scope.submit = function() {
      alert('This is just an example form');
    };
  }).
  controller('OverviewController', function($scope) {
  }).
  controller('InputTypesController', function($scope) {
  }).
  controller('ValidationTypesController', function($scope) {
  }).
  controller('TemplateOverridesController', function($scope) {
  }).
  controller('IE8SupportController', function($scope) {
  });

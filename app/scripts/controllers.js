angular.module('formForDocumentation').
  controller('IndexController', function($q, $scope, $timeout, flashr, Github) {
    $scope.formData = {};

    $scope.githubData = Github.load().$object;

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
      flashr.now.info('This is just an example form');
    };
  });

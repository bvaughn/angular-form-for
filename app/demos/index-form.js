angular.module('formForDocumentation').controller('IndexFormDemoController',
  function($scope, $timeout, FormForConfiguration, Github, flashr) {
    // Not used by the form, but by another part of the index page.
    $scope.githubData = Github.load().$object;

    $scope.formController = {};
    $scope.formData = {};

    $scope.validationRules = {
      iAgreeToTheTermsOfService: {
        required: true
      },
      email: {
        required: true,
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
      flashr.now.success('Your form has been submitted');
    };
  });

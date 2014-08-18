angular.module('formForDocumentation').controller('AdvancedFormDemoController',
  function($scope, $timeout) {
    $scope.formData = {};

    $scope.submitFailed = function(error) {
      alert(error);
    };
});

angular.module('formForDocumentation').service('UserSignUp', function($q, $timeout) {
  return {
    validationRules: {
      agreed: {
        required: {
          rule: true,
          message: 'You must accept the TOS'
        }
      },
      email: {
        required: true,
        pattern: /\w+@\w+\.\w+/,
        custom: function(value) {
          if (value === 'briandavidvaughn@gmail.com') {
            return $q.reject('That email is already mine!');
          }

          return $q.resolve();
        }
      },
      comments: {
        required: true
      },
      gender: {
        required: true
      },
      language: {
        required: true
      },
      password: {
        required: true,
        minlength: 6,
        maxlength: 15,
        pattern: {
          rule: /[0-9]/,
          message: 'Your password must contain at least 1 number'
        }
      },
      username: {
        required: true
      },
      email: {
        type: 'email'
      },
      negativeInteger: {
        type: 'negative integer'
      },
      positiveNumber: {
        type: 'positive number'
      }
    },
    submit: function(data) {
      var deferred = $q.defer();
      $timeout(function() {
        deferred.reject('This is just a demo, silly!');
      }, 1000);
      return deferred.promise;
    }
  }
});

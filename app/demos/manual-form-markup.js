angular.module('formForDocumentation').controller('ManualFormMarkupDemoController',
  function($timeout, flashr) {
   this.formData = {};

    // Simulate a delay in loading remote data
    $timeout(function() {
      this.formData = {
        password: 'password'
      };
    },1000);

    this.genders = [
      {label: 'Male', value: '1'},
      {label: 'Female', value: '2'},
      {label: 'Unspecified', value: '3'}
    ];

    this.hobbies = [
      {value: 'art', label: 'Art'},
      {value: 'music', label: 'Music'},
      {value: 'running', label: 'Running'},
      {value: 'video_games', label: 'Video Games'}
    ];

    this.submitFailed = function(error) {
      flashr.now.info(error);
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
      signupEmail: {
        required: true,
        pattern: /\w+@\w+\.\w+/,
        custom: function(value) {
          if (value === 'briandavidvaughn@gmail.com') {
            return $q.reject('That email is already mine!');
          }

          return true; // Could also return a resolved Promise
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
      },
      rangeFrom2To5: {
        minimum: 2,
        maximum: 5,
        type: 'number'
      }
    },
    submit: function(data) {
      var deferred = $q.defer();
      $timeout(function() {
        deferred.reject('Your form has been submitted');
      }, 1000);
      return deferred.promise;
    }
  }
});

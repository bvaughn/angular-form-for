angular.module('myAngularApp').service('UserSignUp', function() {
  return {
    validationRules: {
      email: {
        required: true,
        pattern: /\w+@\w+\.\w+/
      },
      password: {
        required: true,
        minlength: 8
      }
    }
  };
});

angular.module('myAngularApp').service('UserSignUp', function() {
  this.validationRules = {
    agreed: {
      required: true,
    },
    email: {
      required: true,
      pattern: /^\w+@\w+\.\w+$/ // Simple email format
    },
    password: {
      required: true,
      minlength: 10,
      pattern: /[0-9]/ // Requires at least one number
    }
  };

  return this;
});

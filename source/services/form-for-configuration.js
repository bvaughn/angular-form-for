/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#formfor
 */
angular.module('formFor').service('FormForConfiguration',
  function() {
    return {
      defaultDebounceDuration: 1000,
      defaultSubmitComplete: angular.noop,
      defaultSubmitError: angular.noop,
      validationFailedForCustomMessage: 'Failed custom validation',
      validationFailedForPatternMessage: 'Invalid format',
      validationFailedForMaxLengthMessage: 'Must be fewer than {{num}} characters',
      validationFailedForMinLengthMessage: 'Must be at least {{num}} characters',
      validationFailedForRequiredMessage: 'Required field',
      setDefaultDebounceDuration: function(value) {
        this.defaultDebounceDuration = value;
      },
      setDefaultSubmitComplete: function(value) {
        this.defaultSubmitComplete = value;
      },
      setDefaultSubmitError: function(value) {
        this.defaultSubmitError = value;
      },
      setValidationFailedForCustomMessage: function(value) {
        this.validationFailedForCustomMessage = value;
      },
      setValidationFailedForPatternMessage: function(value) {
        this.validationFailedForPatternMessage = value;
      },
      setValidationFailedForMaxLengthMessage: function(value) {
        this.validationFailedForMaxLengthMessage = value;
      },
      setValidationFailedForMinLengthMessage: function(value) {
        this.validationFailedForMinLengthMessage = value;
      },
      setValidationFailedForRequiredMessage: function(value) {
        this.validationFailedForRequiredMessage = value;
      }
    };
  });

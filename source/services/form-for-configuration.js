/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#formfor
 */
angular.module('formFor').service('FormForConfiguration',
  function() {
    return {
      defaultSubmitComplete: angular.noop,
      defaultSubmitError: angular.noop,
      setDefaultSubmitComplete: function(value) {
        this.defaultSubmitComplete = value;
      },
      setDefaultSubmitError: function(value) {
        this.defaultSubmitError = value;
      }
    };
  });

/**
 * Organizes state management for form-submission and field validity.
 * Intended for use only by formFor directive.
 */
angular.module('formFor').factory('$FormForStateHelper', function() {
  var FormForStateHelper = function($scope) {
    $scope.errorMap = $scope.errorMap || {};
    $scope.valid = true;

    this.formScope = $scope;
    this.fieldNameToModificationMap = {};
    this.formSubmitted = false;

    this.watchable = 0;
  };

  FormForStateHelper.prototype.getFieldError = function(fieldName) {
    return this.formScope.errorMap[fieldName];
  };

  FormForStateHelper.prototype.hasFieldBeenModified = function(fieldName) {
    return this.fieldNameToModificationMap[fieldName];
  };

  FormForStateHelper.prototype.hasFormBeenSubmitted = function() {
    return this.formSubmitted;
  };

  FormForStateHelper.prototype.isFieldValid = function(fieldName) {
    return !getFieldError(fieldName);
  };

  FormForStateHelper.prototype.isFormInvalid = function() {
    return !this.isFormValid();
  };

  FormForStateHelper.prototype.isFormValid = function() {
    return _.isEmpty(this.formScope.errorMap);
  };

  FormForStateHelper.prototype.markFieldBeenModified = function(fieldName) {
    this.fieldNameToModificationMap[fieldName] = true;
    this.watchable++;
  };

  FormForStateHelper.prototype.markFormSubmitted = function() {
    this.formSubmitted = true;
    this.watchable++;
  };

  FormForStateHelper.prototype.setFieldError = function(fieldName, error) {
    if (error) {
      this.formScope.errorMap[fieldName] = error
    } else {
      delete this.formScope.errorMap[fieldName];
    }

    this.formScope.valid = this.isFormValid();
    this.watchable++;
  };

  return FormForStateHelper;
});

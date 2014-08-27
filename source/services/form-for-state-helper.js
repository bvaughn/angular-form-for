/*
 * Organizes state management for form-submission and field validity.
 * Intended for use only by formFor directive.
 */
angular.module('formFor').factory('$FormForStateHelper', function(NestedObjectHelper) {
  var FormForStateHelper = function($scope) {
    $scope.errorMap = $scope.errorMap || {};
    $scope.valid = true;

    this.formScope = $scope;
    this.fieldNameToModificationMap = {};
    this.formSubmitted = false;
    this.shallowErrorMap = {};

    this.watchable = 0;
  };

  FormForStateHelper.prototype.getFieldError = function(fieldName) {
    return NestedObjectHelper.readAttribute(this.formScope.errorMap, fieldName);
  };

  FormForStateHelper.prototype.hasFieldBeenModified = function(fieldName) {
    return NestedObjectHelper.readAttribute(this.fieldNameToModificationMap, fieldName);
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
    for (var prop in this.shallowErrorMap) {
      return false;
    }

    return true;
  };

  FormForStateHelper.prototype.resetFieldErrors = function() {
    this.formScope.errorMap = {};
  };

  FormForStateHelper.prototype.setFieldError = function(fieldName, error) {
    var safeFieldName = NestedObjectHelper.flattenAttribute(fieldName);

    NestedObjectHelper.writeAttribute(this.formScope.errorMap, fieldName, error);

    if (error) {
      this.shallowErrorMap[safeFieldName] = error;
    } else {
      delete this.shallowErrorMap[safeFieldName];
    }

    this.formScope.valid = this.isFormValid();
    this.watchable++;
  };

  FormForStateHelper.prototype.setFieldHasBeenModified = function(fieldName, value) {
    NestedObjectHelper.writeAttribute(this.fieldNameToModificationMap, fieldName, value);

    this.watchable++;
  };

  FormForStateHelper.prototype.setFormSubmitted = function(value) {
    this.formSubmitted = value;
    this.watchable++;
  };

  return FormForStateHelper;
});

describe('$FormForStateHelper', function() {
  'use strict';

  beforeEach(module('formFor'));

  var formForStateHelper;

  beforeEach(inject(function ($injector) {
    var $FormForStateHelper = $injector.get('$FormForStateHelper');

    formForStateHelper = new $FormForStateHelper({});
  }));

  describe('get/set field errors', function() {
    it('should read and write to shallow objects', function() {
      formForStateHelper.setFieldError('shallow', 'error');

      expect(formForStateHelper.getFieldError('shallow')).toMatch('error');
    });

    it('should read and write to deep objects', function() {
      formForStateHelper.setFieldError('nested.path', 'error');

      expect(formForStateHelper.getFieldError('nested.path')).toMatch('error');
    });
  });

  describe('get/set field modifications', function() {
    it('should read and write to shallow objects', function() {
      expect(formForStateHelper.hasFieldBeenModified('shallow')).toBeFalsy();

      formForStateHelper.markFieldBeenModified('shallow');

      expect(formForStateHelper.hasFieldBeenModified('shallow')).toBeTruthy();
    });

    it('should read and write to deep objects', function() {
      expect(formForStateHelper.hasFieldBeenModified('nested.path')).toBeFalsy();

      formForStateHelper.markFieldBeenModified('nested.path');

      expect(formForStateHelper.hasFieldBeenModified('nested.path')).toBeTruthy();
    });
  });

  describe('get/set form submitted', function() {
    it('should read and write to shallow objects', function() {
      expect(formForStateHelper.hasFormBeenSubmitted()).toBeFalsy();

      formForStateHelper.markFormSubmitted();

      expect(formForStateHelper.hasFormBeenSubmitted()).toBeTruthy();
    });
  });

  describe('get field/form validity', function() {
    it('should report form as invalid if and only if it contains fields with errors', function() {
      expect(formForStateHelper.isFormInvalid()).toBeFalsy();
      expect(formForStateHelper.isFormValid()).toBeTruthy();

      formForStateHelper.setFieldError('nested.path', 'error');
      formForStateHelper.setFieldError('shallow', 'error');

      expect(formForStateHelper.isFormInvalid()).toBeTruthy();
      expect(formForStateHelper.isFormValid()).toBeFalsy();

      formForStateHelper.setFieldError('nested.path', null);
      formForStateHelper.setFieldError('shallow', null);

      expect(formForStateHelper.isFormInvalid()).toBeFalsy();
      expect(formForStateHelper.isFormValid()).toBeTruthy();
    });
  });
});

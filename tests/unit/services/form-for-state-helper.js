describe('$FormForStateHelper', function() {
  'use strict';

  beforeEach(module('formFor'));

  var formForStateHelper;

  beforeEach(inject(function ($injector) {
    var $parse = $injector.get('$parse');

    formForStateHelper = new formFor.FormForStateHelper($parse, {});
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

      formForStateHelper.setFieldHasBeenModified('shallow', true);

      expect(formForStateHelper.hasFieldBeenModified('shallow')).toBeTruthy();
    });

    it('should read and write to deep objects', function() {
      expect(formForStateHelper.hasFieldBeenModified('nested.path')).toBeFalsy();

      formForStateHelper.setFieldHasBeenModified('nested.path', true);

      expect(formForStateHelper.hasFieldBeenModified('nested.path')).toBeTruthy();
    });

    it('should reset when pristine', function() {
      formForStateHelper.setFieldHasBeenModified('shallow', true);

      expect(formForStateHelper.hasFieldBeenModified('shallow')).toBeTruthy();

      formForStateHelper.setFieldHasBeenModified('shallow', false);

      expect(formForStateHelper.hasFieldBeenModified('shallow')).toBeFalsy();
    });
  });

  describe('get/set form submitted', function() {
    it('should read and write to shallow objects', function() {
      expect(formForStateHelper.hasFormBeenSubmitted()).toBeFalsy();

      formForStateHelper.setFormSubmitted(true);

      expect(formForStateHelper.hasFormBeenSubmitted()).toBeTruthy();
    });

    it('should reset when pristine', function() {
      formForStateHelper.setFormSubmitted(true);

      expect(formForStateHelper.hasFormBeenSubmitted()).toBeTruthy();

      formForStateHelper.setFormSubmitted(false);

      expect(formForStateHelper.hasFormBeenSubmitted()).toBeFalsy();
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

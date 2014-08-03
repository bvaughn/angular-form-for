describe('ModelValidator', function() {
  'use strict';

  beforeEach(module('formFor'));

  var $q;
  var $rootScope;
  var ModelValidator;
  var model;

  beforeEach(inject(function ($injector) {
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');

    ModelValidator = $injector.get('ModelValidator');
    model = {
      validationRules: {}
    };
  }));

  afterEach(inject(function() {
    $rootScope.$apply(); // Necessary for promise assertions below
  }));

  var verifyPromiseRejectedWithMessage = function(promise, expectedMessage) {
    expect(promise).toBeRejected();

    var errorMessage;

    promise.then(
      angular.noop,
      function(value) {
        errorMessage = value;
      });

    $rootScope.$apply(); // Trigger Promise resolution

    expect(errorMessage).toEqual(expectedMessage);
  };

  describe('validateField', function() {
    it('should allow a value without a rule-set', function() {
      model.validationRules = {};

      expect(ModelValidator.validateField({foo: null}, 'foo', model.validationRules)).toBeResolved();
      expect(ModelValidator.validateField({foo: undefined}, 'foo', model.validationRules)).toBeResolved();
      expect(ModelValidator.validateField({foo: ''}, 'foo', model.validationRules)).toBeResolved();
    });

    it('should handle dot notation', function() {
      model.validationRules = {
        foo: {
          bar: {
            required: true
          }
        }
      };

      expect(ModelValidator.validateField({foo: { bar: null}}, 'foo.bar', model.validationRules)).toBeRejected();
      expect(ModelValidator.validateField({foo: { bar: undefined}}, 'foo.bar', model.validationRules)).toBeRejected();
      expect(ModelValidator.validateField({foo: { bar: ''}}, 'foo.bar', model.validationRules)).toBeRejected();
    });

    it('should reject a value that only passes some of the validations', function() {
      model.validationRules = {
        foo: {
          required: true,
          minlength: 2
        }
      };

      expect(ModelValidator.validateField({foo: '1'}, 'foo', model.validationRules)).toBeRejected();
    });
  });

  describe('validateField required', function() {
    beforeEach(function() {
      model.validationRules = {
        required: {
          required: true
        }
      };
    });

    it('should reject null or undefined value', function() {
      expect(ModelValidator.validateField({required: null}, 'required', model.validationRules)).toBeRejected();
      expect(ModelValidator.validateField({required: undefined}, 'required', model.validationRules)).toBeRejected();
    });

    it('should reject an empty value', function() {
      expect(ModelValidator.validateField({required: ''}, 'required', model.validationRules)).toBeRejected();
    });

    it('should allow a non-empty value', function() {
      expect(ModelValidator.validateField({required: '1'}, 'required', model.validationRules)).toBeResolved();
      expect(ModelValidator.validateField({required: true}, 'required', model.validationRules)).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      model.validationRules = {
        requiredField: {
          required: {
            rule: true,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({requiredField: null}, 'requiredField', model.validationRules),
        'foobar');
    });
  });

  describe('validateField minlength', function() {
    beforeEach(function() {
      model.validationRules = {
        minlengthField: {
          minlength: 2
        }
      };
    });

    it('should reject null or undefined value', function() {
      expect(ModelValidator.validateField({minlengthField: null}, 'minlengthField', model.validationRules)).toBeRejected();
      expect(ModelValidator.validateField({minlengthField: undefined}, 'minlengthField', model.validationRules)).toBeRejected();
    });

    it('should reject an empty string', function() {
      expect(ModelValidator.validateField({minlengthField: ''}, 'minlengthField', model.validationRules)).toBeRejected();
    });

    it('should reject a string less than the required minimum length', function() {
      expect(ModelValidator.validateField({minlengthField: '1'}, 'minlengthField', model.validationRules)).toBeRejected();
    });

    it('should allow a string greater than or equal to the required minimum length', function() {
      expect(ModelValidator.validateField({minlengthField: '12'}, 'minlengthField', model.validationRules)).toBeResolved();
      expect(ModelValidator.validateField({minlengthField: '123'}, 'minlengthField', model.validationRules)).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      model.validationRules = {
        minlengthField: {
          minlength: {
            rule: 2,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({minlengthField: '1'}, 'minlengthField', model.validationRules),
        'foobar');
    });
  });

  describe('validateField maxlength', function() {
    beforeEach(function() {
      model.validationRules = {
        maxlengthField: {
          maxlength: 2
        }
      };
    });

    it('should allow a null or undefined value', function() {
      expect(ModelValidator.validateField({maxlengthField: null}, 'maxlengthField', model.validationRules)).toBeResolved();
      expect(ModelValidator.validateField({maxlengthField: undefined}, 'maxlengthField', model.validationRules)).toBeResolved();
    });

    it('should allow an empty string', function() {
      expect(ModelValidator.validateField({maxlengthField: ''}, 'maxlengthField', model.validationRules)).toBeResolved();
    });

    it('should allow a string less or equal to than the maximum length', function() {
      expect(ModelValidator.validateField({maxlengthField: '1'}, 'maxlengthField', model.validationRules)).toBeResolved();
      expect(ModelValidator.validateField({maxlengthField: '12'}, 'maxlengthField', model.validationRules)).toBeResolved();
    });

    it('should reject a string greater than the required maximum length', function() {
      expect(ModelValidator.validateField({maxlengthField: '123'}, 'maxlengthField', model.validationRules)).toBeRejected();
    });

    it('should allow custom error messages for failed validations', function() {
      model.validationRules = {
        maxlengthField: {
          maxlength: {
            rule: 2,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({maxlengthField: '123'}, 'maxlengthField', model.validationRules),
        'foobar');
    });
  });

  describe('validateField pattern', function() {
    beforeEach(function() {
      model.validationRules = {
        patternField: {
          pattern: /[0-9]+/
        }
      };
    });

    it('should reject a null or undefined value', function() {
      expect(ModelValidator.validateField({patternField: null}, 'patternField', model.validationRules)).toBeRejected();
      expect(ModelValidator.validateField({patternField: undefined}, 'patternField', model.validationRules)).toBeRejected();
    });

    it('should reject strings not matching the specified pattern', function() {
      expect(ModelValidator.validateField({patternField: 'abc'}, 'patternField', model.validationRules)).toBeRejected();
    });

    it('should allow strings matching the specified pattern', function() {
      expect(ModelValidator.validateField({patternField: '123'}, 'patternField', model.validationRules)).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      model.validationRules = {
        patternField: {
          pattern: {
            rule: /[0-9]+/,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({patternField: 'abc'}, 'patternField', model.validationRules),
        'foobar');
    });
  });

  describe('validateField custom', function() {
    beforeEach(function() {
      model.validationRules = {
        customField: {
          custom: function(value) {
            return value === 'allowed' ? $q.resolve() : $q.reject();
          }
        }
      };
    });

    it('should reject values rejected by the custom validator', function() {
      expect(ModelValidator.validateField({customField: 'allowed'}, 'customField', model.validationRules)).toBeResolved();
    });

    it('should allow values accepted by the custom validator', function() {
      expect(ModelValidator.validateField({customField: null}, 'customField', model.validationRules)).toBeRejected();
      expect(ModelValidator.validateField({customField: undefined}, 'customField', model.validationRules)).toBeRejected();
      expect(ModelValidator.validateField({customField: ''}, 'customField', model.validationRules)).toBeRejected();
      expect(ModelValidator.validateField({customField: 'not-alllowed'}, 'customField', model.validationRules)).toBeRejected();
    });

    it('should pass a field value as the first parameter and the full form-data object as the second', function() {
      var valueParameter, formDataParameter;

      model.validationRules = {
        customField: {
          custom: function(value, formData) {
            valueParameter = value;
            formDataParameter = formData;

            return $q.resolve();
          }
        }
      };

      var value = 'foobar';
      var formData = {customField: value}

      ModelValidator.validateField(formData, 'customField', model.validationRules);

      expect(valueParameter).toEqual(value);
      expect(formDataParameter).toEqual(formData);
    });
  });

  describe('validateFields', function() {
    it('should validate only fields specified by the whitelist', function() {
      var fooCalled, barCalled, bazCalled;

      Object.defineProperty(model.validationRules, 'foo', {
        get: function() {
          fooCalled = true;

          return undefined;
        }
      });
      Object.defineProperty(model.validationRules, 'bar', {
        get: function() {
          barCalled = true;

          return undefined;
        }
      });
      Object.defineProperty(model.validationRules, 'baz', {
        get: function() {
          bazCalled = true;

          return undefined;
        }
      });

      ModelValidator.validateFields({}, ['foo', 'bar'], model.validationRules);

      expect(fooCalled).toBeTruthy();
      expect(barCalled).toBeTruthy();
      expect(bazCalled).toBeFalsy();
    });

    it('should ignore fields that do not have a rule-set or that are not specified in the whitelist', function() {
      var fooCalled, barCalled, bazCalled;

      model.validationRules = {
        foo: {
          minlength: 1
        }
      };

      var formData = {};

      Object.defineProperty(formData, 'foo', {
        get: function() {
          fooCalled = true;

          return 'abc';
        }
      });
      Object.defineProperty(formData, 'bar', {
        get: function() {
          barCalled = true;

          return undefined;
        }
      });
      Object.defineProperty(formData, 'baz', {
        get: function() {
          bazCalled = true;

          return undefined;
        }
      });

      ModelValidator.validateFields(formData, ['foo'], model.validationRules);

      expect(fooCalled).toBeTruthy();
      expect(barCalled).toBeFalsy();
      expect(bazCalled).toBeFalsy();
    });

    it('should handle dot notation', function() {
      model.validationRules = {
        foo: {
          bar: {
            required: true
          },
          baz: {
            required: true
          }
        }
      };

      var promise = ModelValidator.validateFields({
        foo: {
          bar: null,
          baz: 'booyah'
        }
      }, ['foo.bar', 'foo.baz'], model.validationRules);

      expect(promise).toBeRejected();

      var errorMap;

      promise.then(
        angular.noop,
        function(value) {
          errorMap = value;
        });

      $rootScope.$apply(); // Trigger Promise resolution

      expect(errorMap.foo.bar).toBeTruthy();
      expect(errorMap.foo.baz).toBeFalsy();
    });
  });

  describe('validateAll', function() {
    it('should resolve on an empty set of fields', function() {
      model.validationRules = {};

      expect(ModelValidator.validateAll({}, model.validationRules)).toBeResolved();
    });

    it('should allow all values if model does not specify rule sets', function() {
      model.validationRules = {};

      expect(ModelValidator.validateAll({
        foo: 1,
        bar: true
      }, model.validationRules)).toBeResolved();
    });

    it('should resolve if model matches all of the specified rules', function() {
      model.validationRules = {
        foo: {
          required: true,
          minlength: 2,
          maxlength: 4
        },
        bar: {
          pattern: /[0-9]+/
        },
        baz: {
          custom: function(value) {
            return value === 'allowed' ? $q.resolve() : $q.reject();
          }
        }
      };

      expect(ModelValidator.validateAll({
        foo: '123',
        bar: 12,
        baz: 'allowed'
      }, model.validationRules)).toBeResolved();
    });

    it('should reject if model does not match any of the specified rules', function() {
      model.validationRules = {
        foo: {
          required: true,
          minlength: 2,
          maxlength: 4
        },
        bar: {
          pattern: /[0-9]+/
        },
        baz: {
          custom: function(value) {
            return value === 'allowed' ? $q.resolve() : $q.reject();
          }
        }
      };

      var promise = ModelValidator.validateAll({
        foo: '123',
        bar: 'abc',
        baz: true
      }, model.validationRules);

      expect(promise).toBeRejected();

      var errorMap;

      promise.then(
        angular.noop,
        function(value) {
          errorMap = value;
        });

      $rootScope.$apply(); // Trigger Promise resolution

      expect(errorMap.bar).toBeTruthy();
      expect(errorMap.baz).toBeTruthy();
    });

    it('should handle dot notation', function() {
      model.validationRules = {
        foo: {
          bar: {
            required: true
          },
          baz: {
            required: true
          }
        }
      };

      var promise = ModelValidator.validateAll({
        foo: {
          bar: null,
          baz: 'booya'
        }
      }, model.validationRules);

      expect(promise).toBeRejected();

      var errorMap;

      promise.then(
        angular.noop,
        function(value) {
          errorMap = value;
        });

      $rootScope.$apply(); // Trigger Promise resolution

      expect(errorMap.foo.bar).toBeTruthy();
      expect(errorMap.foo.baz).toBeFalsy();
    });
  });
});

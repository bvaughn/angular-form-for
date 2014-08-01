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
      ruleSetMap: {}
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
      model.ruleSetMap = {};

      expect(ModelValidator.validateField(null, 'undefined', model.ruleSetMap)).toBeResolved();
      expect(ModelValidator.validateField(undefined, 'undefined', model.ruleSetMap)).toBeResolved();
      expect(ModelValidator.validateField('', 'undefined', model.ruleSetMap)).toBeResolved();
    });

    it('should handle dot notation', function() {
      model.ruleSetMap = {
        foo: {
          bar: {
            required: true
          }
        }
      };

      expect(ModelValidator.validateField(null, 'foo.bar', model.ruleSetMap)).toBeRejected();
      expect(ModelValidator.validateField(undefined, 'foo.bar', model.ruleSetMap)).toBeRejected();
      expect(ModelValidator.validateField('', 'foo.bar', model.ruleSetMap)).toBeRejected();
    });
  });

  describe('validateField required', function() {
    beforeEach(function() {
      model.ruleSetMap = {
        required: {
          required: true
        }
      };
    });

    it('should reject null or undefined value', function() {
      expect(ModelValidator.validateField(null, 'required', model.ruleSetMap)).toBeRejected();
      expect(ModelValidator.validateField(undefined, 'required', model.ruleSetMap)).toBeRejected();
    });

    it('should reject an empty value', function() {
      expect(ModelValidator.validateField('', 'required', model.ruleSetMap)).toBeRejected();
    });

    it('should allow a non-empty value', function() {
      expect(ModelValidator.validateField('1', 'required', model.ruleSetMap)).toBeResolved();
      expect(ModelValidator.validateField(true, 'required', model.ruleSetMap)).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      model.ruleSetMap = {
        requiredField: {
          required: {
            rule: true,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField(null, 'requiredField', model.ruleSetMap),
        'foobar');
    });
  });

  describe('validateField minlength', function() {
    beforeEach(function() {
      model.ruleSetMap = {
        minlengthField: {
          minlength: 2
        }
      };
    });

    it('should reject null or undefined value', function() {
      expect(ModelValidator.validateField(null, 'minlengthField', model.ruleSetMap)).toBeRejected();
      expect(ModelValidator.validateField(undefined, 'minlengthField', model.ruleSetMap)).toBeRejected();
    });

    it('should reject an empty string', function() {
      expect(ModelValidator.validateField('', 'minlengthField', model.ruleSetMap)).toBeRejected();
    });

    it('should reject a string less than the required minimum length', function() {
      expect(ModelValidator.validateField('1', 'minlengthField', model.ruleSetMap)).toBeRejected();
    });

    it('should allow a string greater than or equal to the required minimum length', function() {
      expect(ModelValidator.validateField('12', 'minlengthField', model.ruleSetMap)).toBeResolved();
      expect(ModelValidator.validateField('123', 'minlengthField', model.ruleSetMap)).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      model.ruleSetMap = {
        minlengthField: {
          minlength: {
            rule: 2,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField('1', 'minlengthField', model.ruleSetMap),
        'foobar');
    });
  });

  describe('validateField maxlength', function() {
    beforeEach(function() {
      model.ruleSetMap = {
        maxlengthField: {
          maxlength: 2
        }
      };
    });

    it('should allow a null or undefined value', function() {
      expect(ModelValidator.validateField(null, 'maxlengthField', model.ruleSetMap)).toBeResolved();
      expect(ModelValidator.validateField(undefined, 'maxlengthField', model.ruleSetMap)).toBeResolved();
    });

    it('should allow an empty string', function() {
      expect(ModelValidator.validateField('', 'maxlengthField', model.ruleSetMap)).toBeResolved();
    });

    it('should allow a string less or equal to than the maximum length', function() {
      expect(ModelValidator.validateField('1', 'maxlengthField', model.ruleSetMap)).toBeResolved();
      expect(ModelValidator.validateField('12', 'maxlengthField', model.ruleSetMap)).toBeResolved();
    });

    it('should reject a string greater than the required maximum length', function() {
      expect(ModelValidator.validateField('123', 'maxlengthField', model.ruleSetMap)).toBeRejected();
    });

    it('should allow custom error messages for failed validations', function() {
      model.ruleSetMap = {
        maxlengthField: {
          maxlength: {
            rule: 2,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField('123', 'maxlengthField', model.ruleSetMap),
        'foobar');
    });
  });

  describe('validateField pattern', function() {
    beforeEach(function() {
      model.ruleSetMap = {
        patternField: {
          pattern: /[0-9]+/
        }
      };
    });

    it('should reject a null or undefined value', function() {
      expect(ModelValidator.validateField(null, 'patternField', model.ruleSetMap)).toBeRejected();
      expect(ModelValidator.validateField(undefined, 'patternField', model.ruleSetMap)).toBeRejected();
    });

    it('should reject strings not matching the specified pattern', function() {
      expect(ModelValidator.validateField('abc', 'patternField', model.ruleSetMap)).toBeRejected();
    });

    it('should allow strings matching the specified pattern', function() {
      expect(ModelValidator.validateField('123', 'patternField', model.ruleSetMap)).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      model.ruleSetMap = {
        patternField: {
          pattern: {
            rule: /[0-9]+/,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField('abc', 'patternField', model.ruleSetMap),
        'foobar');
    });
  });

  describe('validateField custom', function() {
    beforeEach(function() {
      model.ruleSetMap = {
        customField: {
          custom: function(value) {
            return value === 'allowed' ? $q.resolve() : $q.reject();
          }
        }
      };
    });

    it('should reject values rejected by the custom validator', function() {
      expect(ModelValidator.validateField('allowed', 'customField', model.ruleSetMap)).toBeResolved();
    });

    it('should allow values accepted by the custom validator', function() {
      expect(ModelValidator.validateField(null, 'customField', model.ruleSetMap)).toBeRejected();
      expect(ModelValidator.validateField(undefined, 'customField', model.ruleSetMap)).toBeRejected();
      expect(ModelValidator.validateField('', 'customField', model.ruleSetMap)).toBeRejected();
      expect(ModelValidator.validateField('not-alllowed', 'customField', model.ruleSetMap)).toBeRejected();
    });
  });

  describe('validateFields', function() {
    it('should validate only fields specified by the whitelist', function() {
      var fooCalled, barCalled, bazCalled;

      Object.defineProperty(model.ruleSetMap, 'foo', {
        get: function() {
          fooCalled = true;

          return undefined;
        }
      });
      Object.defineProperty(model.ruleSetMap, 'bar', {
        get: function() {
          barCalled = true;

          return undefined;
        }
      });
      Object.defineProperty(model.ruleSetMap, 'baz', {
        get: function() {
          bazCalled = true;

          return undefined;
        }
      });

      ModelValidator.validateFields({}, ['foo', 'bar'], model.ruleSetMap);

      expect(fooCalled).toBeTruthy();
      expect(barCalled).toBeTruthy();
      expect(bazCalled).toBeFalsy();
    });

    it('should ignore fields that do not have a rule-set or that are not specified in the whitelist', function() {
      var fooCalled, barCalled, bazCalled;

      model.ruleSetMap = {
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

      ModelValidator.validateFields(formData, ['foo'], model.ruleSetMap);

      expect(fooCalled).toBeTruthy();
      expect(barCalled).toBeFalsy();
      expect(bazCalled).toBeFalsy();
    });

    it('should handle dot notation', function() {
      model.ruleSetMap = {
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
      }, ['foo.bar', 'foo.baz'], model.ruleSetMap);

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
      model.ruleSetMap = {};

      expect(ModelValidator.validateAll({}, model.ruleSetMap)).toBeResolved();
    });

    it('should allow all values if model does not specify rule sets', function() {
      model.ruleSetMap = {};

      expect(ModelValidator.validateAll({
        foo: 1,
        bar: true
      }, model.ruleSetMap)).toBeResolved();
    });

    it('should resolve if model matches all of the specified rules', function() {
      model.ruleSetMap = {
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
      }, model.ruleSetMap)).toBeResolved();
    });

    it('should reject if model does not match any of the specified rules', function() {
      model.ruleSetMap = {
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
      }, model.ruleSetMap);

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
      model.ruleSetMap = {
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
      }, model.ruleSetMap);

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

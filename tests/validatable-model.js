describe('ValidatableModel', function() {
  'use strict';

  beforeEach(module('formFor'));

  var $q;
  var $rootScope;
  var ValidatableModel;

  beforeEach(inject(function ($injector) {
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');

    ValidatableModel = $injector.get('ValidatableModel');
  }));

  afterEach(inject(function() {
    $rootScope.$apply(); // Necessary for promise assertions below
  }));

  describe('validateField required', function() {
    it('should allow a value without a rule-set', function() {
      ValidatableModel.ruleSetMap = {};

      expect(ValidatableModel.validateField(null, 'undefined')).toBeResolved();
      expect(ValidatableModel.validateField(undefined, 'undefined')).toBeResolved();
      expect(ValidatableModel.validateField('', 'undefined')).toBeResolved();
    });

    it('should handle dot notation', function() {
      ValidatableModel.ruleSetMap = {
        foo: {
          bar: {
            required: true
          }
        }
      };

      expect(ValidatableModel.validateField(null, 'foo.bar')).toBeRejected();
      expect(ValidatableModel.validateField(undefined, 'foo.bar')).toBeRejected();
      expect(ValidatableModel.validateField('', 'foo.bar')).toBeRejected();
    });
  });

  describe('validateField required', function() {
    beforeEach(function() {
      ValidatableModel.ruleSetMap = {
        required: {
          required: true
        }
      };
    });

    it('should reject null or undefined value', function() {
      expect(ValidatableModel.validateField(null, 'required')).toBeRejected();
      expect(ValidatableModel.validateField(undefined, 'required')).toBeRejected();
    });

    it('should reject an empty value', function() {
      expect(ValidatableModel.validateField('', 'required')).toBeRejected();
    });

    it('should allow a non-empty value', function() {
      expect(ValidatableModel.validateField('1', 'required')).toBeResolved();
      expect(ValidatableModel.validateField(true, 'required')).toBeResolved();
    });
  });

  describe('validateField minlength', function() {
    beforeEach(function() {
      ValidatableModel.ruleSetMap = {
        minlength: {
          minlength: 2
        }
      };
    });

    it('should reject null or undefined value', function() {
      expect(ValidatableModel.validateField(null, 'minlength')).toBeRejected();
      expect(ValidatableModel.validateField(undefined, 'minlength')).toBeRejected();
    });

    it('should reject an empty string', function() {
      expect(ValidatableModel.validateField('', 'minlength')).toBeRejected();
    });

    it('should reject a string less than the required minimum length', function() {
      expect(ValidatableModel.validateField('1', 'minlength')).toBeRejected();
    });

    it('should allow a string greater than or equal to the required minimum length', function() {
      expect(ValidatableModel.validateField('12', 'minlength')).toBeResolved();
      expect(ValidatableModel.validateField('123', 'minlength')).toBeResolved();
    });
  });

  describe('validateField maxlength', function() {
    beforeEach(function() {
      ValidatableModel.ruleSetMap = {
        maxlength: {
          maxlength: 2
        }
      };
    });

    it('should allow a null or undefined value', function() {
      expect(ValidatableModel.validateField(null, 'maxlength')).toBeResolved();
      expect(ValidatableModel.validateField(undefined, 'maxlength')).toBeResolved();
    });

    it('should allow an empty string', function() {
      expect(ValidatableModel.validateField('', 'maxlength')).toBeResolved();
    });

    it('should allow a string less or equal to than the maximum length', function() {
      expect(ValidatableModel.validateField('1', 'maxlength')).toBeResolved();
      expect(ValidatableModel.validateField('12', 'maxlength')).toBeResolved();
    });

    it('should reject a string greater than the required maximum length', function() {
      expect(ValidatableModel.validateField('123', 'maxlength')).toBeRejected();
    });
  });

  describe('validateField pattern', function() {
    beforeEach(function() {
      ValidatableModel.ruleSetMap = {
        pattern: {
          pattern: /[0-9]+/
        }
      };
    });

    it('should reject a null or undefined value', function() {
      expect(ValidatableModel.validateField(null, 'pattern')).toBeRejected();
      expect(ValidatableModel.validateField(undefined, 'pattern')).toBeRejected();
    });

    it('should reject strings not matching the specified pattern', function() {
      expect(ValidatableModel.validateField('abc', 'pattern')).toBeRejected();
    });

    it('should allow strings matching the specified pattern', function() {
      expect(ValidatableModel.validateField('123', 'pattern')).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      ValidatableModel.ruleSetMap = {
        pattern: {
          pattern: {
            regExp: /[0-9]+/,
            message: 'foobar'
          }
        }
      };

      var promise = ValidatableModel.validateField('abc', 'pattern');

      expect(promise).toBeRejected();

      var errorMessage;

      promise.then(
        angular.noop,
        function(value) {
          errorMessage = value;
        });

      $rootScope.$apply(); // Trigger Promise resolution

      expect(errorMessage).toEqual('foobar');
    });
  });

  describe('validateField custom', function() {
    beforeEach(function() {
      ValidatableModel.ruleSetMap = {
        custom: {
          custom: function(value) {
            return value === 'allowed' ? $q.resolve() : $q.reject();
          }
        }
      };
    });

    it('should reject values rejected by the custom validator', function() {
      expect(ValidatableModel.validateField('allowed', 'custom')).toBeResolved();
    });

    it('should allow values accepted by the custom validator', function() {
      expect(ValidatableModel.validateField(null, 'custom')).toBeRejected();
      expect(ValidatableModel.validateField(undefined, 'custom')).toBeRejected();
      expect(ValidatableModel.validateField('', 'custom')).toBeRejected();
      expect(ValidatableModel.validateField('not-alllowed', 'custom')).toBeRejected();
    });
  });

  describe('validateFields', function() {
    it('should validate only fields specified by the whitelist', function() {
      var fooCalled, barCalled, bazCalled;

      Object.defineProperty(ValidatableModel.ruleSetMap, 'foo', {
        get: function() {
          fooCalled = true;

          return undefined;
        }
      });
      Object.defineProperty(ValidatableModel.ruleSetMap, 'bar', {
        get: function() {
          barCalled = true;

          return undefined;
        }
      });
      Object.defineProperty(ValidatableModel.ruleSetMap, 'baz', {
        get: function() {
          bazCalled = true;

          return undefined;
        }
      });

      ValidatableModel.validateFields({}, ['foo', 'bar']);

      expect(fooCalled).toBeTruthy();
      expect(barCalled).toBeTruthy();
      expect(bazCalled).toBeFalsy();
    });

    it('should ignore fields that do not have a rule-set or that are not specified in the whitelist', function() {
      var fooCalled, barCalled, bazCalled;

      ValidatableModel.ruleSetMap = {
        foo: {
          minlength: 1
        }
      };

      var model = {};

      Object.defineProperty(model, 'foo', {
        get: function() {
          fooCalled = true;

          return 'abc';
        }
      });
      Object.defineProperty(model, 'bar', {
        get: function() {
          barCalled = true;

          return undefined;
        }
      });
      Object.defineProperty(model, 'baz', {
        get: function() {
          bazCalled = true;

          return undefined;
        }
      });

      ValidatableModel.validateFields(model, ['foo']);

      expect(fooCalled).toBeTruthy();
      expect(barCalled).toBeFalsy();
      expect(bazCalled).toBeFalsy();
    });

    it('should handle dot notation', function() {
      ValidatableModel.ruleSetMap = {
        foo: {
          bar: {
            required: true
          },
          baz: {
            required: true
          }
        }
      };

      var promise = ValidatableModel.validateFields({
        foo: {
          bar: null,
          baz: 'booyah'
        }
      }, ['foo.bar', 'foo.baz']);

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
      ValidatableModel.ruleSetMap = {};

      expect(ValidatableModel.validateAll({})).toBeResolved();
    });

    it('should allow all values if model does not specify rule sets', function() {
      ValidatableModel.ruleSetMap = {};

      expect(ValidatableModel.validateAll({
        foo: 1,
        bar: true
      })).toBeResolved();
    });

    it('should resolve if model matches all of the specified rules', function() {
      ValidatableModel.ruleSetMap = {
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

      expect(ValidatableModel.validateAll({
        foo: '123',
        bar: 12,
        baz: 'allowed'
      })).toBeResolved();
    });

    it('should reject if model does not match any of the specified rules', function() {
      ValidatableModel.ruleSetMap = {
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

      var promise = ValidatableModel.validateAll({
        foo: '123',
        bar: 'abc',
        baz: true
      });

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
      ValidatableModel.ruleSetMap = {
        foo: {
          bar: {
            required: true
          },
          baz: {
            required: true
          }
        }
      };

      var promise = ValidatableModel.validateAll({
        foo: {
          bar: null,
          baz: 'booya'
        }
      });

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

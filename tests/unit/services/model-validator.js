describe('ModelValidator', function() {
  'use strict';

  beforeEach(module('formFor'));

  var $q;
  var $rootScope;
  var FormForConfiguration;
  var ModelValidator;
  var promiseUtils;
  var model;

  beforeEach(inject(function ($injector) {
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');

    FormForConfiguration = $injector.get('FormForConfiguration');
    ModelValidator = $injector.get('ModelValidator');
    promiseUtils = new formFor.PromiseUtils($q);
    model = {
      rules: {}
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
      model.rules = {};

      expect(ModelValidator.validateField({foo: null}, 'foo', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({foo: undefined}, 'foo', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({foo: ''}, 'foo', model.rules)).toBeResolved();
    });

    it('should handle dot notation', function() {
      model.rules = {
        foo: {
          bar: {
            required: true
          }
        }
      };

      expect(ModelValidator.validateField({foo: { bar: null}}, 'foo.bar', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({foo: { bar: undefined}}, 'foo.bar', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({foo: { bar: ''}}, 'foo.bar', model.rules)).toBeRejected();
    });

    it('should reject a value that only passes some of the validations', function() {
      model.rules = {
        foo: {
          required: true,
          minlength: 2
        }
      };

      expect(ModelValidator.validateField({foo: '1'}, 'foo', model.rules)).toBeRejected();
    });
  });

  describe('validateField required', function() {
    beforeEach(function() {
      model.rules = {
        required: {
          required: true
        }
      };
    });

    it('should reject null or undefined value', function() {
      expect(ModelValidator.validateField({required: null}, 'required', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({required: undefined}, 'required', model.rules)).toBeRejected();
    });

    it('should reject an empty value', function() {
      expect(ModelValidator.validateField({required: ''}, 'required', model.rules)).toBeRejected();
    });

    it('should reject a value containing only whitespace', function() {
      expect(ModelValidator.validateField({required: ' '}, 'required', model.rules)).toBeRejected();
    });

    it('should allow a non-empty value', function() {
      expect(ModelValidator.validateField({required: '1'}, 'required', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({required: true}, 'required', model.rules)).toBeResolved();
    });

    it('should allow a non-empty, though potentially falsy value', function() { // See issue #93
      expect(ModelValidator.validateField({required: 0}, 'required', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({required: '0'}, 'required', model.rules)).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      model.rules = {
        requiredField: {
          required: {
            rule: true,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({requiredField: null}, 'requiredField', model.rules),
        'foobar');
    });

    it('should not reject a truthy value when required is false', function() {
      model.rules = {
        requiredField: {
          required: {
            rule: false,
            message: 'foobar'
          }
        }
      };

      expect(ModelValidator.validateField({requiredField: '1'}, 'requiredField', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({requiredField: ''}, 'requiredField', model.rules)).toBeResolved();
    });
  });

  describe('validateField minlength', function() {
    beforeEach(function() {
      model.rules = {
        minlengthField: {
          minlength: 2
        }
      };
    });

    it('should not reject null or undefined value', function() {
      expect(ModelValidator.validateField({minlengthField: null}, 'minlengthField', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({minlengthField: undefined}, 'minlengthField', model.rules)).toBeResolved();
    });

    it('should not reject an empty string', function() {
      expect(ModelValidator.validateField({minlengthField: ''}, 'minlengthField', model.rules)).toBeResolved();
    });

    it('should reject a string less than the required minimum length', function() {
      expect(ModelValidator.validateField({minlengthField: '1'}, 'minlengthField', model.rules)).toBeRejected();
    });

    it('should allow a string greater than or equal to the required minimum length', function() {
      expect(ModelValidator.validateField({minlengthField: '12'}, 'minlengthField', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({minlengthField: '123'}, 'minlengthField', model.rules)).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      model.rules = {
        minlengthField: {
          minlength: {
            rule: 2,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({minlengthField: '1'}, 'minlengthField', model.rules),
        'foobar');
    });
  });

  describe('validateField maxlength', function() {
    beforeEach(function() {
      model.rules = {
        maxlengthField: {
          maxlength: 2
        }
      };
    });

    it('should allow a null or undefined value', function() {
      expect(ModelValidator.validateField({maxlengthField: null}, 'maxlengthField', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({maxlengthField: undefined}, 'maxlengthField', model.rules)).toBeResolved();
    });

    it('should allow an empty string', function() {
      expect(ModelValidator.validateField({maxlengthField: ''}, 'maxlengthField', model.rules)).toBeResolved();
    });

    it('should allow a string less or equal to than the maximum length', function() {
      expect(ModelValidator.validateField({maxlengthField: '1'}, 'maxlengthField', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({maxlengthField: '12'}, 'maxlengthField', model.rules)).toBeResolved();
    });

    it('should reject a string greater than the required maximum length', function() {
      expect(ModelValidator.validateField({maxlengthField: '123'}, 'maxlengthField', model.rules)).toBeRejected();
    });

    it('should allow custom error messages for failed validations', function() {
      model.rules = {
        maxlengthField: {
          maxlength: {
            rule: 2,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({maxlengthField: '123'}, 'maxlengthField', model.rules),
        'foobar');
    });
  });

  describe('validateField minimum', function() {
    beforeEach(function () {
      model.rules = {
        minimumField: {
          minimum: 2
        }
      };
    });

    it('should not reject null or undefined value', function () {
      expect(ModelValidator.validateField({minimumField: null}, 'minimumField', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({minimumField: undefined}, 'minimumField', model.rules)).toBeResolved();
    });

    it('should not reject an empty string', function () {
      expect(ModelValidator.validateField({minimumField: ''}, 'minimumField', model.rules)).toBeResolved();
    });

    it('should reject a number less than the required minimum', function () {
      expect(ModelValidator.validateField({minimumField: 1}, 'minimumField', model.rules)).toBeRejected();
    });

    it('should allow a number greater than or equal to the required minimum', function () {
      expect(ModelValidator.validateField({minimumField: 2}, 'minimumField', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({mininumField: 3}, 'mininumField', model.rules)).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      model.rules = {
        mininumField: {
          minimum: {
            rule: 2,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({mininumField: 1}, 'mininumField', model.rules), 'foobar');
    });
  });

  describe('validateField maximum', function() {
    beforeEach(function () {
      model.rules = {
        maximumField: {
          maximum: 2
        }
      };
    });

    it('should not reject null or undefined value', function () {
      expect(ModelValidator.validateField({maximumField: null}, 'maximumField', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({maximumField: undefined}, 'maximumField', model.rules)).toBeResolved();
    });

    it('should not reject an empty string', function () {
      expect(ModelValidator.validateField({maximumField: ''}, 'maximumField', model.rules)).toBeResolved();
    });

    it('should reject a number greater than the required minimum', function () {
      expect(ModelValidator.validateField({maximumField: 3}, 'maximumField', model.rules)).toBeRejected();
    });

    it('should allow a number lesser than or equal to the required minimum', function () {
      expect(ModelValidator.validateField({maximumField: 1}, 'maximumField', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({maximumField: 2}, 'maximumField', model.rules)).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      model.rules = {
        maximumField: {
          maximum: {
            rule: 2,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({maximumField: 3}, 'maximumField', model.rules), 'foobar');
    });
  });

  describe('validateField type', function() {
    beforeEach(function() {
      model.rules = {
        email: { type: 'email' },
        integer: { type: 'integer' },
        negative: { type: 'negative' },
        nonNegative: { type: 'nonNegative' },
        number: { type: 'number' },
        positive: { type: 'positive' }
      };
    });

    it('number should accept numeric input', function() {
      expect(ModelValidator.validateField({number: 123}, 'number', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({number: -123}, 'number', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({number: 1.23}, 'number', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({number: -1.23}, 'number', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({number: '123'}, 'number', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({number: '-123'}, 'number', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({number: '1.23'}, 'number', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({number: '-1.23'}, 'number', model.rules)).toBeResolved();
    });

    it('number should reject non-numeric input', function() {
      expect(ModelValidator.validateField({number: 'abc'}, 'number', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({number: '1-1'}, 'number', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({number: '1a'}, 'number', model.rules)).toBeRejected();
    });

    it('number should not require input unless the required flag is also present', function() {
      expect(ModelValidator.validateField({number: ''}, 'number', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({number: undefined}, 'number', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({number: null}, 'number', model.rules)).toBeResolved();
    });

    it('integer should accept integer input', function() {
      expect(ModelValidator.validateField({integer: 123}, 'integer', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({integer: -123}, 'integer', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({integer: '123'}, 'integer', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({integer: '-123'}, 'integer', model.rules)).toBeResolved();
    });

    it('integer should reject non-integer input', function() {
      expect(ModelValidator.validateField({integer: 'abc'}, 'integer', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({integer: '1a'}, 'integer', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({integer: 1.23}, 'integer', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({integer: -1.23}, 'integer', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({integer: '1.23'}, 'integer', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({integer: '-1.23'}, 'integer', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({integer: '1-1'}, 'integer', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({integer: '.-11'}, 'integer', model.rules)).toBeRejected();
    });

    it('integer should not require input unless the required flag is also present', function() {
      expect(ModelValidator.validateField({integer: ''}, 'integer', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({integer: undefined}, 'integer', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({integer: null}, 'integer', model.rules)).toBeResolved();
    });

    it('positive should accept positive numeric input', function() {
      expect(ModelValidator.validateField({positive: 123}, 'positive', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({positive: 1.23}, 'positive', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({positive: '123'}, 'positive', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({positive: '1.23'}, 'positive', model.rules)).toBeResolved();
    });

    it('positive should reject non-positive numeric input', function() {
      expect(ModelValidator.validateField({positive: -123}, 'positive', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({positive: -1.23}, 'positive', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({positive: 0}, 'positive', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({positive: '-123'}, 'positive', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({positive: '-1.23'}, 'positive', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({positive: '0'}, 'positive', model.rules)).toBeRejected();
    });

    it('positive should not require input unless the required flag is also present', function() {
      expect(ModelValidator.validateField({positive: ''}, 'positive', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({positive: undefined}, 'positive', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({positive: null}, 'positive', model.rules)).toBeResolved();
    });

    it('non-negative should accept positive numeric input', function() {
      expect(ModelValidator.validateField({nonNegative: 123}, 'nonNegative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({nonNegative: 1.23}, 'nonNegative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({nonNegative: 0}, 'nonNegative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({nonNegative: '123'}, 'nonNegative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({nonNegative: '1.23'}, 'nonNegative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({nonNegative: '0'}, 'nonNegative', model.rules)).toBeResolved();
    });

    it('non-negative should reject negative numeric input', function() {
      expect(ModelValidator.validateField({nonNegative: -123}, 'nonNegative', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({nonNegative: -1.23}, 'nonNegative', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({nonNegative: '-123'}, 'nonNegative', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({nonNegative: '-1.23'}, 'nonNegative', model.rules)).toBeRejected();
    });

    it('non-negative should not require input unless the required flag is also present', function() {
      expect(ModelValidator.validateField({nonNegative: ''}, 'nonNegative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({nonNegative: undefined}, 'nonNegative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({nonNegative: null}, 'nonNegative', model.rules)).toBeResolved();
    });

    it('negative should accept negative numeric input', function() {
      expect(ModelValidator.validateField({negative: -123}, 'negative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({negative: -1.23}, 'negative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({negative: '-123'}, 'negative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({negative: '-1.23'}, 'negative', model.rules)).toBeResolved();
    });

    it('negative should reject negative numeric input', function() {
      expect(ModelValidator.validateField({negative: 123}, 'negative', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({negative: 1.23}, 'negative', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({negative: '123'}, 'negative', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({negative: '1.23'}, 'negative', model.rules)).toBeRejected();
    });

    it('negative should not require input unless the required flag is also present', function() {
      expect(ModelValidator.validateField({negative: ''}, 'negative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({negative: undefined}, 'negative', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({negative: null}, 'negative', model.rules)).toBeResolved();
    });

    it('email should accept email input', function() {
      expect(ModelValidator.validateField({email: 'abc@abc.com'}, 'email', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({email: 'abc.def@abc.com'}, 'email', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({email: 'abc+def@abc.com'}, 'email', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({email: 'hello@world.co.il'}, 'email', model.rules)).toBeResolved(); // Issue #72
    });

    it('email should reject non-email', function() {
      expect(ModelValidator.validateField({email: 'abc'}, 'email', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({email: 'abc@'}, 'email', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({email: 'abc@.'}, 'email', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({email: 'abc@a.'}, 'email', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({email: 'abc@.a'}, 'email', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({email: '@'}, 'email', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({email: '@.'}, 'email', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({email: '@abc'}, 'email', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({email: '@abc.'}, 'email', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({email: '@abc.com'}, 'email', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({email: 'abc.com'}, 'email', model.rules)).toBeRejected();
    });

    it('email should not require input unless the required flag is also present', function() {
      expect(ModelValidator.validateField({email: ''}, 'email', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({email: undefined}, 'email', model.rules)).toBeResolved();
      expect(ModelValidator.validateField({email: null}, 'email', model.rules)).toBeResolved();
    });

    it('should allow custom error messages for failed email validations', function() {
      model.rules = { email: { type: { rule: 'email', message: 'foobar email' } } };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({email: 'invalid'}, 'email', model.rules),
        'foobar email');
    });

    it('should allow custom error messages for failed integer validations', function() {
      model.rules = { integer: { type: { rule: 'integer', message: 'foobar integer' } } };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({integer: 'invalid'}, 'integer', model.rules),
        'foobar integer');
    });

    it('should allow custom error messages for failed negative validations', function() {
      model.rules = { negative: { type: { rule: 'negative', message: 'foobar negative' } } };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({negative: 1}, 'negative', model.rules),
        'foobar negative');
    });

    it('should allow custom error messages for failed number validations', function() {
      model.rules = { number: { type: { rule: 'number', message: 'foobar number' } } };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({number: 'invalid'}, 'number', model.rules),
        'foobar number');
    });

    it('should allow custom error messages for failed positive validations', function() {
      model.rules = { positive: { type: { rule: 'positive', message: 'foobar positive' } } };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({positive: -1}, 'positive', model.rules),
        'foobar positive');
    });
  });

  describe('validateField pattern', function() {
    beforeEach(function() {
      model.rules = {
        patternField: {
          pattern: /[0-9]+/
        }
      };
    });

    it('should reject a null or undefined value', function() {
      expect(ModelValidator.validateField({patternField: null}, 'patternField', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({patternField: undefined}, 'patternField', model.rules)).toBeRejected();
    });

    it('should reject strings not matching the specified pattern', function() {
      expect(ModelValidator.validateField({patternField: 'abc'}, 'patternField', model.rules)).toBeRejected();
    });

    it('should allow strings matching the specified pattern', function() {
      expect(ModelValidator.validateField({patternField: '123'}, 'patternField', model.rules)).toBeResolved();
    });

    it('should allow custom error messages for failed validations', function() {
      model.rules = {
        patternField: {
          pattern: {
            rule: /[0-9]+/,
            message: 'foobar'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({patternField: 'abc'}, 'patternField', model.rules),
        'foobar');
    });
  });

  describe('validateField custom', function() {
    beforeEach(function() {
      model.rules = {
        customField: {
          custom: function(value) {
            return value === 'allowed' ? promiseUtils.resolve() : $q.reject();
          }
        }
      };
    });

    it('should allow values accepted by the custom validator', function() {
      expect(ModelValidator.validateField({customField: 'allowed'}, 'customField', model.rules)).toBeResolved();
    });

    it('should reject values rejected by the custom validator', function() {
      expect(ModelValidator.validateField({customField: null}, 'customField', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({customField: undefined}, 'customField', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({customField: ''}, 'customField', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({customField: 'not-alllowed'}, 'customField', model.rules)).toBeRejected();
    });

    it('should pass a field value as the first parameter and the full form-data object as the second', function() {
      var valueParameter, formDataParameter;

      model.rules = {
        customField: {
          custom: function(value, formData) {
            valueParameter = value;
            formDataParameter = formData;

            return promiseUtils.resolve();
          }
        }
      };

      var value = 'foobar';
      var formData = {customField: value}

      ModelValidator.validateField(formData, 'customField', model.rules);

      expect(valueParameter).toEqual(value);
      expect(formDataParameter).toEqual(formData);
    });

    it('should reject a custom validation that is not a function', function() {
      model.rules = {
        customField: {
          custom: true
        }
      };

      expect(ModelValidator.validateField({customField: 'allowed'}, 'customField', model.rules)).toBeRejected();
    });

    it('should treat truthy values as successful validations', function() {
      model.rules = {
        customField: {
          custom: function() {
            return true;
          }
        }
      };

      expect(ModelValidator.validateField({customField: 'allowed'}, 'customField', model.rules)).toBeResolved();
    });

    it('should treat falsy values as failed validations', function() {
      model.rules = {
        customField: {
          custom: function() {
            return false;
          }
        }
      };

      expect(ModelValidator.validateField({customField: 'allowed'}, 'customField', model.rules)).toBeRejected();
    });

    it('should support inline custom error messages for failed falsy validations', function() {
      model.rules = {
        customField: {
          custom: {
            rule: function() {
              return false;
            },
            message: 'failed custom'
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({customField: 'abc'}, 'customField', model.rules),
        'failed custom');
    });

    it('should support custom validations that throw errors with custom error messages for failed validations', function() {
      model.rules = {
        customField: {
          custom: function() {
            throw Error('i am an error');
          }
        }
      };

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField({customField: 'abc'}, 'customField', model.rules),
        'i am an error');
    });
  });

  describe('getRulesFor_', function() {
    beforeEach(function() {
      model.rules = {
        things: {
          collection: {
            fields: {
              name: {
                required: true
              }
            }
          }
        },
        thing: {
          name: {
            required: true
          }
        }
      };
    });

    it('should strip array brackets from collection field names', function() {
      expect(ModelValidator.getRulesFor_('things[0].name', model.rules)).toEqual(model.rules.things.collection.fields.name);
    });

    it('should not modify field anmes without array brackets', function() {
      expect(ModelValidator.getRulesFor_('thing.name', model.rules)).toEqual(model.rules.thing.name);
    });
  });

  describe('validateCollection and validateField for collections', function() {
    beforeEach(function() {
      model.rules = {
        things: {
          collection: {
            min: 2,
            max: 4
          }
        }
      };
    });

    it('should strip array brackets from collection field names', function() {
      model.rules.things.collection = { fields: { name: { required: true } } };

      expect(ModelValidator.validateField({things: null}, 'things[0].name', model.rules)).toBeRejected();
      expect(ModelValidator.validateField({things: [{name: 'Brian'}]}, 'things[0].name', model.rules)).toBeResolved();
    });

    it('should validate collections size min/max', function() {
      expect(ModelValidator.validateCollection({}, 'things', model.rules)).toBeRejected();
      expect(ModelValidator.validateCollection({things: null},             'things', model.rules)).toBeRejected();
      expect(ModelValidator.validateCollection({things: []},               'things', model.rules)).toBeRejected();
      expect(ModelValidator.validateCollection({things: [{}]},             'things', model.rules)).toBeRejected();

      expect(ModelValidator.validateCollection({things: [{},{}]},          'things', model.rules)).toBeResolved();
      expect(ModelValidator.validateCollection({things: [{},{},{}]},       'things', model.rules)).toBeResolved();
      expect(ModelValidator.validateCollection({things: [{},{},{},{}]},    'things', model.rules)).toBeResolved();

      expect(ModelValidator.validateCollection({things: [{},{},{},{},{}]}, 'things', model.rules)).toBeRejected();
    });

    it('should validate custom collections validation error messages', function() {
      model.rules.things.collection.min = {rule: 2, message: 'custom min'};
      model.rules.things.collection.max = {rule: 4, message: 'custom max'};

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateCollection({things: []}, 'things', model.rules),
        'custom min');

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateCollection({things: [{},{},{},{},{}]}, 'things', model.rules),
        'custom max');
    });
  }); // validateCollection

  describe('validateFields', function() {
    it('should validate only fields specified by the whitelist', function() {
      var fooCalled, barCalled, bazCalled;

      Object.defineProperty(model.rules, 'foo', {
        get: function() {
          fooCalled = true;

          return undefined;
        }
      });
      Object.defineProperty(model.rules, 'bar', {
        get: function() {
          barCalled = true;

          return undefined;
        }
      });
      Object.defineProperty(model.rules, 'baz', {
        get: function() {
          bazCalled = true;

          return undefined;
        }
      });

      ModelValidator.validateFields({}, ['foo', 'bar'], model.rules);

      expect(fooCalled).toBeTruthy();
      expect(barCalled).toBeTruthy();
      expect(bazCalled).toBeFalsy();
    });

    it('should ignore fields that do not have a rule-set or that are not specified in the whitelist', function() {
      var fooCalled, barCalled, bazCalled;

      model.rules = {
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

      ModelValidator.validateFields(formData, ['foo'], model.rules);

      expect(fooCalled).toBeTruthy();
      expect(barCalled).toBeFalsy();
      expect(bazCalled).toBeFalsy();
    });

    it('should handle dot notation', function() {
      model.rules = {
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
      }, ['foo.bar', 'foo.baz'], model.rules);

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
    it('should resolve if model matches all of the specified rules', function() {
      model.rules = {
        foo: {
          collection: { min: 2 }
        },
        bar: {
          collection: { max: 4 }
        }
      };

      expect(ModelValidator.validateFields({
        foo: ['1','2'],
        bar: ['1','2']
      }, ['foo', 'bar'], model.rules)).toBeResolved();
    });

    it('should reject if model does not match any of the specified rules', function() {
      model.rules = {
        foo: {
          collection: { min: 2 }
        },
        bar: {
          collection: { max: 4 }
        }
      };

      var promise = ModelValidator.validateFields({
        foo: ['1'],
        bar: ['1','2','3','4','5']
      }, ['foo', 'bar'], model.rules);

      expect(promise).toBeRejected();

      var errorMap;

      promise.then(
        angular.noop,
        function(value) {
          errorMap = value;
        });

      $rootScope.$apply(); // Trigger Promise resolution

      expect(errorMap.foo).toBeTruthy();
      expect(errorMap.bar).toBeTruthy();
    });
  }); // validateFields

  describe('validateAll', function() {
    it('should resolve on an empty set of fields', function() {
      model.rules = {};

      expect(ModelValidator.validateAll({}, model.rules)).toBeResolved();
    });

    it('should allow all values if model does not specify rule sets', function() {
      model.rules = {};

      expect(ModelValidator.validateAll({
        foo: 1,
        bar: true
      }, model.rules)).toBeResolved();
    });

    it('should resolve if model matches all of the specified rules', function() {
      model.rules = {
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
            return value === 'allowed' ? promiseUtils.resolve() : $q.reject();
          }
        }
      };

      expect(ModelValidator.validateAll({
        foo: '123',
        bar: 12,
        baz: 'allowed'
      }, model.rules)).toBeResolved();
    });

    it('should reject if model does not match any of the specified rules', function() {
      model.rules = {
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
            return value === 'allowed' ? promiseUtils.resolve() : $q.reject();
          }
        }
      };

      var promise = ModelValidator.validateAll({
        foo: '123',
        bar: 'abc',
        baz: true
      }, model.rules);

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
      model.rules = {
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
      }, model.rules);

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

  describe('FormForConfiguration custom validation error messages', function() {
    var testCustomValidationFailureMessage = function(validationAttribute, validationValue, objectValue, expectedMessage) {
      var rules = {};
      rules.field = {};
      rules.field[validationAttribute] = validationValue;

      var object = {};
      object.field = objectValue;

      verifyPromiseRejectedWithMessage(
        ModelValidator.validateField(object, 'field', rules),
        expectedMessage);
    };

    it('should allow overrides for required', function() {
      FormForConfiguration.setValidationFailedForRequiredMessage('custom required');

      testCustomValidationFailureMessage('required', true, null, 'custom required');
    });

    it('should allow overrides for minlength', function() {
      FormForConfiguration.setValidationFailedForMinLengthMessage('custom minlength');

      testCustomValidationFailureMessage('minlength', 2, '1', 'custom minlength');
    });

    it('should allow overrides for maxlength', function() {
      FormForConfiguration.setValidationFailedForMaxLengthMessage('custom maxlength');

      testCustomValidationFailureMessage('maxlength', 2, '123', 'custom maxlength');
    });

    it('should allow overrides for pattern', function() {
      FormForConfiguration.setValidationFailedForPatternMessage('custom pattern');

      testCustomValidationFailureMessage('pattern', /a/, '123', 'custom pattern');
    });

    it('should allow overrides for type integer', function() {
      FormForConfiguration.setValidationFailedForIntegerTypeMessage('custom type integer');

      testCustomValidationFailureMessage('type', 'integer', 'invalid', 'custom type integer');
    });

    it('should allow overrides for type number', function() {
      FormForConfiguration.setValidationFailedForNumericTypeMessage('custom type number');

      testCustomValidationFailureMessage('type', 'number', 'invalid', 'custom type number');
    });

    it('should allow overrides for type negative', function() {
      FormForConfiguration.setValidationFailedForNegativeTypeMessage('custom type negative');

      testCustomValidationFailureMessage('type', 'negative integer', '1', 'custom type negative');
    });

    it('should allow overrides for type non-negative', function() {
      FormForConfiguration.setValidationFailedForNonNegativeTypeMessage('custom type non-negative');

      testCustomValidationFailureMessage('type', 'nonNegative integer', '-1', 'custom type non-negative');
    });

    it('should allow overrides for type positive', function() {
      FormForConfiguration.setValidationFailedForPositiveTypeMessage('custom type positive');

      testCustomValidationFailureMessage('type', 'positive integer', '-1', 'custom type positive');
    });

    it('should allow overrides for type email', function() {
      FormForConfiguration.setValidationFailedForEmailTypeMessage('custom type email');

      testCustomValidationFailureMessage('type', 'email', 'invalid', 'custom type email');
    });

    it('should allow overrides for custom', function() {
      FormForConfiguration.setValidationFailedForCustomMessage('custom custom');

      var custom = function() {
        return $q.reject();
      };

      testCustomValidationFailureMessage('custom', custom, null, 'custom custom');
    });
  });
});

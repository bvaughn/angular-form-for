/**
 * ModelValidator service used by formFor to determine if each field in the form-data passes validation rules.
 * This service is not intended for use outside of the formFor module/library.
 */
angular.module('formFor').service('ModelValidator', function($parse, $q) {

  /**
   * Crawls a model and returns a flattened set of all attributed (using dot notation).
   * This converts an Object like: {foo: {bar: true}, baz: true}
   * Into an Array like ['foo', 'foo.bar', 'baz']
   */
  var flattenModelKeys = function(model) {
    var internalCrawler = function(model, path, array) {
      array = array || [];

      var prefix = path ? path + '.' : '';

      _.forIn(model,
        function(value, relativeKey) {
          var fullKey = prefix + relativeKey;

          array.push(fullKey);

          internalCrawler(value, fullKey, array);
        });

      return array;
    };

    return internalCrawler(model);
  };

  /**
   * Returns the rulset associated with the specified field-name.
   * This function guards against dot notation for nested references (ex. 'foo.bar').
   *
   * @param fieldName Uniquely identifies the field (dot notation supported*)
   * @param validationRules Set of named validation rules
   */
  var getRulesForField = function(fieldName, validationRules) {
    return $parse(fieldName)(validationRules);
  };

  /**
   * Validates the model against all rules in the validationRules.
   * This method returns a promise to be resolved on successful validation,
   * Or rejected with a map of field-name to error-message.
   *
   * @param model Model data to validate with any existing rules
   * @param validationRules Set of named validation rules
   */
  this.validateAll = function(model, validationRules) {
    var fields = flattenModelKeys(validationRules);

    return this.validateFields(model, fields, validationRules);
  };

  /**
   * Validates the values in model with the rules defined in the current validationRules.
   * This method returns a promise to be resolved on successful validation,
   * Or rejected with a map of field-name to error-message.
   *
   * @param model Model data
   * @param fieldNames Whitelist set of fields to validate for the given model; values outside of this list will be ignored
   * @param validationRules Set of named validation rules
   */
  this.validateFields = function(model, fieldNames, validationRules) {
    var deferred = $q.defer();
    var promises = [];
    var errorMap = {};
    var that = this;

    _.each(fieldNames, function(fieldName) {
      var rules = getRulesForField(fieldName, validationRules);

      if (rules) {
        var value = $parse(fieldName)(model);

        var promise = that.validateField(value, model, fieldName, validationRules);

        promise.then(
          angular.noop,
          function(error) {
            $parse(fieldName).assign(errorMap, error);
          });

        promises.push(promise);
      }
    });

    $q.waitForAll(promises).then(
      deferred.resolve,
      function() {
        deferred.reject(errorMap);
      });

    return deferred.promise;
  };

  /**
   * Validates a value against the related rule-set (within validationRules).
   * This method returns a promise to be resolved on successful validation.
   * If validation fails the promise will be rejected with an error message.
   *
   * @param value Value (typically a string) to evaluate against the rule-set specified for the assciated field
   * @param model Form-data object model is contained within
   * @param fieldName Name of field used to associate the rule-set map with a given value
   * @param validationRules Set of named validation rules
   */
  this.validateField = function(value, model, fieldName, validationRules) {
    var rules = getRulesForField(fieldName, validationRules);

    if (rules) {
      value = value || '';

      if (rules.required) {
        var required = _.isObject(rules.required) ? rules.required.rule : rules.required;

        if (!!value !== required) {
          var errorMessage = _.isObject(rules.required) ? rules.required.message : 'Required field';

          return $q.reject(errorMessage);
        }
      }

      if (rules.minlength) {
        var minlength = _.isObject(rules.minlength) ? rules.minlength.rule : rules.minlength;

        if (value.length < minlength) {
          var errorMessage = _.isObject(rules.minlength) ? rules.minlength.message : 'Must be at least ' + minlength + ' characters';

          return $q.reject(errorMessage);
        }
      }

      if (rules.maxlength) {
        var maxlength = _.isObject(rules.maxlength) ? rules.maxlength.rule : rules.maxlength;

        if (value.length > maxlength) {
          var errorMessage = _.isObject(rules.maxlength) ? rules.maxlength.message : 'Must be fewer than ' + maxlength + ' characters';

          return $q.reject(errorMessage);
        }
      }

      if (rules.pattern) {
        var pattern = _.isRegExp(rules.pattern) ? rules.pattern : rules.pattern.rule;

        if (!pattern.exec(value)) {
          var errorMessage = _.isRegExp(rules.pattern) ? 'Invalid format' : rules.pattern.message;

          return $q.reject(errorMessage);
        }
      }

      if (rules.custom) {
        return rules.custom(value, model).then(
          function(reason) {
            return $q.resolve(reason);
          },
          function(reason) {
            return $q.reject(reason || 'Failed custom validation');
          });
      }
    }

    return $q.resolve();
  };

  return this;
});

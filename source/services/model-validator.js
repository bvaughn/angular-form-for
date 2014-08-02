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
   */
  this.getRuleSetForField = function(fieldName, validationRules) {
    return $parse(fieldName)(validationRules);
  };

  /**
   * Validates the model against all rules in the validationRules.
   * This method returns a promise to be resolved on successful validation,
   * Or rejected with a map of field-name to error-message.
   *
   * @param model Model data to validate with any existing rules
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
   */
  this.validateFields = function(model, fieldNames, validationRules) {
    var deferred = $q.defer();
    var promises = [];
    var errorMap = {};
    var that = this;

    _.each(fieldNames, function(fieldName) {
      var ruleSet = that.getRuleSetForField(fieldName, validationRules);

      if (ruleSet) {
        var value = $parse(fieldName)(model);

        var promise = that.validateField(value, fieldName, validationRules);

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
   * @param fieldName Name of field used to associate the rule-set map with a given value
   */
  this.validateField = function(value, fieldName, validationRules) {
    var ruleSet = this.getRuleSetForField(fieldName, validationRules);

    if (ruleSet) {
      value = value || '';

      if (ruleSet.required) {
        var required = _.isObject(ruleSet.required) ? ruleSet.required.rule : ruleSet.required;

        if (!!value !== required) {
          var errorMessage = _.isObject(ruleSet.required) ? ruleSet.required.message : 'Required field';

          return $q.reject(errorMessage);
        }
      }

      if (ruleSet.minlength) {
        var minlength = _.isObject(ruleSet.minlength) ? ruleSet.minlength.rule : ruleSet.minlength;

        if (value.length < minlength) {
          var errorMessage = _.isObject(ruleSet.minlength) ? ruleSet.minlength.message : 'Must be at least ' + minlength + ' characters';

          return $q.reject(errorMessage);
        }
      }

      if (ruleSet.maxlength) {
        var maxlength = _.isObject(ruleSet.maxlength) ? ruleSet.maxlength.rule : ruleSet.maxlength;

        if (value.length > maxlength) {
          var errorMessage = _.isObject(ruleSet.maxlength) ? ruleSet.maxlength.message : 'Must be fewer than ' + maxlength + ' characters';

          return $q.reject(errorMessage);
        }
      }

      if (ruleSet.pattern) {
        var pattern = _.isRegExp(ruleSet.pattern) ? ruleSet.pattern : ruleSet.pattern.rule;

        if (!pattern.exec(value)) {
          var errorMessage = _.isRegExp(ruleSet.pattern) ? 'Invalid format' : ruleSet.pattern.message;

          return $q.reject(errorMessage);
        }
      }

      if (ruleSet.custom) {
        return ruleSet.custom(value).then(
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

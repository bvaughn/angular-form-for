angular.module('formFor').service('ValidatableModel', function($parse, $q) {

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
   * Map of field-name to validation rules.
   * This map must be overridden by sub-classes.
   * The following validation criteria are supported:
   * • required: Boolean (defaults to false)
   * • minlength: Integer (defaults to 0)
   * • maxlength: Integer (defaults to max value)
   * • pattern: Regular expression OR an object containing 2 keys
   *   • regExp: A regular expression to validate field value with
   *   • message: Custom error message to reject with if validation fails
   * • custom: A function accepting a paremeter (current field value) and returning a Promise.
   *           If the value is invalid, the Promise should be rejected with an error message.
   */
  this.ruleSetMap = {};

  /**
   * Returns the rulset associated with the specified field-name.
   * This function guards against dot notation for nested references (ex. 'foo.bar').
   */
  this.getRuleSetForField = function(fieldName) {
    return $parse(fieldName)(this.ruleSetMap);
  };

  /**
   * Returns a promise to be resolved on successful update (or rejected on failure).
   * This function must be overridden by sub-classes.
   */
  this.save = function() {
    return $q.reject('This type of record does not support saving yet');
  };

  /**
   * Validates the model against all rules in the ruleSetMap.
   * This method returns a promise to be resolved on successful validation,
   * Or rejected with a map of field-name to error-message.
   *
   * @param model Model data to validate with any existing rules
   */
  this.validateAll = function(model) {
    var fields = flattenModelKeys(this.ruleSetMap);

    return this.validateFields(model, fields);
  };

  /**
   * Validates the values in model with the rules defined in the current ruleSetMap.
   * This method returns a promise to be resolved on successful validation,
   * Or rejected with a map of field-name to error-message.
   *
   * @param model Model data
   * @param fieldNames Whitelist set of fields to validate for the given model; values outside of this list will be ignored
   */
  this.validateFields = function(model, fieldNames) {
    var deferred = $q.defer();
    var promises = [];
    var errorMap = {};
    var that = this;

    _.each(fieldNames, function(fieldName) {
      var ruleSet = that.getRuleSetForField(fieldName);

      if (ruleSet) {
        var value = $parse(fieldName)(model);

        var promise = that.validateField(value, fieldName);

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
   * Validates a value against the related rule-set (within ruleSetMap).
   * This method returns a promise to be resolved on successful validation.
   * If validation fails the promise will be rejected with an error message.
   *
   * @param value Value (typically a string) to evaluate against the rule-set specified for the assciated field
   * @param fieldName Name of field used to associate the rule-set map with a given value
   */
  this.validateField = function(value, fieldName) {
    var ruleSet = this.getRuleSetForField(fieldName);

    if (ruleSet) {
      value = value || '';

      if (ruleSet.required && !value) {
        return $q.reject('Required field');
      } else if (ruleSet.minlength && value.length < ruleSet.minlength) {
        return $q.reject('Must be at least ' + ruleSet.minlength + ' characters');
      } else if (ruleSet.maxlength && value.length > ruleSet.maxlength) {
        return $q.reject('Must be fewer than ' + ruleSet.maxlength + ' characters');
      } else if (ruleSet.pattern) {
        // Patterns support custom error messages so handle them carefully.
        var pattern = _.isRegExp(ruleSet.pattern) ? ruleSet.pattern : ruleSet.pattern.regExp;

        if (!pattern.exec(value)) {
          var errorMessage = _.isRegExp(ruleSet.pattern) ? 'Invalid format' : ruleSet.pattern.message;

          return $q.reject(errorMessage);
        }
      } else if (ruleSet.custom) {
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

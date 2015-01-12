/**
 * @ngdoc Services
 * @name ModelValidator
 * @description
 * ModelValidator service used by formFor to determine if each field in the form-data passes validation rules.
 * This service is not intended for use outside of the formFor module/library.
 */
angular.module('formFor').service('ModelValidator',
  function($interpolate, $q, FormForConfiguration, NestedObjectHelper) {

    /*
     * Strip array brackets from field names so that model values can be mapped to rules.
     * For instance:
     * • 'foo[0].bar' should be validated against 'foo.collection.fields.bar'.
     */
    this.$getRulesForFieldName = function(validationRules, fieldName) {
      fieldName = fieldName.replace(/\[[^\]]+\]/g, '.collection.fields');

      return NestedObjectHelper.readAttribute(validationRules, fieldName);
    };

    /**
     * Convenience method for determining if the specified collection is flagged as required (aka min length).
     */
    this.isCollectionRequired = function(fieldName, validationRules) {
      var rules = this.$getRulesForFieldName(validationRules, fieldName);

      return  rules &&
              rules.collection &&
              rules.collection.min &&
              (angular.isObject(rules.collection.min) ? rules.collection.min.rule : rules.collection.min);
    };

    /**
     * Convenience method for determining if the specified field is flagged as required.
     */
    this.isFieldRequired = function(fieldName, validationRules) {
      var rules = this.$getRulesForFieldName(validationRules, fieldName);

      return  rules &&
              rules.required &&
              (angular.isObject(rules.required) ? rules.required.rule : rules.required);
    };

    /**
     * Validates the model against all rules in the validationRules.
     * This method returns a promise to be resolved on successful validation,
     * Or rejected with a map of field-name to error-message.
     * @memberof ModelValidator
     * @param {Object} model Form-data object model is contained within
     * @param {Object} validationRules Set of named validation rules
     * @returns {Promise} To be resolved or rejected based on validation success or failure.
     */
    this.validateAll = function(model, validationRules) {
      var fields = NestedObjectHelper.flattenObjectKeys(validationRules);

      return this.validateFields(model, fields, validationRules);
    };

    /**
     * Validates the values in model with the rules defined in the current validationRules.
     * This method returns a promise to be resolved on successful validation,
     * Or rejected with a map of field-name to error-message.
     * @memberof ModelValidator
     * @param {Object} model Form-data object model is contained within
     * @param {Array} fieldNames Whitelist set of fields to validate for the given model; values outside of this list will be ignored
     * @param {Object} validationRules Set of named validation rules
     * @returns {Promise} To be resolved or rejected based on validation success or failure.
     */
    this.validateFields = function(model, fieldNames, validationRules) {
      var deferred = $q.defer();
      var promises = [];
      var errorMap = {};

      angular.forEach(fieldNames, function(fieldName) {
        var rules = this.$getRulesForFieldName(validationRules, fieldName);

        if (rules) {
          var promise;

          if (rules.collection) {
            promise = this.validateCollection(model, fieldName, validationRules);
          } else {
            promise = this.validateField(model, fieldName, validationRules);
          }

          promise.then(
            angular.noop,
            function(error) {
              NestedObjectHelper.writeAttribute(errorMap, fieldName, error);
            });

          promises.push(promise);
        }
      }, this);

      $q.waitForAll(promises).then(
        deferred.resolve,
        function() {
          deferred.reject(errorMap);
        });

      return deferred.promise;
    };

    /**
     * Validate the properties of a collection (but not the items within the collection).
     * This method returns a promise to be resolved on successful validation,
     * Or rejected with an error message.
     * @memberof ModelValidator
     * @param {Object} model Form-data object model is contained within
     * @param {Array} fieldName Name of collection to validate
     * @param {Object} validationRules Set of named validation rules
     * @returns {Promise} To be resolved or rejected based on validation success or failure.
     */
    this.validateCollection = function(model, fieldName, validationRules) {
      var rules = this.$getRulesForFieldName(validationRules, fieldName);
      var collection = NestedObjectHelper.readAttribute(model, fieldName);

      if (rules && rules.collection) {
        collection = collection || [];

        var collectionRules = rules.collection;

        if (collectionRules.min) {
          var min = angular.isObject(collectionRules.min) ? collectionRules.min.rule : collectionRules.min;

          if (collection.length < min) {
            return $q.reject(
              angular.isObject(collectionRules.min) ?
                collectionRules.min.message :
                $interpolate(FormForConfiguration.validationFailedForMinCollectionSizeMessage)({num: min}));
          }
        }

        if (collectionRules.max) {
          var max = angular.isObject(collectionRules.max) ? collectionRules.max.rule : collectionRules.max;

          if (collection.length > max) {
            return $q.reject(
              angular.isObject(collectionRules.max) ?
                collectionRules.max.message :
                $interpolate(FormForConfiguration.validationFailedForMaxCollectionSizeMessage)({num: max}));
          }
        }
      }

      return $q.resolve();
    };

    /**
     * Validates a value against the related rule-set (within validationRules).
     * This method returns a promise to be resolved on successful validation.
     * If validation fails the promise will be rejected with an error message.
     * @memberof ModelValidator
     * @param {Object} model Form-data object model is contained within
     * @param {String} fieldName Name of field used to associate the rule-set map with a given value
     * @param {Object} validationRules Set of named validation rules
     * @returns {Promise} To be resolved or rejected based on validation success or failure.
     */
    this.validateField = function(model, fieldName, validationRules) {
      var rules = this.$getRulesForFieldName(validationRules, fieldName);
      var value = NestedObjectHelper.readAttribute(model, fieldName);

      if (rules) {
        value = value || '';

        if (rules.required) {
          var required = angular.isObject(rules.required) ? rules.required.rule : rules.required;

          if (angular.isString(value)) {
            value = value.replace(/\s+$/, ''); // Disallow an all-whitespace at the end of the string
          }

          if (!!value !== required) {
            return $q.reject(
              angular.isObject(rules.required) ?
                rules.required.message :
                FormForConfiguration.validationFailedForRequiredMessage);
          }
        }

        if (rules.minlength) {
          var minlength = angular.isObject(rules.minlength) ? rules.minlength.rule : rules.minlength;

          if (value && value.length < minlength) {
            return $q.reject(
              angular.isObject(rules.minlength) ?
                rules.minlength.message :
                $interpolate(FormForConfiguration.validationFailedForMinLengthMessage)({num: minlength}));
          }
        }

        if (rules.maxlength) {
          var maxlength = angular.isObject(rules.maxlength) ? rules.maxlength.rule : rules.maxlength;

          if (value.length > maxlength) {
            return $q.reject(
              angular.isObject(rules.maxlength) ?
                rules.maxlength.message :
                $interpolate(FormForConfiguration.validationFailedForMaxLengthMessage)({num: maxlength}));
          }
        }

        if (rules.type) {
          var type = angular.isObject(rules.type) ? rules.type.rule : rules.type;
          var stringValue = value.toString();
          var numericValue = Number(value);

          if (type) {
            var types = type.split(' ');

            for (type in types) {
              switch (type) {
                case 'integer':
                  if (isNaN(numericValue) || numericValue % 1 !== 0) {
                    return $q.reject(
                      angular.isObject(rules.type) ?
                        rules.type.message :
                        FormForConfiguration.validationFailedForIntegerTypeMessage);
                  }
                  break;

                case 'number':
                  if (isNaN(numericValue)) {
                    return $q.reject(
                      angular.isObject(rules.type) ?
                        rules.type.message :
                        FormForConfiguration.validationFailedForNumericTypeMessage);
                  }
                  break;

                case 'negative':
                  if (isNaN(numericValue) || numericValue >= 0) {
                    return $q.reject(
                      angular.isObject(rules.type) ?
                        rules.type.message :
                        FormForConfiguration.validationFailedNegativeTypeMessage);
                  }
                  break;

                case 'nonNegative':
                  if (isNaN(numericValue) || numericValue < 0) {
                    return $q.reject(
                      angular.isObject(rules.type) ?
                        rules.type.message :
                        FormForConfiguration.validationFailedForNonNegativeTypeMessage);
                  }
                  break;

                case 'positive':
                  if (isNaN(numericValue) || numericValue <= 0) {
                    return $q.reject(
                      angular.isObject(rules.type) ?
                        rules.type.message :
                        FormForConfiguration.validationFailedForPositiveTypeMessage);
                  }
                  break;

                case 'email':
                  if (stringValue && !stringValue.match(/^.+@.+$/)) {
                    return $q.reject(
                      angular.isObject(rules.type) ?
                        rules.type.message :
                        FormForConfiguration.validationFailedForEmailTypeMessage);
                  }
                  break;
              }
            }
          }
        }

        if (rules.pattern) {
          var isRegExp = rules.pattern instanceof RegExp;
          var pattern = isRegExp ? rules.pattern : rules.pattern.rule;

          if (!pattern.exec(value)) {
            return $q.reject(
              isRegExp ?
                FormForConfiguration.validationFailedForPatternMessage :
                rules.pattern.message);
          }
        }

        if (rules.custom) {
          var defaultErrorMessage = angular.isFunction(rules.custom) ? FormForConfiguration.validationFailedForCustomMessage : rules.custom.message;
          var validationFunction = angular.isFunction(rules.custom) ? rules.custom : rules.custom.rule;

          // Validations can fail in 3 ways:
          // A promise that gets rejected (potentially with an error message)
          // An error that gets thrown (potentially with a message)
          // A falsy value

          try {
            var returnValue = validationFunction(value, model);
          } catch (error) {
            return $q.reject(error.message || defaultErrorMessage);
          }

          if (angular.isObject(returnValue) && angular.isFunction(returnValue.then)) {
            return returnValue.then(
              function(reason) {
                return $q.resolve(reason);
              },
              function(reason) {
                return $q.reject(reason || defaultErrorMessage);
              });
          } else if (returnValue) {
            return $q.resolve(returnValue);
          } else {
            return $q.reject(defaultErrorMessage);
          }
        }
      }

      return $q.resolve();
    };

    return this;
  });

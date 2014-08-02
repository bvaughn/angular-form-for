angular.module("formFor.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("form-for/templates/checkbox-field.html","<label class=\"field checkbox-field\" ng-class=\"{disabled: disabled}\" ng-click=\"toggle()\">\n  <div class=\"checkbox-field-input\" ng-class=\"{\'has-error\': error, \'is-checked\': model.bindable}\"></div>\n\n  <field-label label=\"{{label}}\" help=\"{{help}}\"></field-label>\n\n  <div class=\"field-error left-aligned\" ng-if=\"error\" ng-bind-html=\"error\"></div>\n</label>\n");
$templateCache.put("form-for/templates/field-label.html","<label  class=\"field-label\"\n        popover=\"{{help}}\"\n        popover-trigger=\"mouseenter\"\n        popover-placement=\"right\">\n\n  <span ng-bind=\"label\"></span>\n\n  <span ng-if=\"help\" class=\"help-icon-stack\">\n    <i class=\"fa fa-circle help-background-icon\"></i>\n    <i class=\"fa fa-question help-foreground-icon\"></i>\n  </span>\n</label>\n");
$templateCache.put("form-for/templates/radio-field.html","<label class=\"field radio-field\" ng-class=\"{disabled: disabled}\" ng-click=\"click()\">\n  <div class=\"radio-field-input\" ng-class=\"{\'has-error\': error, \'is-selected\': model.bindable === value}\"></div>\n\n  <field-label label=\"{{label}}\" help=\"{{help}}\"></field-label>\n\n  <div class=\"field-error left-aligned\" ng-if=\"error\" ng-bind-html=\"error\"></div>\n</label>\n");
$templateCache.put("form-for/templates/select-field.html","<div class=\"field select-field\" ng-class=\"{disabled: disabled}\">\n  <field-label label=\"{{label}}\" help=\"{{help}}\"></field-label>\n\n  <button class=\"select-field-toggle-button\"\n          ng-class=\"{\'has-error\': error, open: isOpen, \'blank-selected\': !selectedOptionLabel}\"\n          ng-disabled=\"disabled\"\n          ng-click=\"toggleOpen($event)\">\n\n    <div ng-if=\"selectedOptionLabel\" ng-bind=\"selectedOptionLabel\" />\n\n    <div ng-if=\"!selectedOptionLabel\">\n      <div ng-if=\"placeholder\" ng-bind=\"placeholder\" />\n      <div ng-if=\"!placeholder\">Select</div>\n    </div>\n  </button>\n\n  <div  class=\"select-field-dropdown-list-container\" ng-show=\"isOpen\">\n    <ul class=\"unstyled select-field-dropdown-list\">\n      <li ng-if=\"allowBlank\" ng-click=\"selectOption()\">&nbsp;</li>\n\n      <li ng-repeat=\"option in options\"\n          ng-click=\"selectOption(option)\"\n          ng-bind=\"option.label\"\n          ng-class=\"{selected: option === selectedOption}\"></li>\n    </ul>\n  </div>\n\n  <div class=\"field-error\" ng-if=\"error\" ng-bind-html=\"error\" />\n</div>\n");
$templateCache.put("form-for/templates/submit-button.html","<button class=\"submit-button\" ng-class=\"class\" ng-disabled=\"disabled\">\n  <i ng-if=\"icon\" class=\"submit-button-icon\" ng-class=\"icon\"></i>\n\n  <span ng-bind=\"label\"></span>\n</button>\n");
$templateCache.put("form-for/templates/text-field.html","<label class=\"field text-field\" ng-class=\"{disabled: disabled}\">\n  <field-label label=\"{{label}}\" help=\"{{help}}\"></field-label>\n\n  <input  ng-if=\"!multiline\"\n          type=\"{{type}}\"\n          class=\"text-field-input\" ng-class=\"{\'has-error\': error }\"\n          ng-disabled=\"disabled\"\n          placeholder=\"{{placeholder}}\"\n          ng-model=\"model.bindable\" ng-debounce />\n\n  <textarea ng-if=\"multiline\"\n            class=\"text-field-input\" ng-class=\"{\'has-error\': error }\"\n            ng-disabled=\"disabled\"\n            placeholder=\"{{placeholder}}\"\n            ng-model=\"model.bindable\" ng-debounce></textarea>\n\n  <div class=\"field-error\" ng-if=\"error\" ng-bind-html=\"error\" />\n</label>\n");}]);
angular.module('formFor', ['formFor.templates']);

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#checkboxfield
 */
angular.module('formFor').directive('checkboxField',
  function($log) {
    return {
      require: '^formFor',
      restrict: 'E',
      templateUrl: 'form-for/templates/checkbox-field.html',
      scope: {
        attribute: '@',
        disabled: '@',
        help: '@?',
        label: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.model = formForController.registerFormField($scope, $scope.attribute);

        var $input = $element.find('input');

        $scope.toggle = function toggle() {
          if (!$scope.disabled) {
            $scope.model.bindable = !$scope.model.bindable;
          }
        };
      }
    };
  });

/**
 * This component is only intended for internal use by the formFor module.
 */
angular.module('formFor').directive('fieldLabel',
  function( $state ) {
    return {
      restrict: 'E',
      templateUrl: 'form-for/templates/field-label.html',
      scope: {
        help: '@?',
        label: '@'
      }
    };
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#formfor
 */
angular.module('formFor').directive('formFor',
  function($injector, $parse, $q, $sce, FormForConfiguration, ModelValidator) {
    return {
      require: 'form',
      restrict: 'A',
      scope: {
        disabled: '=?',
        formFor: '=',
        submitComplete: '&?',
        submitError: '&?',
        submitWith: '&?',
        validateAs: '@?'
      },
      controller: function($scope) {
        $scope.instance = angular.copy($scope.formFor);
        $scope.formFieldScopes = {};
        $scope.bindable = {};
        $scope.scopeWatcherUnwatchFunctions = [];
        $scope.submitButtonScopes = [];

        if ($scope.validateAs) {
          $scope.validatableModel = $injector.get($scope.validateAs);
        }

        // Watch for async-loaded date and make sure to update our bindable $scope copy.
        $scope.$watch('formFor', function(newValue, oldValue) {
          angular.copy($scope.formFor, $scope.instance);
        }, true);

        // Disable all child inputs if the form becomes disabled.
        $scope.$watch('disabled', function(value) {
          _.each($scope.formFieldScopes, function(scope) {
            scope.disabled = value;
          });

          _.each($scope.submitButtonScopes, function(scope) {
            scope.disabled = value;
          });
        });

        /**
         * Setup a debounce validator on a registered form field.
         * This validator will update error messages inline as the user progresses through the form.
         */
        var createScopeWatcher = function(fieldName) {
          var formFieldScope = $scope.formFieldScopes[fieldName];
          var initialized;

          return $scope.$watch('instance.' + fieldName,
            function(newValue, oldValue) {

              // Scope watchers always trigger once when added.
              // Don't validate a field until it's been modified or the form has been submitted.
              if (!initialized) {
                initialized = true;

                return;
              }

              if ($scope.validatableModel) {
                ModelValidator.validateField(newValue, fieldName, $scope.validatableModel.validationRules).then(
                  function() {
                    formFieldScope.error = null;
                  },
                  function(error) {
                    formFieldScope.error = error;
                  });
              }
            });
        };

        /**
         * All form-input children of formFor must register using this function.
         * @param formFieldScope $scope of input directive
         * @param fieldName Unique identifier of field within model; used to map errors back to input fields
         */
        this.registerFormField = function(formFieldScope, fieldName) {
          var safeFieldName = fieldName.replace(/\./g, '___');

          $scope.formFieldScopes[fieldName] = formFieldScope;
          $scope.bindable[safeFieldName] = {bindable: null};

          // TRICKY Why do we use $parse?
          // Dot notation (ex. 'foo.bar') causes trouble with the brackets accessor.
          // To simplify binding for formFor children, we encapsulate this and return a simple bindable model.
          // We need to manage 2-way binding to keep the original model and our wrapper in sync though.
          // Given a model {foo: {bar: 'baz'}} and a field-name 'foo.bar' $parse allows us to retrieve 'baz'.

          var getter = $parse(fieldName);
          var setter = getter.assign;

          $scope.$watch('bindable.' + safeFieldName + '.bindable', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              setter($scope.instance, newValue);
            }
          });

          $scope.$watch('instance.' + fieldName, function(newValue, oldValue) {
            $scope.bindable[safeFieldName].bindable = getter($scope.instance);
          });

          // Also run validations on-change as necessary.
          createScopeWatcher(fieldName);

          return $scope.bindable[safeFieldName];
        };

        /**
         * All submitButton children must register with formFor using this function.
         */
        this.registerSubmitButton = function(submitButtonScope) {
          $scope.submitButtonScopes.push(submitButtonScope);
        };

        // Clean up dangling watchers on destroy.
        $scope.$on('$destroy', function() {
          _.each($scope.scopeWatcherUnwatchFunctions, function(unwatch) {
            unwatch();
          });
        });
      },
      link: function($scope, $element, $attributes, controller) {
        /**
         * Update all registered form fields with the specified error messages.
         * Specified map should be keyed with fieldName and should container user-friendly error strings.
         */
        var updateErrors = function(fieldNameToErrorMap) {
          _.each($scope.formFieldScopes, function(scope, key) {
            scope.error = $sce.trustAsHtml( fieldNameToErrorMap[key] );
          });
        };

        // Override form submit to trigger overall validation.
        $element.submit(
          function() {
            $scope.disabled = true;

            updateErrors({});

            var validationPromise;

            if ($scope.validatableModel) {
              validationPromise =
                ModelValidator.validateFields(
                  $scope.instance,
                  _.keys($scope.formFieldScopes),
                  $scope.validatableModel.validationRules);
            } else {
              validationPromise = $q.resolve();
            }

            validationPromise.then(
              function(response) {
                var promise;

                // $scope.submitWith is wrapped with a virtual function so we must check via attributes
                if ($attributes.submitWith) {
                  promise = $scope.submitWith({value: $scope.instance});
                } else if ($scope.validatableModel) {
                  promise = $scope.validatableModel.submit($scope.instance);
                } else {
                  promise = $q.reject('No submit implementation provided');
                }

                promise.then(
                  function(response) {
                    // $scope.submitComplete is wrapped with a virtual function so we must check via attributes
                    if ($attributes.submitComplete) {
                      $scope.submitComplete({data: response});
                    } else {
                      FormForConfiguration.defaultSubmitComplete(response);
                    }

                    angular.copy($scope.instance, $scope.formFor);
                  },
                  function(errorMessageOrErrorMap) {
                    if (_.isObject(errorMessageOrErrorMap)) {
                      updateErrors(errorMessageOrErrorMap);
                    }

                    // $scope.submitError is wrapped with a virtual function so we must check via attributes
                    if ($attributes.submitError) {
                      $scope.submitError({error: errorMessageOrErrorMap});
                    } else {
                      FormForConfiguration.defaultSubmitError(errorMessageOrErrorMap);
                    }
                  });
                promise['finally'](
                  function() {
                    $scope.disabled = false;
                  });
              },
              function(errorMap) {
                $scope.disabled = false;

                updateErrors(errorMap);
              });
        });
      }
    };
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#radiofield
 */
angular.module('formFor').directive('radioField',
  function($log) {
    var nameToActiveRadioMap = {};

    return {
      require: '^formFor',
      restrict: 'E',
      templateUrl: 'form-for/templates/radio-field.html',
      scope: {
        attribute: '@',
        disabled: '@',
        help: '@?',
        label: '@?',
        value: '@'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        if (!nameToActiveRadioMap[$scope.attribute]) {
          nameToActiveRadioMap[$scope.attribute] = {
            defaultScope: $scope,
            scopes: [],
            model: formForController.registerFormField($scope, $scope.attribute)
          };
        }

        // TODO How to handle errors?
        // Main scope should listen and bucket brigade to others!

        var activeRadio = nameToActiveRadioMap[$scope.attribute];
        activeRadio.scopes.push($scope);

        $scope.model = activeRadio.model;

        var $input = $element.find('input');

        $scope.click = function() {
          if (!$scope.disabled) {
            $scope.model.bindable = $scope.value;
          }
        };

        activeRadio.defaultScope.$watch('disabled', function(value) {
          $scope.disabled = value;
        });

        $scope.$watch('model.bindable', function(newValue, oldValue) {
          if (newValue === $scope.value) {
            $input.attr('checked', true);
          } else {
            $input.removeAttr('checked');
          }
        });

        $scope.$on('$destroy', function() {
          activeRadio.scopes.splice(
            activeRadio.scopes.indexOf($scope), 1);

          if (activeRadio.scopes.length === 0) {
            delete nameToActiveRadioMap[$scope.attribute];
          }
        });
      }
    };
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#selectfield
 */
angular.module('formFor').directive('selectField',
  function($log, $timeout) {
    return {
      require: '^formFor',
      restrict: 'E',
      templateUrl: 'form-for/templates/select-field.html',
      scope: {
        attribute: '@',
        disabled: '@',
        help: '@?',
        label: '@?',
        options: '=',
        placeholder: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute || !$scope.options) {
          $log.error('Missing required field(s) "attribute" or "options"');

          return;
        }

        $scope.allowBlank = $attributes.hasOwnProperty('allowBlank');
        $scope.model = formForController.registerFormField($scope, $scope.attribute);

        // TODO Track scroll position and viewport height and expand upward if needed

        $scope.$watch('model.bindable', function(value) {
          var option = _.find($scope.options,
            function(option) {
              return value === option.value;
            });

          $scope.selectedOption = option;
          $scope.selectedOptionLabel = option && option.label;
        });

        $scope.selectOption = function(option) {
          $scope.model.bindable = option && option.value;
          $scope.isOpen = false;
        };

        var clickWatcher = function(event) {
          $scope.isOpen = false;
          $scope.$apply();
        };

        $scope.toggleOpen = function(event) {
          event.stopPropagation();
          event.preventDefault();

          if ($scope.disabled) {
            return;
          }

          $scope.isOpen = !$scope.isOpen;

          if ($scope.isOpen) {
            $timeout(function() { // Delay to avoid processing the same click event that trigger the toggle-open
              $(window).one('click', clickWatcher);
            }, 1);
          }
        };

        $scope.$on('$destroy', function() {
          $(window).off('click', clickWatcher);
        });
      }
    };
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#submitbutton
 */
angular.module('formFor').directive('submitButton',
  function($log) {
    return {
      require: '^formFor',
      replace: true,
      restrict: 'E',
      templateUrl: 'form-for/templates/submit-button.html',
      scope: {
        disabled: '@',
        icon: '@'
      },
      link: function($scope, $element, $attributes, formForController) {
        $scope.class = $attributes.class;
        $scope.label = $attributes.label || 'Submit';

        formForController.registerSubmitButton($scope);
      }
    };
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#textfield
 */
angular.module('formFor').directive('textField',
  function($log) {
    return {
      require: '^formFor',
      restrict: 'E',
      templateUrl: 'form-for/templates/text-field.html',
      scope: {
        attribute: '@',
        disabled: '@',
        help: '@?',
        label: '@?',
        placeholder: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.type = $attributes.type || 'text';
        $scope.multiline = $attributes.hasOwnProperty('multiline') && $attributes.multiline !== 'false';

        $scope.model = formForController.registerFormField($scope, $scope.attribute);
      }
    };
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#formfor
 */
angular.module('formFor').service('FormForConfiguration',
  function() {
    return {
      defaultSubmitComplete: angular.noop,
      defaultSubmitError: angular.noop,
      setDefaultSubmitComplete: function(value) {
        this.defaultSubmitComplete = value;
      },
      setDefaultSubmitError: function(value) {
        this.defaultSubmitError = value;
      }
    };
  });

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
  this.getRulesForField = function(fieldName, validationRules) {
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
      var rules = that.getRulesForField(fieldName, validationRules);

      if (rules) {
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
    var rules = this.getRulesForField(fieldName, validationRules);
    console.log('formFor.validateField:'+fieldName + ' ~ ' + rules);

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
        return rules.custom(value).then(
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

/**
 * Decorates the $q utility with additional methods used by formFor.
 *
 * @private
 * This set of helper methods, small though they are, might be worth breaking apart into their own library?
 */
var qDecorator = function($delegate) {

  /**
   * Similar to $q.reject, this is a convenience method to create and resolve a Promise.
   */
  $delegate.resolve = function(data) {
    var deferred = this.defer();
    deferred.resolve(data);

    return deferred.promise;
  };

  /**
   * Similar to $q.all but waits for all promises to resolve/reject before resolving/rejecting.
   */
  $delegate.waitForAll = function(promises) {
    var deferred = this.defer();
    var results = [];
    var counter = 0;
    var errored = false;

    var udpateResult = function(key, data) {
      if (!results.hasOwnProperty(key)) {
        results[key] = data;

        counter--;
      }

      checkForDone();
    };

    var checkForDone = function() {
      if (counter === 0) {
        if (errored) {
          deferred.reject(results);
        } else {
          deferred.resolve(results);
        }
      }
    };

    angular.forEach(promises, function(promise, key) {
      counter++;

      promise.then(
        function(data) {
          udpateResult(key, data);
        },
        function(data) {
          errored = true;

          udpateResult(key, data);
        });
    });

    checkForDone(); // Handle empty Array

    return deferred.promise;
  };

  return $delegate;
};

angular.module('formFor').config(
  function($provide) {
    $provide.decorator('$q', qDecorator);
  });

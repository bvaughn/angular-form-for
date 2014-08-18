/**
 * @ngdoc Directives
 * @name form-for
 * @description
 * This directive should be paired with an Angular ngForm object and should contain at least one of the formFor field types described below.
 * At a high level, it operates on a bindable form-data object and runs validations each time a change is detected.
 *
 * @param {Object} controller Two way bindable attribute exposing access to the formFor controller API.
 * See below for an example of how to use this binding to access the controller.
 * @param {Boolean} disable Form is disabled.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * This attribute is 2-way bindable.
 * @param {Object} formFor An object on $scope that formFor should read and write data to.
 * To prevent accidentally persisting changes to this object after a cancelled form, it is recommended that you bind to a copied object.
 * For more information refer to angular.copy.
 * @param {String} service Convenience mehtod for identifying an $injector-accessible model containing both the validation rules and submit function.
 * Validation rules should be accessible via an attribute named validationRules and the submit function should be named submit.
 * @param {Function} submitComplete Custom handler to be invoked upon a successful form submission.
 * Use this to display custom messages or do custom routing after submit.
 * This method should accept a "data" parameter.
 * See below for an example.
 * (To set a global, default submit-with handler see FormForConfiguration.)
 * @param {Function} submitError Custom error handler function.
 * This function should accept an "error" parameter.
 * See below for an example.
 * (To set a global, default submit-with handler see FormForConfiguration.)
 * @param {Function} submitWith Function triggered on form-submit.
 * This function should accept a named parameter data (the model object) and should return a promise to be resolved/rejected based on the result of the submission.
 * In the event of a rejection, the promise can return an error string or a map of field-names to specific errors.
 * See below for an example.
 * @param {Object} validationRules Set of client-side validation rules (keyed by form field names) to apply to form-data before submitting.
 * For more information refer to the Validation Types page.
 */
angular.module('formFor').directive('formFor',
  function($injector, $parse, $q, $sce, FormForConfiguration, $FormForStateHelper, NestedObjectHelper, ModelValidator) {
    return {
      require: 'form',
      restrict: 'A',
      scope: {
        controller: '=?',
        disable: '=?',
        errorMap: '=?',
        formFor: '=',
        service: '@',
        submitComplete: '&?',
        submitError: '&?',
        submitWith: '&?',
        valid: '=?',
        validationRules: '=?'
      },
      controller: function($scope) {
        $scope.formFieldScopes = {};
        $scope.bindable = {};
        $scope.scopeWatcherUnwatchFunctions = [];
        $scope.submitButtonScopes = [];

        var controller = this;

        if ($scope.service) {
          $scope.$service = $injector.get($scope.service);
        }

        // Validation rules can come through 2 ways:
        // As part of the validation service or as a direct binding.
        if ($scope.$service) {
          $scope.$validationRules = $scope.$service.validationRules;
        } else {
          $scope.$validationRules = $scope.validationRules;
        }

        /**
         * All form-input children of formFor must register using this function.
         * @memberof form-for
         * @param {$scope} formFieldScope $scope of input directive
         * @param {String} fieldName Unique identifier of field within model; used to map errors back to input fields
         */
        controller.registerFormField = function(formFieldScope, fieldName) {
          var safeFieldName = NestedObjectHelper.flattenAttribute(fieldName);
          var rules = NestedObjectHelper.readAttribute($scope.$validationRules, fieldName);

          $scope.formFieldScopes[fieldName] = formFieldScope;
          $scope.bindable[safeFieldName] = {
            bindable: null,
            required: rules && !!rules.required
          };

          // TRICKY Why do we use $parse?
          // Dot notation (ex. 'foo.bar') causes trouble with the brackets accessor.
          // To simplify binding for formFor children, we encapsulate this and return a simple bindable model.
          // We need to manage 2-way binding to keep the original model and our wrapper in sync though.
          // Given a model {foo: {bar: 'baz'}} and a field-name 'foo.bar' $parse allows us to retrieve 'baz'.

          var getter = $parse(fieldName);
          var setter = getter.assign;

          $scope.$watch('bindable.' + safeFieldName + '.bindable', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              setter($scope.formFor, newValue);
            }
          });

          $scope.$watch('formFor.' + fieldName, function(newValue, oldValue) {
            $scope.bindable[safeFieldName].bindable = getter($scope.formFor);
          });

          // Also run validations on-change as necessary.
          createScopeWatcher(fieldName);

          return $scope.bindable[safeFieldName];
        };

        /**
         * All submitButton children must register with formFor using this function.
         * @memberof form-for
         * @param {$scope} submitButtonScope $scope of submit button directive
         */
        controller.registerSubmitButton = function(submitButtonScope) {
          $scope.submitButtonScopes.push(submitButtonScope);
        };

        /**
         * Resets errors displayed on the <form> without resetting the form data values.
         * @memberof form-for
         */
        controller.resetErrors = function() {
          $scope.formForStateHelper.setFormSubmitted(false);

          var keys = NestedObjectHelper.flattenObjectKeys($scope.errorMap);

          angular.forEach(keys, function(fieldName) {
            $scope.formForStateHelper.setFieldHasBeenModified(fieldName, false);
          });
        };

        // Expose controller methods to the $scope.controller interface
        $scope.controller = $scope.controller || {};
        $scope.controller.registerFormField = this.registerFormField;
        $scope.controller.registerSubmitButton = this.registerSubmitButton;
        $scope.controller.resetErrors = this.resetErrors;

        // Disable all child inputs if the form becomes disabled.
        $scope.$watch('disable', function(value) {
          angular.forEach($scope.formFieldScopes, function(scope) {
            scope.disabledByForm = value;
          });

          angular.forEach($scope.submitButtonScopes, function(scope) {
            scope.disabledByForm = value;
          });
        });

        // Track field validity and dirty state.
        $scope.formForStateHelper = new $FormForStateHelper($scope);

        /*
         * Setup a debounce validator on a registered form field.
         * This validator will update error messages inline as the user progresses through the form.
         * @param {String} fieldName Name of field within form-data
         */
        var createScopeWatcher = function(fieldName) {
          var formFieldScope = $scope.formFieldScopes[fieldName];
          var initialized;

          return $scope.$watch('formFor.' + fieldName,
            function(newValue, oldValue) {
              // Scope watchers always trigger once when added.
              // Only mark our field dirty when a user-edit actually triggers the watcher.
              if (!initialized) {
                initialized = true;

              // If formFor was binded with an empty object, ngModel will auto-initialize keys on blur.
              // We shouldn't treat this as a user-edit though unless the user actually typed something.
              // It's possible they typed and then erased, but that seems less likely...
              } else if (oldValue !== undefined || newValue !== '') {
                $scope.formForStateHelper.setFieldHasBeenModified(fieldName, true);
              }

              if ($scope.$validationRules) {
                ModelValidator.validateField($scope.formFor, fieldName, $scope.$validationRules).then(
                  function() {
                    $scope.formForStateHelper.setFieldError(fieldName, null);
                  },
                  function(error) {
                    $scope.formForStateHelper.setFieldError(fieldName, error);
                  });
              }
            });
        };

        // Watch for any validation changes or changes in form-state that require us to notify the user.
        // Rather than using a deep-watch, FormForStateHelper exposes a bindable attribute 'watchable'.
        // This attribute is gauranteed to change whenever validation criteria change, but its value is meaningless.
        $scope.$watch('formForStateHelper.watchable', function() {
          var formForStateHelper = $scope.formForStateHelper;

          angular.forEach($scope.formFieldScopes, function(scope, fieldName) {
            if (formForStateHelper.hasFormBeenSubmitted() || formForStateHelper.hasFieldBeenModified(fieldName)) {
              var error = formForStateHelper.getFieldError(fieldName);

              scope.error = error ? $sce.trustAsHtml(error) : null;
            } else {
              // Clear out field errors in the event that the form has been reset.
              scope.error = null;
            }
          });
        });

        /*
         * Update all registered form fields with the specified error messages.
         * Specified map should be keyed with fieldName and should container user-friendly error strings.
         * @param {Object} errorMap Map of field names (or paths) to errors
         */
        $scope.updateErrors = function(errorMap) {
          angular.forEach($scope.formFieldScopes, function(scope, fieldName) {
            var error = NestedObjectHelper.readAttribute(errorMap, fieldName);

            $scope.formForStateHelper.setFieldError(fieldName, error);
          });
        };

        /*
         * Validate all registered fields and update FormForStateHelper's error mapping.
         * This update indirectly triggers form validity check and inline error message display.
         */
        $scope.validateAll = function() {
          $scope.updateErrors({});

          var validationPromise;

          if ($scope.$validationRules) {
            validationPromise =
              ModelValidator.validateFields(
                $scope.formFor,
                Object.keys($scope.formFieldScopes),
                $scope.$validationRules);
          } else {
            validationPromise = $q.resolve();
          }

          validationPromise.then(angular.noop, $scope.updateErrors);

          return validationPromise;
        };

        // Clean up dangling watchers on destroy.
        $scope.$on('$destroy', function() {
          angular.forEach($scope.scopeWatcherUnwatchFunctions, function(unwatch) {
            unwatch();
          });
        });
      },
      link: function($scope, $element, $attributes, controller) {
        // Override form submit to trigger overall validation.
        $element.on('submit',
          function() {
            $scope.formForStateHelper.setFormSubmitted(true);
            $scope.disable = true;

            $scope.validateAll().then(
              function(response) {
                var promise;

                // $scope.submitWith is wrapped with a virtual function so we must check via attributes
                if ($attributes.submitWith) {
                  promise = $scope.submitWith({data: $scope.formFor});
                } else if ($scope.$service && $scope.$service.submit) {
                  promise = $scope.$service.submit($scope.formFor);
                } else {
                  promise = $q.reject('No submit function provided');
                }

                // Issue #18 Guard against submit functions that don't return a promise by warning rather than erroring.
                if (!promise) {
                  promise = $q.reject('Submit function did not return a promise');
                }

                promise.then(
                  function(response) {
                    // $scope.submitComplete is wrapped with a virtual function so we must check via attributes
                    if ($attributes.submitComplete) {
                      $scope.submitComplete({data: response});
                    } else {
                      FormForConfiguration.defaultSubmitComplete(response);
                    }
                  },
                  function(errorMessageOrErrorMap) {
                    // If the remote response returned inline-errors update our error map.
                    // This is unecessary if a string was returned.
                    if (angular.isObject(errorMessageOrErrorMap)) {
                      $scope.updateErrors(errorMessageOrErrorMap);
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
                    $scope.disable = false;
                  });
              },
              function() {
                $scope.disable = false;
              });

          return false;
        });
      }
    };
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#formfor
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
         * @param formFieldScope $scope of input directive
         * @param fieldName Unique identifier of field within model; used to map errors back to input fields
         */
        this.registerFormField = function(formFieldScope, fieldName) {
          var safeFieldName = NestedObjectHelper.flattenAttribute(fieldName);

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
         */
        this.registerSubmitButton = function(submitButtonScope) {
          $scope.submitButtonScopes.push(submitButtonScope);
        };

        /**
         * Resets errors displayed on the <form> without resetting the form data values.
         */
        this.resetErrors = function() {
          $scope.formForStateHelper.setFormSubmitted(false);

          var keys = NestedObjectHelper.flattenObjectKeys($scope.errorMap);

          _.each(keys, function(fieldName) {
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
          _.each($scope.formFieldScopes, function(scope) {
            scope.disabledByForm = value;
          });

          _.each($scope.submitButtonScopes, function(scope) {
            scope.disabledByForm = value;
          });
        });

        // Track field validity and dirty state.
        $scope.formForStateHelper = new $FormForStateHelper($scope);

        /**
         * Setup a debounce validator on a registered form field.
         * This validator will update error messages inline as the user progresses through the form.
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

          _.each($scope.formFieldScopes, function(scope, fieldName) {
            if (formForStateHelper.hasFormBeenSubmitted() || formForStateHelper.hasFieldBeenModified(fieldName)) {
              var error = formForStateHelper.getFieldError(fieldName);

              scope.error = error ? $sce.trustAsHtml(error) : null;
            } else {
              // Clear out field errors in the event that the form has been reset.
              scope.error = null;
            }
          });
        });

        /**
         * Update all registered form fields with the specified error messages.
         * Specified map should be keyed with fieldName and should container user-friendly error strings.
         *
         * @param errorMap Map of field names (or paths) to errors
         */
        $scope.updateErrors = function(errorMap) {
          _.each($scope.formFieldScopes, function(scope, fieldName) {
            var error = NestedObjectHelper.readAttribute(errorMap, fieldName);

            $scope.formForStateHelper.setFieldError(fieldName, error);
          });
        };

        /**
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
                _.keys($scope.formFieldScopes),
                $scope.$validationRules);
          } else {
            validationPromise = $q.resolve();
          }

          validationPromise.then(angular.noop, $scope.updateErrors);

          return validationPromise;
        };

        // Clean up dangling watchers on destroy.
        $scope.$on('$destroy', function() {
          _.each($scope.scopeWatcherUnwatchFunctions, function(unwatch) {
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
                  },
                  function(errorMessageOrErrorMap) {
                    // If the remote response returned inline-errors update our error map.
                    // This is unecessary if a string was returned.
                    if (_.isObject(errorMessageOrErrorMap)) {
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

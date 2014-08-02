/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#formfor
 */
angular.module('formFor').directive('formFor',
  function($injector, $parse, $q, $sce, $timeout, ModelValidator) {
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
                ModelValidator.validateField(newValue, fieldName, $scope.validatableModel.ruleSetMap).then(
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
                  $scope.validatableModel.ruleSetMap);
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
                      $scope.submitComplete(response);
                    } else {
                      // TODO Fall back to provider default submit complete
                    }

                    angular.copy($scope.instance, $scope.formFor);
                  },
                  function(errorMessageOrErrorMap) {
                    if (_.isObject(errorMessageOrErrorMap)) {
                      updateErrors(errorMessageOrErrorMap);
                    }

                    // $scope.submitError is wrapped with a virtual function so we must check via attributes
                    if ($attributes.submitError) {
                      $scope.submitError(errorMessageOrErrorMap);
                    } else {
                      // TODO Fall back to provider default submit error
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

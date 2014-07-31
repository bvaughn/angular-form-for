/**
 * TODO Move this stuff into a README
 * Manages asynchronous form validation (local and remote) as configured by a ValidatableModel.
 * Auto-creates editable clone to be synced on submit or reverted on cancel.
 * Auto displays flashr notifications on success and inline validation errors on failure.
 *
 * <form form-for=scopeObject [validate-as=ValidatableModel submit-with=Function submitted=Function]>
 *   <!-- input fields go here -->
 * </form>
 *
 * Input fields within a formFor directive must register themselves with its controller using 'registerFormField'.
 * This function will return an object with a property 'bindable'.
 * The field should use this attribute to bind to fo reading/writing purposes.
 * We return an object in order to ensure we pass by reference and not value.
 *
 * Attributes:
 * • formFor: POJO object to be updated by a successfully-submitted form.
 * • validateAs: $injector-accessible model defining a validation rules and a submit() method.
 *               If your form does not require validation this property can be left blank.
 * • submitted: Optional override for handling a successful form submission.
 *              By default this is set to angular.noop (no interactions).
 * • submitWith: Optional override for calling submit on validateAs target.
 *               This function should accept a POJO (to be submitted) and should return a Promise.
 */
angular.module('formFor')
  .directive('formFor',
    function($injector, $parse, $q, $sce, $timeout, flashr) {
      return {
        require: 'form',
        restrict: 'A',
        scope: {
          formFor: '=',
          submitted: '&?',
          submitWith:'&?',
          validateAs:'@?'
        },
        controller:   function($scope) {
          $scope.instance = angular.copy($scope.formFor);
          $scope.formFieldScopes = {};
          $scope.bindable = {};
          $scope.scopeWatcherUnwatchFunctions = [];

          if ($scope.validateAs) {
            $scope.validatableModel = $injector.get($scope.validateAs);
          }

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
                  $scope.validatableModel.validateField(newValue, fieldName).then(
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
              updateErrors({});

              var validationPromise;

              if ($scope.validatableModel) {
                validationPromise =
                  $scope.validatableModel.validateFields(
                    $scope.instance,
                    _.keys($scope.formFieldScopes));
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
                      // $scope.submitted is wrapped with a virtual function so we must check via attributes
                      if ($attributes.submitted) {
                        $scope.submitted();
                      } else {
                        // TODO Check $provider default ???
                      }

                      angular.copy($scope.instance, $scope.formFor);
                    },
                    function(errorMessageOrErrorMap) {
                      if (_.isObject(errorMessageOrErrorMap)) {
                        updateErrors(errorMessageOrErrorMap);
                      } else {
                        // TODO Better message
                        flashr.now.error(errorMessageOrErrorMap || 'Something went wrong. Please try again.');
                      }
                    });
                },
                function(errorMap) {
                  updateErrors(errorMap);
                });
            });
        }
      };
    }
  );

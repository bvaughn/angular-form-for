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
        $scope.formFieldData = {};
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
          var rules = NestedObjectHelper.readAttribute($scope.$validationRules, fieldName);

          var formFieldDatum = {
            bindable: null,
            required: rules && !!rules.required,
            isCollection: fieldName.indexOf('[]') > 0,
            fieldName: fieldName,
            scope: formFieldScope
          };

          if (formFieldDatum.isCollection) {
            if (!$scope.formFieldData.hasOwnProperty(safeFieldName)) {
              $scope.formFieldData[safeFieldName] = [];
              $scope.formFieldScopes[safeFieldName] = [];
            }

            $scope.formFieldData[safeFieldName].push(formFieldDatum);
            $scope.formFieldScopes[safeFieldName].push(formFieldScope);

          } else {
            $scope.formFieldData[safeFieldName] = formFieldDatum;
            $scope.formFieldScopes[safeFieldName] = formFieldScope;
          }

          // TRICKY Why do we use $parse?
          // Dot notation (ex. 'foo.bar') causes trouble with the brackets accessor.
          // To simplify binding for formFor children, we encapsulate this and return a simple bindable model.
          // We need to manage 2-way binding to keep the original model and our wrapper in sync though.
          // Given a model {foo: {bar: 'baz'}} and a field-name 'foo.bar' $parse allows us to retrieve 'baz'.

          if (formFieldDatum.isCollection) {
            var index = $scope.formFieldData[safeFieldName].length - 1;

            formFieldDatum.getterFieldName = fieldName.replace('[]', '[' + index + ']');
          } else {
            formFieldDatum.getterFieldName = fieldName;
          }

          console.log('fieldName:'+fieldName+' ~> getterFieldName:'+formFieldDatum.getterFieldName);
          var getter = $parse(formFieldDatum.getterFieldName);
          var setter = getter.assign;

          console.log('• [registerFormField] watching: formFieldData.' + formFieldDatum.getterFieldName + '.bindable');
          formFieldDatum.unwatchFormFieldDataForSync =
            $scope.$watch('formFieldData.' + formFieldDatum.getterFieldName + '.bindable', function(newValue, oldValue) {
              console.log('•• [registerFormField] formFieldData.' + formFieldDatum.getterFieldName + '.bindable ~> ' + newValue);
              if (newValue !== oldValue) {
                setter($scope.formFor, newValue);
              }
            });

          console.log('• [registerFormField] watching: formFor.' + formFieldDatum.getterFieldName);
          formFieldDatum.unwatchFormDataForSync =
            $scope.$watch('formFor.' + formFieldDatum.getterFieldName, function(newValue, oldValue) {
              console.log('•• [registerFormField] formFor.' + formFieldDatum.getterFieldName + ' ~> ' + newValue);
              formFieldDatum.bindable = getter($scope.formFor);
            });

          // Also run validations on-change as necessary.
          formFieldDatum.unwatchScopeForValidations = createScopeWatcher(formFieldDatum);

          return formFieldDatum;
        };

        /**
         * Form fields created within ngRepeat or ngIf directive should clean up themselves on removal.
         */
        this.unregisterFormField = function(formFieldScope, fieldName) {
          var safeFieldName = NestedObjectHelper.flattenAttribute(fieldName);
          var formFieldData = fieldName.indexOf('[]') > 0 ? $scope.formFieldData[safeFieldName] : [$scope.formFieldData[safeFieldName]];

          angular.foreach(formFieldData,
            function(formFieldDatum) {
              if (formFieldDatum.scope === formFieldScope) {
                formFieldDatum.unwatchFormFieldDataForSync();
                formFieldDatum.unwatchFormDataForSync();
                formFieldDatum.unwatchScopeForValidations();
              }
            });
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

        /**
         * Setup a debounce validator on a registered form field.
         * This validator will update error messages inline as the user progresses through the form.
         */
        var createScopeWatcher = function(formFieldDatum) {
          var initialized;

          console.log('• [createScopeWatcher] watching: formFor.' + formFieldDatum.getterFieldName);
          return $scope.$watch('formFor.' + formFieldDatum.getterFieldName,
            function(newValue, oldValue) {
              console.log('•• [createScopeWatcher] formFor.' + formFieldDatum.getterFieldName + ' ~> ' + newValue);
              // Scope watchers always trigger once when added.
              // Only mark our field dirty when a user-edit actually triggers the watcher.
              if (!initialized) {
                initialized = true;

              // If formFor was binded with an empty object, ngModel will auto-initialize keys on blur.
              // We shouldn't treat this as a user-edit though unless the user actually typed something.
              // It's possible they typed and then erased, but that seems less likely...
              } else if (oldValue !== undefined || newValue !== '') {
                $scope.formForStateHelper.setFieldHasBeenModified(formFieldDatum.fieldName, true);
              }

              if ($scope.$validationRules) {
                ModelValidator.validateField($scope.formFor, formFieldDatum.fieldName, $scope.$validationRules).then(
                  function() {
                    $scope.formForStateHelper.setFieldError(formFieldDatum.fieldName, null);
                  },
                  function(error) {
                    $scope.formForStateHelper.setFieldError(formFieldDatum.fieldName, error);
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

        /**
         * Update all registered form fields with the specified error messages.
         * Specified map should be keyed with fieldName and should container user-friendly error strings.
         *
         * @param errorMap Map of field names (or paths) to errors
         */
        $scope.updateErrors = function(errorMap) {
          angular.forEach($scope.formFieldScopes, function(scope, fieldName) {
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
                Object.keys($scope.formFieldScopes),
                $scope.$validationRules);
          } else {
            validationPromise = $q.resolve();
          }

          validationPromise.then(angular.noop, $scope.updateErrors);

          return validationPromise;
        };
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

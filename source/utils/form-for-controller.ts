/// <reference path="../utils/nested-object-helper.ts" />
/// <reference path="../utils/promise-utils.ts" />

module formFor {

  export interface FormForController {

    /**
     * Returns the validation rules for a specific field.
     *
     * @param fieldName Unique identifier of collection within model
     * @return Validations rules for field (if any have been provided)
     */
    getValidationRulesForAttribute(fieldName:string):ValidationRules;

    /**
     * Collection headers should register themselves using this function in order to be notified of validation errors.
     *
     * @param fieldName Unique identifier of collection within model
     * @return A bind-friendly wrapper object describing the state of the collection
     */
    registerCollectionLabel(fieldName:string):BindableCollectionWrapper;

    /**
     * All form-input children of formFor must register using this function.
     *
     * @param fieldName Unique identifier of field within model; used to map errors back to input fields
     * @return Bindable field wrapper
     */
    registerFormField(fieldName:string):BindableFieldWrapper;

    /**
     * All submitButton children must register with formFor using this function.
     *
     * @param submitButtonScope $scope of submit button directive
     * @return Submit button wrapper
     */
    registerSubmitButton(submitButtonScope:ng.IScope):SubmitButtonWrapper;

    /**
     * Resets errors displayed on the <form> without resetting the form data values.
     */
    resetErrors():void;

    /**
     * Reset validation errors for an individual field.
     *
     * @param fieldName Field name within formFor data object (ex. billing.address)
     */
    resetField(fieldName:string):void;

    /**
     * Alias to resetErrors.
     * @memberof form-for
     */
    resetFields():void;

    /**
     * Manually set a validation error message for a given field.
     * This method should only be used when formFor's :validateOn attribute has been set to "manual".
     *
     * @param fieldName Field name within formFor data object (ex. billing.address)
     * @param error Error message to display (or null to clear the visible error)
     */
    setFieldError(fieldName:string, error:string):void;

    /**
     * Form fields created within ngRepeat or ngIf directive should clean up themselves on removal.
     *
     * @param fieldName Unique identifier of field within model
     */
    unregisterFormField(fieldName:string):void;

    /*
     * Update all registered collection labels with the specified error messages.
     * Specified map should be keyed with fieldName and should container user-friendly error strings.
     * @param {Object} fieldNameToErrorMap Map of collection names (or paths) to errors
     */
    updateCollectionErrors(fieldNameToErrorMap:{[fieldName:string]:string}):void;

    /*
     * Update all registered form fields with the specified error messages.
     * Specified map should be keyed with fieldName and should container user-friendly error strings.
     * @param {Object} fieldNameToErrorMap Map of field names (or paths) to errors
     */
    updateFieldErrors(fieldNameToErrorMap:{[fieldName:string]:string}):void;

    /**
     * Force validation for an individual field.
     * If the field fails validation an error message will automatically be shown.
     *
     * @param fieldName Field name within formFor data object (ex. billing.address)
     */
    validateField(fieldName:string):void;

    /**
     * Validate all registered form-fields.
     * This method returns a promise that is resolved or rejected with a field to error message map.
     *
     * @param showErrors Mark fields with errors as invalid (visually) after validation
     */
    validateForm(showErrors?:boolean):ng.IPromise<any>;
  }

  /**
   * Controller exposed via the FormFor directive's scope.
   *
   * <p>Intended for use only by formFor directive and fields (children); this class is not exposed to the $injector.
   *
   * @param target Object to attach controller methods to
   * @param $parse Injector-supplied $parse service
   * @param $q Injector-supplied $q service
   * @param $scope formFor directive $scope
   * @param modelValidator ModelValidator service
   * @param formForConfiguration
   */
  export function createFormForController(target:any,
                                          $parse:ng.IParseService,
                                          $q:ng.IQService,
                                          $scope:FormForScope,
                                          modelValidator:ModelValidator,
                                          formForConfiguration:FormForConfiguration):FormForController {

    var nestedObjectHelper = new NestedObjectHelper($parse);
    var promiseUtils = new PromiseUtils($q);

    /**
     * @inheritDocs
     */
    target.getValidationRulesForAttribute= (fieldName:string):Object => {
      return modelValidator.getRulesForField(fieldName, $scope.$validationRuleset);
    };

    /**
     * @inheritDocs
     */
    target.registerCollectionLabel = (fieldName:string):BindableCollectionWrapper => {
      var bindableFieldName:string = nestedObjectHelper.flattenAttribute(fieldName);

      var bindableWrapper:BindableCollectionWrapper = {
        error: null,
        required: modelValidator.isCollectionRequired(fieldName, $scope.$validationRuleset)
      };

      $scope.collectionLabels[bindableFieldName] = bindableWrapper;

      var watcherInitialized = false;

      $scope.$watch('formFor.' + fieldName + '.length',
        () => {
          // The initial $watch should not trigger a visible validation...
          if (!watcherInitialized) {
            watcherInitialized = true;

          } else if (!$scope.validateOn || $scope.validateOn === 'change') {
            modelValidator.validateCollection($scope.formFor, fieldName, $scope.$validationRuleset).then(
              () => {
                $scope.formForStateHelper.setFieldError(bindableFieldName, null);
              },
              (error:string) => {
                $scope.formForStateHelper.setFieldError(bindableFieldName, error);
              });
          }
        });

      return bindableWrapper;
    };

    /**
     * @inheritDocs
     */
    target.registerFormField = function(fieldName:string):BindableFieldWrapper {
      if (!fieldName) {
        throw Error('Invalid field name "' + fieldName + '" provided.');
      }

      var bindableFieldName:string = nestedObjectHelper.flattenAttribute(fieldName);

      if ($scope['fields'].hasOwnProperty(bindableFieldName)) {
        throw Error('Field "' + fieldName + '" has already been registered. Field names must be unique.');
      }

      var bindableFieldWrapper:BindableFieldWrapper = {
        bindable: null,
        disabled: $scope.disable,
        error: null,
        pristine: true,
        required: modelValidator.isFieldRequired(fieldName, $scope.$validationRuleset),
        uid: FormForGUID.create()
      };

      // Store information about this field that we'll need for validation and binding purposes.
      // @see Above documentation for $scope.fields
      var fieldDatum:FieldDatum = {
        bindableWrapper: bindableFieldWrapper,
        fieldName: fieldName,
        formForStateHelper: $scope.formForStateHelper,
        unwatchers: []
      };

      $scope.fields[bindableFieldName] = fieldDatum;

      var getter:ng.ICompiledExpression = $parse(fieldName);
      var setter:(context:any, value:any) => any = getter.assign;

      // Changes made by our field should be synced back to the form-data model.
      fieldDatum.unwatchers.push(
        $scope.$watch('fields.' + bindableFieldName + '.bindableWrapper.bindable',
          (newValue:any, oldValue:any) => {
            // Don't update the value unless it changes; (this prevents us from wiping out the default model value).
            if (newValue || newValue != oldValue) {
              if (formForConfiguration.autoTrimValues && typeof newValue == 'string') {
                newValue = newValue.trim();
              }

              // Keep the form data object and our bindable wrapper in-sync
              setter($scope.formFor, newValue);
            }
          }));

      var formDataWatcherInitialized:boolean;

      // Changes made to the form-data model should likewise be synced to the field's bindable model.
      // (This is necessary for data that is loaded asynchronously after a form has already been displayed.)
      fieldDatum.unwatchers.push(
        $scope.$watch('formFor.' + fieldName,
          (newValue:any, oldValue:any) => {

            // An asynchronous formFor data source should reset any dirty flags.
            // A user tabbing in and out of a field also shouldn't be counted as dirty.
            // Easiest way to guard against this is to reset the initialization flag.
            if (newValue !== fieldDatum.bindableWrapper.bindable ||
              oldValue === undefined && newValue === '' ||
              newValue === undefined) {
              formDataWatcherInitialized = false;
            }

            fieldDatum.bindableWrapper.bindable = newValue;

            if (!$scope.validateOn || $scope.validateOn === 'change') {
              target.validateField(fieldName);
            }

            // Changes in form-data should also trigger validations.
            // Validation failures will not be displayed unless the form-field has been marked dirty (changed by user).
            // We shouldn't mark our field as dirty when Angular auto-invokes the initial watcher though,
            // So we ignore the first invocation...
            if (!formDataWatcherInitialized) {
              formDataWatcherInitialized = true;

              $scope.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);
            }

            fieldDatum.bindableWrapper.pristine = !$scope.formForStateHelper.hasFieldBeenModified(bindableFieldName);
          }));

      return bindableFieldWrapper;
    };

    /**
     * @inheritDocs
     */
    target.registerSubmitButton = (submitButtonScope:ng.IScope):SubmitButtonWrapper => {
      var bindableWrapper:SubmitButtonWrapper = {
        disabled: false
      };

      $scope.buttons.push(bindableWrapper);

      return bindableWrapper;
    };

    /**
     * @inheritDocs
     */
    target.resetErrors = () => {
      for (var bindableFieldName in $scope.fields) {
        // If the field is invalid, we don't want it to appear valid- just pristing.
        if ($scope.formForStateHelper.getFieldError(bindableFieldName)) {
          $scope.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);

          $scope.fields[bindableFieldName].bindableWrapper.pristine = true;
        }
      }

      $scope.formForStateHelper.setFormSubmitted(false);
      $scope.formForStateHelper.resetFieldErrors();
    };

    /**
     * @inheritDocs
     */
    target.resetField = (fieldName:string) => {
      var bindableFieldName:string = nestedObjectHelper.flattenAttribute(fieldName);

      // If the field is invalid, we don't want it to appear valid- just pristing.
      if ($scope.formForStateHelper.getFieldError(bindableFieldName)) {
        $scope.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);

        $scope.fields[bindableFieldName].bindableWrapper.pristine = true;
      }

      $scope.formForStateHelper.setFieldError(bindableFieldName, null);
    };

    /**
     * @inheritDocs
     */
    target.resetFields = () => {
      target.resetErrors();
    };

    /**
     * @inheritDocs
     */
    target.setFieldError = (fieldName:string, error:string) => {
      var bindableFieldName:string = nestedObjectHelper.flattenAttribute(fieldName);

      $scope.formForStateHelper.setFieldHasBeenModified(bindableFieldName, true);
      $scope.formForStateHelper.setFieldError(bindableFieldName, error);
    };

    /**
     * @inheritDocs
     */
    target.unregisterFormField = (fieldName:string) => {
      var bindableFieldName = nestedObjectHelper.flattenAttribute(fieldName);
      var formField = $scope.fields[bindableFieldName];

      if(formField){
        angular.forEach(
          formField.unwatchers,
          function (unwatch) {
            unwatch();
          });
      }

      delete $scope.fields[bindableFieldName];
    };

    /**
     * @inheritDocs
     */
    target.updateCollectionErrors = (fieldNameToErrorMap:{[fieldName:string]:string}) => {
      angular.forEach($scope.collectionLabels,
        (bindableWrapper, bindableFieldName) => {
          var error:string = nestedObjectHelper.readAttribute(fieldNameToErrorMap, bindableFieldName);

          $scope.formForStateHelper.setFieldError(bindableFieldName, error);
        });
    };

    /**
     * @inheritDocs
     */
    target.updateFieldErrors = function(fieldNameToErrorMap:{[fieldName:string]:string}):void {
      angular.forEach($scope.fields,
        function(scope, bindableFieldName):void {
          var error:string = nestedObjectHelper.readAttribute(fieldNameToErrorMap, scope.fieldName);

          $scope.formForStateHelper.setFieldError(bindableFieldName, error);
        });
    };

    /**
     * @inheritDocs
     */
    target.validateField = function(fieldName:string):void {
      var bindableFieldName = nestedObjectHelper.flattenAttribute(fieldName);

      $scope.formForStateHelper.setFieldHasBeenModified(bindableFieldName, true);

      // Run validations and store the result keyed by our bindableFieldName for easier subsequent lookup.
      if ($scope.$validationRuleset) {
        modelValidator.validateField(
          $scope.formFor,
          fieldName,
          $scope.$validationRuleset
        ).then(
          () => {
            $scope.formForStateHelper.setFieldError(bindableFieldName, null);
          },
          (error:string) => {
            $scope.formForStateHelper.setFieldError(bindableFieldName, error);
          });
      }
    };

    /**
     * @inheritDocs
     */
    target.validateForm = (showErrors?:boolean):ng.IPromise<any> => {
      // Reset errors before starting new validation.
      target.updateCollectionErrors({});
      target.updateFieldErrors({});

      var validateCollectionsPromise:ng.IPromise<any>;
      var validateFieldsPromise:ng.IPromise<any>;

      if ($scope.$validationRuleset) {
        var validationKeys:Array<string> = [];

        angular.forEach($scope.fields, (fieldDatum:FieldDatum) => {
          validationKeys.push(fieldDatum.fieldName);
        });

        validateFieldsPromise =
          modelValidator.validateFields($scope.formFor, validationKeys, $scope.$validationRuleset);
        validateFieldsPromise.then(angular.noop, target.updateFieldErrors);

        validationKeys = []; // Reset for below re-use

        angular.forEach($scope.collectionLabels,
          (bindableWrapper:BindableFieldWrapper, bindableFieldName:string) => {
            validationKeys.push(bindableFieldName);
          });

        validateCollectionsPromise =
          modelValidator.validateFields($scope.formFor, validationKeys, $scope.$validationRuleset);
        validateCollectionsPromise.then(angular.noop, target.updateCollectionErrors);

      } else {
        validateCollectionsPromise = promiseUtils.resolve();
        validateFieldsPromise = promiseUtils.resolve();
      }

      var deferred:ng.IDeferred<any> = promiseUtils.defer();

      promiseUtils.waitForAll([validateCollectionsPromise, validateFieldsPromise]).then(
        deferred.resolve,
        (errors:Array<any>) => {

          // If all collections are valid (or no collections exist) this will be an empty array.
          if (angular.isArray(errors[0]) && errors[0].length === 0) {
            errors.splice(0, 1);
          }

          // Errors won't be shown for clean fields, so mark errored fields as dirty.
          if (showErrors) {
            angular.forEach(errors, (errorObjectOrArray:any) => {
              var flattenedFields:Array<string> = nestedObjectHelper.flattenObjectKeys(errorObjectOrArray);

              angular.forEach(flattenedFields, (fieldName:string) => {
                var error:any = nestedObjectHelper.readAttribute(errorObjectOrArray, fieldName);

                if (error) {
                  var bindableFieldName:string = nestedObjectHelper.flattenAttribute(fieldName);

                  $scope.formForStateHelper.setFieldHasBeenModified(bindableFieldName, true);
                }
              });
            });
          }

          deferred.reject(errors);
        });

      return deferred.promise;
    };

    return target;
  }
}
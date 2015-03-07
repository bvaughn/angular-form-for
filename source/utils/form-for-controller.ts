module formFor {

  /**
   * Controller exposed via the FormFor directive's scope.
   *
   * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
   */
  export class FormForController {

    private $parse_:ng.IParseService;
    private $scope_:FormForScope;
    private modelValidator_:ModelValidator;
    private promiseUtils_:PromiseUtils;
    private nestedObjectHelper_:NestedObjectHelper;

    /**
     * Constructor.
     *
     * @param $parse Injector-supplied $parse service
     * @param $q Injector-supplied $q service
     * @param $scope formFor directive $scope
     * @param modelValidator ModelValidator service
     */
    constructor($parse:ng.IParseService,
                $q:ng.IQService,
                $scope:FormForScope,
                modelValidator:ModelValidator) {
      this.$parse_ = $parse;
      this.$scope_ = $scope;
      this.modelValidator_ = modelValidator;

      this.nestedObjectHelper_ = new NestedObjectHelper($parse);
      this.promiseUtils_ = new PromiseUtils($q);
    }

    /**
     * Collection headers should register themselves using this function in order to be notified of validation errors.
     *
     * @param fieldName Unique identifier of collection within model
     * @return A bind-friendly wrapper object describing the state of the collection
     */
    registerCollectionLabel(fieldName:string):BindableCollectionWrapper {
      var bindableFieldName:string = this.nestedObjectHelper_.flattenAttribute(fieldName);

      var bindableWrapper:BindableCollectionWrapper = {
        error: null,
        required: this.modelValidator_.isCollectionRequired(fieldName, this.$scope_.$validationRuleset)
      };

      this.$scope_.collectionLabels[bindableFieldName] = bindableWrapper;

      var watcherInitialized = false;

      this.$scope_.$watch('formFor.' + fieldName + '.length',
        () => {
          // The initial $watch should not trigger a visible validation...
          if (!watcherInitialized) {
            watcherInitialized = true;

          } else if (!this.$scope_.validateOn || this.$scope_.validateOn === 'change') {
            this.modelValidator_.validateCollection(this.$scope_.formFor, fieldName, this.$scope_.$validationRuleset).then(
              () => {
                this.$scope_.formForStateHelper.setFieldError(bindableFieldName, null);
              },
              (error:string) => {
                this.$scope_.formForStateHelper.setFieldError(bindableFieldName, error);
              });
          }
        });

      return bindableWrapper;
    }

    /**
     * All form-input children of formFor must register using this function.
     *
     * @param fieldName Unique identifier of field within model; used to map errors back to input fields
     * @return Bindable field wrapper
     */
    registerFormField(fieldName:string):BindableFieldWrapper {
      if (!fieldName) {
        throw Error('Invalid field name "' + fieldName + '" provided.');
      }

      var bindableFieldName:string = this.nestedObjectHelper_.flattenAttribute(fieldName);

      if (this.$scope_['fields'].hasOwnProperty(bindableFieldName)) {
        throw Error('Field "' + fieldName + '" has already been registered. Field names must be unique.');
      }

      var bindableFieldWrapper:BindableFieldWrapper = {
        bindable: null,
        disabled: this.$scope_.disable,
        error: null,
        pristine: true,
        required: this.modelValidator_.isFieldRequired(fieldName, this.$scope_.$validationRuleset),
        uid: FormForGUID.create()
      };

      // Store information about this field that we'll need for validation and binding purposes.
      // @see Above documentation for $scope.fields
      var fieldDatum:FieldDatum = {
        bindableWrapper: bindableFieldWrapper,
        fieldName: fieldName,
        formForStateHelper: this.$scope_.formForStateHelper,
        unwatchers: []
      };

      this.$scope_.fields[bindableFieldName] = fieldDatum;

      var getter:ng.ICompiledExpression = this.$parse_(fieldName);

      // Changes made by our field should be synced back to the form-data model.
      fieldDatum.unwatchers.push(
        this.$scope_.$watch('fields.' + bindableFieldName + '.bindableWrapper.bindable',
          (newValue:any, oldValue:any) => {
            if (newValue !== oldValue) {
              getter.assign(this.$scope_.formFor, newValue);
            }
          }));

      var formDataWatcherInitialized:boolean;

      // Changes made to the form-data model should likewise be synced to the field's bindable model.
      // (This is necessary for data that is loaded asynchronously after a form has already been displayed.)
      fieldDatum.unwatchers.push(
        this.$scope_.$watch('formFor.' + fieldName,
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

            if (!this.$scope_.validateOn || this.$scope_.validateOn === 'change') {
              this.validateField(fieldName);
            }

            // Changes in form-data should also trigger validations.
            // Validation failures will not be displayed unless the form-field has been marked dirty (changed by user).
            // We shouldn't mark our field as dirty when Angular auto-invokes the initial watcher though,
            // So we ignore the first invocation...
            if (!formDataWatcherInitialized) {
              formDataWatcherInitialized = true;

              this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);
            }

            fieldDatum.bindableWrapper.pristine = !this.$scope_.formForStateHelper.hasFieldBeenModified(bindableFieldName);
          }));

      return bindableFieldWrapper;
    }

    /**
     * All submitButton children must register with formFor using this function.
     *
     * @param submitButtonScope $scope of submit button directive
     * @return Submit button wrapper
     */
    registerSubmitButton(submitButtonScope:ng.IScope):SubmitButtonWrapper {
      var bindableWrapper:SubmitButtonWrapper = {
        disabled: false
      };

      this.$scope_.buttons.push(bindableWrapper);

      return bindableWrapper;
    }

    /**
     * Resets errors displayed on the <form> without resetting the form data values.
     */
    resetErrors():void {
      for (var bindableFieldName in this.$scope_.fields) {
        // If the field is invalid, we don't want it to appear valid- just pristing.
        if (this.$scope_.formForStateHelper.getFieldError(bindableFieldName)) {
          this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);

          this.$scope_.fields[bindableFieldName].bindableWrapper.pristine = true;
        }
      }

      this.$scope_.formForStateHelper.setFormSubmitted(false);
      this.$scope_.formForStateHelper.resetFieldErrors();
    }

    /**
     * Reset validation errors for an individual field.
     *
     * @param fieldName Field name within formFor data object (ex. billing.address)
     */
    resetField(fieldName:string):void {
      var bindableFieldName:string = this.nestedObjectHelper_.flattenAttribute(fieldName);

      // If the field is invalid, we don't want it to appear valid- just pristing.
      if (this.$scope_.formForStateHelper.getFieldError(bindableFieldName)) {
        this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);

        this.$scope_.fields[bindableFieldName].bindableWrapper.pristine = true;
      }

      this.$scope_.formForStateHelper.setFieldError(bindableFieldName, null);
    }

    /**
     * Alias to resetErrors.
     * @memberof form-for
     */
    resetFields():void {
      this.resetErrors();
    }

    /**
     * Manually set a validation error message for a given field.
     * This method should only be used when formFor's :validateOn attribute has been set to "manual".
     *
     * @param fieldName Field name within formFor data object (ex. billing.address)
     * @param error Error message to display (or null to clear the visible error)
     */
    setFieldError(fieldName:string, error:string):void {
      var bindableFieldName:string = this.nestedObjectHelper_.flattenAttribute(fieldName);

      this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, true);
      this.$scope_.formForStateHelper.setFieldError(bindableFieldName, error);
    }

    /**
     * Form fields created within ngRepeat or ngIf directive should clean up themselves on removal.
     *
     * @param fieldName Unique identifier of field within model
     */
    unregisterFormField(fieldName:string):void {
      var bindableFieldName = this.nestedObjectHelper_.flattenAttribute(fieldName);

      angular.forEach(
        this.$scope_.fields[bindableFieldName].unwatchers,
        function (unwatch) {
          unwatch();
        });

      delete this.$scope_.fields[bindableFieldName];
    }

    /*
     * Update all registered collection labels with the specified error messages.
     * Specified map should be keyed with fieldName and should container user-friendly error strings.
     * @param {Object} fieldNameToErrorMap Map of collection names (or paths) to errors
     */
    updateCollectionErrors(fieldNameToErrorMap:{[fieldName:string]:string}):void {
      angular.forEach(this.$scope_.collectionLabels,
        (bindableWrapper, bindableFieldName) => {
          var error:string = this.nestedObjectHelper_.readAttribute(fieldNameToErrorMap, bindableFieldName);

          this.$scope_.formForStateHelper.setFieldError(bindableFieldName, error);
        });
    }

    /*
     * Update all registered form fields with the specified error messages.
     * Specified map should be keyed with fieldName and should container user-friendly error strings.
     * @param {Object} fieldNameToErrorMap Map of field names (or paths) to errors
     */
    updateFieldErrors(fieldNameToErrorMap:{[fieldName:string]:string}):void {
      angular.forEach(this.$scope_.fields,
        (scope, bindableFieldName) => {
          var error:string = this.nestedObjectHelper_.readAttribute(fieldNameToErrorMap, scope.fieldName);

          this.$scope_.formForStateHelper.setFieldError(bindableFieldName, error);
        });
    }

    /**
     * Force validation for an individual field.
     * If the field fails validation an error message will automatically be shown.
     *
     * @param fieldName Field name within formFor data object (ex. billing.address)
     */
    validateField(fieldName:string):void {
      var bindableFieldName = this.nestedObjectHelper_.flattenAttribute(fieldName);

      this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, true);

      // Run validations and store the result keyed by our bindableFieldName for easier subsequent lookup.
      if (this.$scope_.$validationRuleset) {
        this.modelValidator_.validateField(
          this.$scope_.formFor,
          fieldName,
          this.$scope_.$validationRuleset
        ).then(
          () => {
            this.$scope_.formForStateHelper.setFieldError(bindableFieldName, null);
          },
          (error:string) => {
            this.$scope_.formForStateHelper.setFieldError(bindableFieldName, error);
          });
      }
    }

    /**
     * Validate all registered form-fields.
     * This method returns a promise that is resolved or rejected with a field to error message map.
     *
     * @param showErrors Mark fields with errors as invalid (visually) after validation
     */
    validateForm(showErrors?:boolean):ng.IPromise<any> {
      // Reset errors before starting new validation.
      this.updateCollectionErrors({});
      this.updateFieldErrors({});

      var validateCollectionsPromise:ng.IPromise<any>;
      var validateFieldsPromise:ng.IPromise<any>;

      if (this.$scope_.$validationRuleset) {
        var validationKeys:Array<string> = [];

        angular.forEach(this.$scope_.fields, (fieldDatum:FieldDatum) => {
          validationKeys.push(fieldDatum.fieldName);
        });

        validateFieldsPromise =
          this.modelValidator_.validateFields(this.$scope_.formFor, validationKeys, this.$scope_.$validationRuleset);
        validateFieldsPromise.then(angular.noop, this.updateFieldErrors);

        validationKeys = []; // Reset for below re-use

        angular.forEach(this.$scope_.collectionLabels,
          (bindableWrapper:BindableFieldWrapper, bindableFieldName:string) => {
            validationKeys.push(bindableFieldName);
          });

        validateCollectionsPromise =
          this.modelValidator_.validateFields(this.$scope_.formFor, validationKeys, this.$scope_.$validationRuleset);
        validateCollectionsPromise.then(angular.noop, this.updateCollectionErrors);

      } else {
        validateCollectionsPromise = this.promiseUtils_.resolve();
        validateFieldsPromise = this.promiseUtils_.resolve();
      }

      var deferred:ng.IDeferred<any> = this.promiseUtils_.defer();

      this.promiseUtils_.waitForAll([validateCollectionsPromise, validateFieldsPromise]).then(
        deferred.resolve,
        (errors:Array<any>) => {

          // If all collections are valid (or no collections exist) this will be an empty array.
          if (angular.isArray(errors[0]) && errors[0].length === 0) {
            errors.splice(0, 1);
          }

          // Errors won't be shown for clean fields, so mark errored fields as dirty.
          if (showErrors) {
            angular.forEach(errors, (errorObjectOrArray:any) => {
              var flattenedFields:Array<string> = this.nestedObjectHelper_.flattenObjectKeys(errorObjectOrArray);

              angular.forEach(flattenedFields, (fieldName:string) => {
                var error:any = this.nestedObjectHelper_.readAttribute(errorObjectOrArray, fieldName);

                if (error) {
                  var bindableFieldName:string = this.nestedObjectHelper_.flattenAttribute(fieldName);

                  this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, true);
                }
              });
            });
          }

          deferred.reject(errors);
        });

      return deferred.promise;
    }
  }
}
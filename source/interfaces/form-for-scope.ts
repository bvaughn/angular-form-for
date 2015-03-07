module formFor {

  /**
   * Describes formFor directive scope methods to coordinate type-safe communication between formFor and its controller.
   */
  export interface FormForScope  extends ng.IScope {

    /**
     * Service responsible for submitting and possibly validating form data.
     */
    $service:any;

    /**
     * Either the user-specified 'validationRules' or rules defined by the $injector-provided 'service'.
     */
    $validationRuleset:ValidationRuleSet;

    /**
     * Set of SubmitButtonWrapper used to disable buttons when form-submission is in progress.
     * Note that there is no current way to associate a wrapper with a button.
     */
    buttons:Array<SubmitButtonWrapper>;

    /**
     * Maps collection names (ex. 'hobbies') to bindable <collection-label> data.
     * Allows formFor to mark collections as required and to display collection-level errors.
     */
    collectionLabels:{[fieldName:string]:BindableCollectionWrapper};

    /**
     * Two way bindable attribute exposing access to the formFor controller API.
     * Refer to documentation for an example of how to use this binding to access the controller.
     */
    controller:FormForController;

    /**
     * Form is disabled.
     * Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute.
     * This attribute is 2-way bindable.
     */
    disable:boolean;

    /**
     * Field name to error message map.
     */
    fieldNameToErrorMap:{[fieldName:string]:string};

    /**
     * Map of safe (bindable, $scope.$watch-able) field names to FieldDatum objects.
     * A field like 'hobbies[0].name' might be mapped to something like 'hobbies__0__name' so we can safely $watch it.
     */
    fields:{[fieldName:string]:FieldDatum};

    /**
     * An object on $scope that formFor should read and write data to.
     * It is recommended that you bind to a copied object so that you can quickly revert changes if the user cancels or if submit fails.
     * For more information refer to angular.copy.
     */
    formFor:any;

    /**
     * FormForStateHelper utility that helps with binding complex field values.
     */
    formForStateHelper:FormForStateHelper;

    /**
     * Convenience mehtod for identifying an $injector-accessible model containing both the validation rules and submit function.
     * Validation rules should be accessible via an attribute named validationRules and the submit function should be named submit.
     */
    service:string;

    /**
     * Custom handler to be invoked upon a successful form submission.
     * Use this to display custom messages or do custom routing after submit.
     * This method should accept a "data" parameter.
     * See below for an example.
     * (To set a global, default submit-with handler see FormForConfiguration.)
     */
    submitComplete?:(data:any) => void;

    /**
     * Custom error handler function.
     * This function should accept an "error" parameter.
     * See below for an example.
     * (To set a global, default submit-with handler see FormForConfiguration.)
     */
    submitError?:(error:any) => void;

    /**
     * Function triggered on form-submit.
     * This function should accept a named parameter a form-data object and should return a promise to be resolved/rejected based on the result of the submission.
     * In the event of a rejection, the promise can return an error string or a map of field-names to specific errors.
     * See below for an example
     */
    submitWith:(formData:any) => ng.IPromise<any>;

    /**
     * The form data is valid based on the specified validation rules.
     */
    valid:boolean;

    /**
     * Controls form validation behavior.
     * Acceptable values include: change, submit, manual.
     * Forms validate on-change by default, which is to say that validation is run anytime a field-value is changed.
     * To defver validation until the form is submitted, use "submit" and to disable auto-validation entirely use "manual".
     */
    validateOn?:string;

    /**
     * Optional callback to be invoked whenever a form-submit is blocked due to a failed validation.
     */
    validationFailed?:Function;

    /**
     * Set of client-side validation rules (keyed by form field names) to apply to form-data before submitting.
     * For more information refer to the Validation Types page.
     *
     * @private
     * This is the data (optionally) specified by the user as an HTML attribute.
     * The value actually consumed by the formFor directive is '$validationRuleset'.
     */
    validationRules?:ValidationRuleSet;
  }
}
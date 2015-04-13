module formFor {

  /**
   * Describes the signature(s) for a custom field validation function.
   *
   * <p>This function is passed the following parameters:
   * <ul>
   *   <li>value: The value of the field, as entered into the form
   *   <li>formData: The entire form data object
   * </ul>
   *
   * <p>This function should return either a truthy/falsy value or a Promise to be resolved/rejected.
   * If a Promise is returned, it can be rejected with a custom validation error message.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface CustomValidationFunction {
    (value:any, formData:any, fieldName:any): boolean|ng.IPromise<string>;
  };
};
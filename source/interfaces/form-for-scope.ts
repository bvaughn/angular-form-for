/**
 * Describes formFor directive scope methods to coordinate type-safe communication between formFor and its controller.
 */
interface FormForScope extends ng.IScope {

  // TODO Document
  $validationRules:ValidationRuleSet;

  buttons:Array<SubmitButtonScope>;

  collectionLabels:{[fieldName:string]:BindableCollectionWrapper};

  disable:boolean;

  errorMap:{[fieldName:string]:string};

  fields:{[fieldName:string]:FieldDatum};

  formFor:FormFor;

  formForStateHelper:FormForStateHelper;

  /*
   * Update all registered collection labels with the specified error messages.
   * Specified map should be keyed with fieldName and should container user-friendly error strings.
   *
   * @param fieldNameToErrorMap Map of collection names (or paths) to errors
   */
  updateCollectionErrors(fieldNameToErrorMap:{[fieldName:string]:string}):void;

  /*
   * Update all registered form fields with the specified error messages.
   * Specified map should be keyed with fieldName and should container user-friendly error strings.
   *
   * @param fieldNameToErrorMap Map of field names (or paths) to errors
   */
  updateFieldErrors(fieldNameToErrorMap:{[fieldName:string]:string}):void;

  valid:boolean;

  validateOn:string;
};
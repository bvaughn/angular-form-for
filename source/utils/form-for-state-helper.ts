/// <reference path="nested-object-helper.ts" />

module formFor {

  /*
   * Organizes state management for form-submission and field validity.
   *
   * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
   */
  export class FormForStateHelper {

    private fieldNameToErrorMap_:{[fieldName:string]:string};
    private fieldNameToModifiedStateMap_:{[fieldName:string]:boolean};
    private formForScope_:FormForScope;
    private formSubmitted_:boolean;
    private nestedObjectHelper_:NestedObjectHelper;

    /**
     * $scope.$watch this value for notification of form-state changes.
     */
    public watchable:number;

    // TODO Add some documentation
    constructor($parse:ng.IParseService, $scope:FormForScope) {
      this.formForScope_ = $scope;
      this.nestedObjectHelper_ = new NestedObjectHelper($parse);

      this.formForScope_.fieldNameToErrorMap = $scope.fieldNameToErrorMap || {};
      this.formForScope_.valid = true;

      this.fieldNameToModifiedStateMap_ = {};
      this.formSubmitted_ = false;
      this.fieldNameToErrorMap_ = {};
      this.watchable = 0;
    }

    public getFieldError(fieldName:string):string {
      return this.nestedObjectHelper_.readAttribute(this.formForScope_.fieldNameToErrorMap, fieldName);
    }

    public hasFieldBeenModified(fieldName:string):boolean {
      return this.nestedObjectHelper_.readAttribute(this.fieldNameToModifiedStateMap_, fieldName);
    }

    public hasFormBeenSubmitted():boolean {
      return this.formSubmitted_;
    }

    public isFormInvalid():boolean {
      return !this.isFormValid();
    }

    public isFormValid():boolean {
      for (var prop in this.fieldNameToErrorMap_) {
        return false;
      }

      return true;
    }

    public resetFieldErrors():void {
      this.formForScope_.fieldNameToErrorMap = {};
    }

    public setFieldError(fieldName:string, error:string):void {
      var safeFieldName:string = this.nestedObjectHelper_.flattenAttribute(fieldName);

      this.nestedObjectHelper_.writeAttribute(this.formForScope_.fieldNameToErrorMap, fieldName, error);

      if (error) {
        this.fieldNameToErrorMap_[safeFieldName] = error;
      } else {
        delete this.fieldNameToErrorMap_[safeFieldName];
      }

      this.formForScope_.valid = this.isFormValid();
      this.watchable++;
    }

    public setFieldHasBeenModified(fieldName:string, hasBeenModified:boolean):void {
      this.nestedObjectHelper_.writeAttribute(this.fieldNameToModifiedStateMap_, fieldName, hasBeenModified);

      this.watchable++;
    }

    public setFormSubmitted(submitted:boolean):void {
      this.formSubmitted_ = submitted;
      this.watchable++;
    }
  }
}
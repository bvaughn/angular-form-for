module formFor {

  /*
   * Organizes state management for form-submission and field validity.
   *
   * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
   */
  export class FormForStateHelper {

    private $scope_:FormForScope;
    private fieldNameToErrorMap_:{[fieldName:string]:string};
    private fieldNameToModifiedStateMap_:{[fieldName:string]:boolean};
    private formSubmitted_:boolean;
    private nestedObjectHelper_:NestedObjectHelper;
    private watchableCounter_:number;

    // TODO Add some documentation
    constructor($parse:ng.IParseService, $scope:FormForScope) {
      this.$scope_ = $scope;
      this.nestedObjectHelper_ = new NestedObjectHelper($parse);

      this.$scope_.errorMap = $scope.errorMap || {};
      this.$scope_.valid = true;

      this.fieldNameToModifiedStateMap_ = {};
      this.formSubmitted_ = false;
      this.fieldNameToErrorMap_ = {};
      this.watchableCounter_ = 0;
    }

    public getFieldError(fieldName:string):string {
      return this.nestedObjectHelper_.readAttribute(this.$scope_.errorMap, fieldName);
    }

    public hasFieldBeenModified(fieldName:string):boolean {
      return this.nestedObjectHelper_.readAttribute(this.fieldNameToModifiedStateMap_, fieldName);
    }

    public hasFormBeenSubmitted():boolean {
      return this.formSubmitted_;
    }

    public isFieldValid(fieldName:string):boolean {
      return !this.getFieldError(fieldName);
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
      this.$scope_.errorMap = {};
    }

    public setFieldError(fieldName:string, error:string):void {
      var safeFieldName:string = this.nestedObjectHelper_.flattenAttribute(fieldName);

      this.nestedObjectHelper_.writeAttribute(this.$scope_.errorMap, fieldName, error);

      if (error) {
        this.fieldNameToErrorMap_[safeFieldName] = error;
      } else {
        delete this.fieldNameToErrorMap_[safeFieldName];
      }

      this.$scope_.valid = this.isFormValid();
      this.watchableCounter_++;
    }

    public setFieldHasBeenModified(fieldName:string, hasBeenModified:boolean):void {
      this.nestedObjectHelper_.writeAttribute(this.fieldNameToModifiedStateMap_, fieldName, hasBeenModified);

      this.watchableCounter_++;
    }

    public setFormSubmitted(submitted:boolean):void {
      this.formSubmitted_ = submitted;
      this.watchableCounter_++;
    }
  };
};
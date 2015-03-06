module formFor {

  /**
   * Map of field names to error messages describing validation failures.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface ValidationErrorMap {
    [fieldName:string]:string;
  };
};
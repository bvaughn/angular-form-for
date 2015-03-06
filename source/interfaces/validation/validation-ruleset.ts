module formFor {

  /**
   * Maps one or more attributes to a set of validation rules governing their behavior.
   * See {@link ValidationRules}.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface ValidationRuleSet {
    [fieldName:string]:ValidationRules;
  };
};
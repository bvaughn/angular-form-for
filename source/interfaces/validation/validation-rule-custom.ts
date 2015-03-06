module formFor {

  /**
   * Associates a custom validation rule with a custom failure message.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface ValidationRuleCustom {

    /**
     * Custom validation function.
     * If this function returns a rejected promise or a falsy value, the field should be considered invalid.
     */
    rule:CustomValidationFunction;

    /**
     * Custom error message to be shown for failed validations.
     */
    message:string;
  };
};

module formFor {

  /**
   * Associates a boolean validation rule with a custom failure message.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface ValidationRuleBoolean {

    /**
     * This rule is active.
     * If the condition it applies to is not met, the field should be considered invalid.
     */
    rule:boolean;

    /**
     * Custom error message to be shown for failed validations.
     */
    message:string;
  };
};
module formFor {

  /**
   * Associates a RegExp validation rule with a custom failure message.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface ValidationRuleRegExp {

    /**
     * Describes the regular expression condition to be applied to the associated field.
     * If the condition is not met, the field should be considered invalid.
     */
    rule:RegExp;

    /**
     * Custom error message to be shown for failed validations.
     */
    message:string;
  };
};
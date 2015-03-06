module formFor {

  /**
   * Associates a numeric validation rule with a custom failure message.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface ValidationRuleNumber {

    /**
     * Describes the numeric constraint to be applied to the associated field.
     * If the condition is not met, the field should be considered invalid.
     */
    rule:number;

    /**
     * Custom error message to be shown for failed validations.
     */
    message:string;
  };
};
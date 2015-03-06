module formFor {

  /**
   * Associates a field-type validation rule with a custom failure message.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface ValidationRuleFieldType {

    /**
     * The required field type.
     * If the condition it applies to is not met, the field should be considered invalid.
     */
    rule:ValidationFieldType;

    /**
     * Custom error message to be shown for failed validations.
     */
    message:string;
  };
};
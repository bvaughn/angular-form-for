/**
 * Associates a boolean validation rule with a custom failure message.
 */
interface ValidationRuleBoolean {

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
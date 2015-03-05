/**
 * Maps one or more attributes to a set of validation rules governing their behavior.
 * See {@link ValidationRules}.
 */
interface ValidationRuleSet {
  [fieldName:string]:ValidationRules;
}
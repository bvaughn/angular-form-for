module formFor {

  /**
   * Constraints that can be applied to a form field.
   * These constraints can be combined (e.g. "positive integer").
   */
  export enum ValidationFieldType {
    EMAIL = <any>"email",
    INTEGER = <any>"integer",
    NEGATIVE = <any>"negative",
    NON_NEGATIVE = <any>"nonNegative",
    NUMBER = <any>"number",
    POSITIVE = <any>"positive"
  };
};
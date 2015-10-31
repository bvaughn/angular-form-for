module formFor {

  /**
   * Identifies a validation failure type.
   */
  export enum ValidationFailureType {
    COLLECTION_MAX_SIZE = <any>"COLLECTION_MAX_SIZE",
    COLLECTION_MIN_SIZE = <any>"COLLECTION_MIN_SIZE",
    CUSTOM = <any>"CUSTOM",
    INCREMENT = <any>"INCREMENT",
    MAXIMUM = <any>"MAXIMUM",
    MAX_LENGTH = <any>"MAX_LENGTH",
    MINIMUM = <any>"MINIMUM",
    MIN_LENGTH = <any>"MIN_LENGTH",
    PATTERN = <any>"PATTERN",
    REQUIRED = <any>"REQUIRED_FIELD",
    TYPE_EMAIL = <any>"TYPE_EMAIL",
    TYPE_INTEGER = <any>"TYPE_INTEGER",
    TYPE_NEGATIVE = <any>"TYPE_NEGATIVE",
    TYPE_NON_NEGATIVE = <any>"TYPE_NON_NEGATIVE",
    TYPE_NUMERIC = <any>"TYPE_NUMERIC",
    TYPE_POSITIVE = <any>"TYPE_POSITIVE"
  };
};
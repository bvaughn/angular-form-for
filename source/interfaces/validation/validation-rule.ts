/// <reference path="../../../definitions/angular.d.ts" />

module formFor {

  /**
   * Describes rules for validating a single form-field.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface ValidationRules {

    /**
     * Special validation rules for fields that are collections.
     * For more information see {@link ValidationRuleCollection}.
     */
    collection?:ValidationRuleCollection;

    /**
     * Custom validation function.
     * Field must be approved by this function in order to be considered valid.
     * Approval can be indicated by a return value of TRUE or a Promise that resolves.
     * Rejected validation Promises may supply a custom error message.
     */
    custom?:CustomValidationFunction|ValidationRuleCustom;

    /**
     * Numeric values can be further defined with an increment.
     * Values not matching this increment will not be accepted.
     * For example, for an increment of 2, values 0, 2, and 4 would be considered valid but 1 or 3 would not.
     * This field can be either a number or an instance of {@link ValidationRuleNumber}.
     */
    increment?:number|ValidationRuleNumber;

    /**
     * Field's numeric value must be lesser than or equal to this value.
     * This field can be either a number or an instance of {@link ValidationRuleNumber}.
     */
    maximum?:Function|number|ValidationRuleNumber;

    /**
     * Field must contain no more than this many characters.
     * This field can be either a number or an instance of {@link ValidationRuleNumber}.
     */
    maxlength?:number|ValidationRuleNumber;

    /**
     * Field's numeric value must be greater than or equal to this value.
     * This field can be either a number or an instance of {@link ValidationRuleNumber}.
     */
    minimum?:Function|number|ValidationRuleNumber;

    /**
     * Field must contain at least this many characters.
     * This field can be either a number or an instance of {@link ValidationRuleNumber}.
     */
    minlength?:number|ValidationRuleNumber;

    /**
     * Field contains a string that much match this regular expression pattern.
     * This field can be either a RegExp or an instance of {@link ValidationRuleRegExp}.
     */
    pattern?:RegExp|ValidationRuleRegExp;

    /**
     * Is this field required?
     * This field can be either a boolean or an instance of {@link ValidationRuleBoolean}.
     */
    required?:Function|boolean|ValidationRuleBoolean;

    /**
     * Enumeration for common validation types.
     * Supported types are described in {@link ValidationFieldType}.
     * You can also specify multiple types (ex. "positive integer").
     */
    type?:ValidationFieldType|ValidationRuleFieldType;
  };
};

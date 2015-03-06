module formFor {

  /**
   * Describes rules for validating a form-field that contains a collection.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface ValidationRuleCollection {

    /**
     * Rules for validating properties of objects within the current collection.
     * See {@link ValidationRules}.
     */
    fields?:ValidationRuleSet;

    /**
     * The collection must contain no more than this many items.
     */
    max?:number|ValidationRuleNumber;

    /**
     * The collection must contain at least this many items.
     */
    min?:number|ValidationRuleNumber;
  };
};
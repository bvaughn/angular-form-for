module formFor {

  /**
   * Wrapper object containing using information about a formFor field.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface FieldDatum {

    /**
     * Shared between formFor and field directives.
     */
    bindableWrapper:BindableFieldWrapper;

    /**
     * Uniquely identifies a form field.
     */
    fieldName:string;

    /**
     * Helper utility class used by formFor and its directives.
     */
    formForStateHelper:FormForStateHelper;

    /**
     * Callbacks for removing $scope.$watch watchers.
     */
    unwatchers:Array<Function>;
  };
};
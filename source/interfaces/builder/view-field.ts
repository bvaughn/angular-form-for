module formFor {

  /**
   * Describes the expected input UI for an individual model field.
   */
  export interface ViewField {

    /**
     * Attribute name within form data object (e.g. "username" within <code>{username: "John Doe"}</code>).
     * This is a convenience attribute added by Forms JS based on the map key in {@link ViewSchema}.
     * @private
     */
    key_:string;

    /**
     * An empty/blank selection should be allowed.
     * This property is only supported for {@link BuilderFieldType.SELECT} inputs.
     */
    allowBlank?:boolean;

    /**
     * Enable filtering of list via a text input at the top of the drop-down.
     * This property is only supported for {@link BuilderFieldType.SELECT} inputs.
     */
    enableFiltering?:boolean;

    /**
     * Optional help text providing additional context to users.
     */
    help?:string;

    /**
     * Input type used by this field.
     * This is a required field.
     */
    inputType?:BuilderFieldType;

    /**
     * Field <label>; defaults to humanized form of attribute name (e.g. "firstName" becomes "First Name").
     */
    label?:string;

    /**
     * Optional override for label key in options array; defaults to "label".
     * This property is only supported for {@link BuilderFieldType.SELECT} inputs.
     */
    labelAttribute?:string;

    /**
     * Designates a text input as multi-line (<textarea> vs <input>).
     * This of property is only supported for {@link BuilderFieldType.TEXT} inputs.
     */
    multiline?:boolean;

    /**
     * Drop-down list should allow multiple selections.
     * This property is only supported for {@link BuilderFieldType.SELECT} inputs.
     */
    multipleSelection?:boolean;

    /**
     * Placeholder text shown when field is empty.
     */
    placeholder?:string;

    /**
     * Specifies the number of rows for a multiline text input.
     * This of property is only supported for {@link BuilderFieldType.TEXT} inputs.
     */
    rows?:number;

    /**
     * Optional input ID.
     */
    uid?:string;

    /**
     * Optional override for value key in options array; defaults to "value".
     * This property is only supported for {@link BuilderFieldType.SELECT} inputs.
     */
    valueAttribute?:string;

    /**
     * Enumeration of values for <select> menus or <input type="radio"> inputs.
     * This property is only supported for {@link BuilderFieldType.RADIO} and {@link BuilderFieldType.SELECT} inputs.
     */
    values?:Array<any>;
  }
}
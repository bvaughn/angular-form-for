module formFor {

  /**
   * Wrapper object for a form-field attribute that exposes field-state to field directives.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export class BindableFieldWrapper {

    /**
     * Input should 2-way bind against this attribute in order to sync data with formFor.
     */
    public bindable:any;

    /**
     * Input should disable itself if this value becomes true; typically this means the form is being submitted.
     */
    public disabled:boolean;

    /**
     * Input should display the string contained in this field (if one exists); this means the input value is invalid.
     */
    public error:string;

    /**
     * Unique identifier for field; can be used for WCAG compatibility (aria-* attributes).
     */
    public pristine:boolean;

    /**
     * Input should display a 'required' indicator if this value is true.
     */
    public required:boolean;

    /**
     * Field has been modified since initialization (or last reset via resetField/resetFields).
     */
    public uid:string;
  };
};
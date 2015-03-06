module formFor {

  /**
   * A bind-friendly wrapper object describing the state of the collection.
   *
   * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
   */
  export interface BindableCollectionWrapper {

    /**
     * Header should display the string contained in this field (if one exists); this means the collection is invalid.
     */
    error?:string;

    /**
     * Header should display a 'required' indicator if this value is true.
     */
    required:boolean;
  };
};
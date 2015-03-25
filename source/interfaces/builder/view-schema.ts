module formFor {

  /**
   * Describes the desired view layout for an auto-generated form.
   * This schema is a map of field-name to view options.
   */
  export interface ViewSchema {
    [fieldName:string]:ViewField;
  }
}
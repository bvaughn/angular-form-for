module formFor {

  /**
   * Object containing keys to be observed by the input button.
   */
  export interface SubmitButtonWrapper {

    /**
     * Button should disable itself if this value becomes true; typically this means the form is being submitted.
     */
    disabled:boolean;
  };
};
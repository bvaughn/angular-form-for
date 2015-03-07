module formFor {

  /**
   * Utility for working with strings.
   *
   * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
   */
  export class StringUtil {

    /**
     * Converts text in common variable formats to humanized form.
     *
     * @param text Name of variable to be humanized (ex. myVariable, my_variable)
     * @returns Humanized string (ex. 'My Variable')
     */
    public static humanize(text:string):string {
      if (!text) {
        return '';
      }

      text = text.replace(/[A-Z]/g, function (match) {
        return ' ' + match;
      });

      text = text.replace(/_([a-z])/g, function (match, $1) {
        return ' ' + $1.toUpperCase();
      });

      text = text.replace(/\s+/g, ' ');
      text = text.trim();
      text = text.charAt(0).toUpperCase() + text.slice(1);

      return text;
    }
  }
}
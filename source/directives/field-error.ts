module formFor {

  interface FieldErrorScope extends ng.IScope {

    /**
     * Error messages to display (or null if field is valid OR pristine)
     */
    error?:string;

    /**
     * Apply additional 'left-aligned' class to error message (useful for checkbox and radio items)
     */
    leftAligned?:boolean;

    /**
     * Optional UID for HTML element containing the error message string
     */
    uid?:string;
   }

  /**
   * Displays a standard formFor field validation error message.
   *
   * @example
   * // To display a field error:
   * <field-error error="This is an error message">
   * </field-error>
   */
  export function FieldErrorDirective():ng.IDirective {
    return {
      restrict: 'EA',
      templateUrl: 'form-for/templates/field-error.html',

      scope: {
        error: '=',
        leftAligned: '@?',
        uid: '@'
      },

      link: function($scope:FieldErrorScope):void {
        // No-op
      }
    };
  }

  angular.module('formFor').directive('fieldError', FieldErrorDirective);
}
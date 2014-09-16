/**
 * @ngdoc Directives
 * @name field-error
 * @description
 * Displays a standard formFor field validation error message.
 *
 * @param {String} error Error messages to display (or null if field is valid OR pristine)
 * @param {Boolean} leftAligned Apply additional 'left-aligned' class to error message (useful for checkbox and radio items)
 * @param {String} uid Optional UID for HTML element containing the error message string
 *
 * @example
 * // To display a field error:
 * <field-error error="This is an error message">
 * </field-error>
 */
angular.module('formFor').directive('fieldError',
  function( $sce, FormForConfiguration ) {
    return {
      restrict: 'EA',
      templateUrl: 'form-for/templates/field-error.html',
      scope: {
        error: '=',
        leftAligned: '@?',
        uid: '@'
      }
    };
  });

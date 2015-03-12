/// <reference path="../services/form-for-configuration.ts" />

module formFor {

  /**
   * FieldLabel $scope.
   */
  interface FieldLabelScope extends ng.IScope {

    /**
     * Bindable label for template to display.
     */
    bindableLabel:string;

    /**
     * Optional help tooltip to display on hover.
     * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
     */
    help:string;

    /**
     * ID of the associated input field element; used as the :for attribute of the inner <label>.
     */
    inputUid:string;

    /**
     * Incoming (user-specified) label.
     * This value is passed along to 'bindableLabel' to be consumed by the associated template.
     * This string can contain HTML markup.
     */
    label:string;

    /**
     * Optional attribute specifies that this field is a required field.
     * If a required label has been provided, this component displays that value for required fields.
     */
    requiredLabel:string;

    /**
     * Optional UID for HTML element containing the label string
     */
    uid?:string;
  }

  /**
   * This component is only intended for internal use by the formFor module.
   *
   * @example
   * // To display a simple label with a help tooltip:
   * <field-label label="Username"
   *              help="This will be visible to other users">
   * </field-label>
   *
   * @param $sce $injector-supplied $sce service
   * @param formForConfiguration
   */
  export function FieldLabelDirective($sce:ng.ISCEService, formForConfiguration:FormForConfiguration):ng.IDirective {
    return {
      replace: true, // Necessary for CSS sibling selectors
      restrict: 'EA',
      templateUrl:'form-for/templates/field-label.html',

      scope: {
        inputUid: '@',
        help: '@?',
        label: '@',
        required: '@?',
        uid: '@'
      },

      controller: function($scope:FieldLabelScope):void {
        $scope.$watch('label', function(value) {
          $scope.bindableLabel = $sce.trustAsHtml(value);
        });

        $scope.$watch('required', function(required) {
          $scope.requiredLabel = $scope.$eval(required) ? formForConfiguration.requiredLabel : null;
        });
      }
    };
  }

  angular.module('formFor').directive('fieldLabel',
    ($sce, FormForConfiguration) => FieldLabelDirective($sce, FormForConfiguration));
}
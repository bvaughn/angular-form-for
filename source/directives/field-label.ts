/// <reference path="../services/form-for-configuration.ts" />

module formFor {

  /**
   * FieldLabel $scope.
   */
  interface FieldLabelScope extends ng.IScope {

    /**
     * HTML field attributes; passed along so that custom view implementations can access custom parameters.
     */
    attributes:any;

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
     * Overridden class(es) to be used for the help icon (if :help has been specified).
     */
    helpIcon:string;

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
     * Optional class-name for <label>.
     */
    labelClass?:string;

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

  var $sce_:ng.ISCEService;
  var formForConfiguration_:FormForConfiguration;

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
  export class FieldLabelDirective implements ng.IDirective {

    replace:boolean = true; // Necessary for CSS sibling selectors
    restrict:string = 'EA';
    templateUrl:string = ($element, $attributes) => {
        return $attributes['template'] || 'form-for/templates/field-label.html';
    };

    scope:any = {
      inputUid: '@',
      help: '@?',
      label: '@',
      labelClass: '@?',
      required: '@?',
      uid: '@'
    };

    /* @ngInject */
    constructor($sce:ng.ISCEService, formForConfiguration:FormForConfiguration) {
      $sce_ = $sce;
      formForConfiguration_ = formForConfiguration;
    }

    /* @ngInject */
    link($scope:FieldLabelScope, $element:ng.IAugmentedJQuery, $attributes:ng.IAttributes):void {
      $scope.attributes = $attributes;

      $scope.helpIcon = formForConfiguration_.helpIcon;

      $scope.$watch('label', function(value) {
        $scope.bindableLabel = $sce_.trustAsHtml(value);
      });

      $scope.$watch('required', function(required) {
        $scope.requiredLabel = $scope.$eval(required) ? formForConfiguration_.requiredLabel : null;
      });
    }
  }

  angular.module('formFor').directive('fieldLabel',
    ($sce, FormForConfiguration) => {
      return new FieldLabelDirective($sce, FormForConfiguration);
    });
}

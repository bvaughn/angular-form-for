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
   */
  export class FieldLabel implements ng.IDirective {

    replace:boolean = true; // Necessary for CSS sibling selectors
    restrict:string = 'EA';
    templateUrl:string = 'form-for/templates/field-label.html';

    scope:any = {
      inputUid: '@',
      help: '@?',
      label: '@',
      required: '@?',
      uid: '@'
    };

    private $sce_:ng.ISCEService;
    private formForConfiguration_:FormForConfiguration;

    /**
     * Constructor.
     *
     * @param $sce $injector-supplied $sce service
     * @param formForConfiguration
     */
    constructor($sce:ng.ISCEService, formForConfiguration:FormForConfiguration) {
      this.$sce_ = $sce;
      this.formForConfiguration_ = formForConfiguration;
    }

    controller($scope:FieldLabelScope):void {
      $scope.$watch('label', function(value) {
        $scope.bindableLabel = this.$sce_.trustAsHtml(value);
      });

      $scope.$watch('required', function(required) {
        $scope.requiredLabel = $scope.$eval(required) ? this.formForConfiguration_.requiredLabel : null;
      });
    }
  }

  angular.module('formFor').directive('fieldLabel',
    ($sce, FormForConfiguration) => new FieldLabel($sce, FormForConfiguration));
}
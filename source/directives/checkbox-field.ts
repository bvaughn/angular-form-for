/// <reference path="../services/field-helper.ts" />
/// <reference path="../services/form-for-configuration.ts" />

module formFor {

  /**
   * CheckboxField $scope.
   */
  interface CheckboxFieldScope extends ng.IScope {

    /**
     * Name of the attribute within the parent form-for directive's model object.
     * This attributes specifies the data-binding target for the input.
     * Dot notation (ex "address.street") is supported.
     */
    attribute:string;

    /**
     * HTML field attributes; passed along so that custom view implementations can access custom parameters.
     */
    attributes: any;

    /**
     * Optional function to be invoked on checkbox change.
     */
    changed?:Function;

    /**
     * Disable input element.
     * Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute.
     */
    disable:boolean;

    /**
     * Optional help tooltip to display on hover.
     * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
     */
    help?:string;

    /**
     * Optional field label displayed after the checkbox input.
     * Although not required, it is strongly suggested that you specify a value for this attribute.
     * HTML is allowed for this attribute.
     */
    label?:string;

    /**
     * Optional class-name for field <label>.
     */
    labelClass?:string;

    /**
     * Shared between formFor and CheckboxField directives.
     */
    model:BindableFieldWrapper;

    /**
     * Optional custom tab index for input; by default this is 0 (tab order chosen by the browser)
     */
    tabIndex?:number;

    /**
     * View should call this method to indicate that the <input type=checkbox> has been clicked.
     * This method is responsible for updating the bindable value.
     */
    toggle:Function;

    /**
     * Optional ID to assign to the inner <input type="checkbox"> element;
     * A unique ID will be auto-generated if no value is provided.
     */
    uid?:string;
  }

  var $log_:ng.ILogService;
  var fieldHelper_:FieldHelper;

  /**
   * Renders a checkbox <code>input</code> with optional label.
   * This type of component is well-suited for boolean attributes.
   *
   * @example
   * // To display a simple TOS checkbox you might use the following markup:
   * <checkbox-field label="I agree with the TOS"
   *                 attribute="accepted">
   * </checkbox-field>
   */
  export class CheckboxFieldDirective implements ng.IDirective {

    require:string = '^formFor';
    restrict:string = 'EA';
    templateUrl:string = ($element, $attributes) => {
        return $attributes['template'] || 'form-for/templates/checkbox-field.html';
    };

    scope:any = {
      attribute: '@',
      disable: '=',
      help: '@?',
      changed: '&?'
    };

    /* @ngInject */
    constructor($log:ng.ILogService, fieldHelper:FieldHelper) {
      $log_ = $log;
      fieldHelper_ = fieldHelper;
    }

    /* @ngInject */
    link($scope:CheckboxFieldScope,
         $element:ng.IAugmentedJQuery,
         $attributes:ng.IAttributes,
         formForController:FormForController) {
      if (!$scope['attribute']) {
        $log_.error('Missing required field "attribute"');

        return;
      }

      $scope.attributes = $attributes;

      $scope.tabIndex = $attributes['tabIndex'] || 0;

      $scope.toggle = function toggle() {
        if (!$scope.disable && !$scope.model.disabled) {
          $scope.model.bindable = !$scope.model.bindable;
        }
      };

      $scope.$watch('model.bindable', function (value) {
        if (!$scope.model) return;
        $scope.model.bindable = !$scope.model.required ? !!value : (value || undefined);
      });

      fieldHelper_.manageLabel($scope, $attributes, false);
      fieldHelper_.manageFieldRegistration($scope, $attributes, formForController);
    }
  }

  angular.module('formFor').directive('checkboxField',
    ($log, FieldHelper) => {
      return new CheckboxFieldDirective($log, FieldHelper);
    });
}
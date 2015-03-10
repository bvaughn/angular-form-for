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
  export function CheckboxFieldDirective($log:ng.ILogService):ng.IDirective {
    var fieldHelper:FieldHelper = new FieldHelper(FormForConfiguration);

    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/checkbox-field.html',

      scope: {
        attribute: '@',
        disable: '=',
        help: '@?',
        changed: '@?'
      },

      link: ($scope:CheckboxFieldScope,
             $element:ng.IAugmentedJQuery,
             $attributes:ng.IAttributes,
             formForController:FormForController) => {
        if (!$scope['attribute']) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.tabIndex = $attributes['tabIndex'] || 0;

        $scope.toggle = function toggle() {
          if (!$scope.disable && !$scope.model.disabled) {
            $scope.model.bindable = !$scope.model.bindable;
          }
        };

        fieldHelper.manageLabel($scope, $attributes, false);
        fieldHelper.manageFieldRegistration($scope, $attributes, formForController);
      }
    };
  }

  angular.module('formFor').directive('checkboxField',
    ($log) => CheckboxFieldDirective($log));
}
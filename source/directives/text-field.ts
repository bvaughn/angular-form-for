/// <reference path="../services/field-helper.ts" />
/// <reference path="../enums/validation-field-type.ts" />

module formFor {

  /**
   * TextField $scope.
   */
  interface TextFieldScope extends ng.IScope {

    /**
     * Name of the attribute within the parent form-for directive's model object.
     * This attributes specifies the data-binding target for the input.
     * Dot notation (ex "address.street") is supported.
     */
    attribute:string;

    /**
     * HTML field attributes; passed along so that custom view implementations can access custom parameters.
     */
    attributes:any;

    /**
     * Auto-focus the input field.
     */
    autofocus?:boolean;

    /**
     * Optional function to be invoked on text input blur.
     */
    blurred?:Function;

    /**
     * NgModelController of the input.
     */
    controller:any;

    /**
     * Debounce duration (in ms) before input text is applied to model and evaluated.
     * To disable debounce (update only on blur) specify a value of false.
     * This value's default is determined by FormForConfiguration.
     */
    debounce?:number;

    /**
     * Disable input element.
     * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
     */
    disable:boolean;

    /**
     * Optional help tooltip to display on hover.
     * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
     */
    help?:string;

    /**
     * Optional function to be invoked on text input focus.
     */
    focused?:Function;

    /**
     * Optional CSS class to display as an icon after the input field.
     * An object with the following keys may also be provided: pristine, valid, invalid
     * In this case the icon specified by a particular state will be shown based on the field's validation status.
     */
    iconAfter?:string;

    /**
     * Optional function to be invoked when the after-icon is clicked.
     */
    iconAfterClicked?:Function;

    /**
     * Optional CSS class to display as a icon before the input field.
     * An object with the following keys may also be provided: pristine, valid, invalid
     * In this case the icon specified by a particular state will be shown based on the field's validation status.
     */
    iconBefore?:string;

    /**
     * Optional function to be invoked when the before-icon is clicked.
     */
    iconBeforeClicked?:Function;

    /**
     * Optional field label displayed before the input.
     * (Although not required, it is strongly suggested that you specify a value for this attribute.) HTML is allowed for this attribute.
     */
    label?:string;

    /**
     * Optional class-name for field <label>.
     */
    labelClass?:string;

    /**
     * Data shared between formFor and textField directives.
     */
    model:BindableFieldWrapper;

    /**
     * Enable multi-line input.
     */
    multiline?:boolean;

    /**
     * View should call this method on blur.
     * This method will ensure that the correct user-specified $scope callback is executed.
     */
    onBlur:Function;

    /**
     * View should call this method when the after-icon is clicked.
     * This method will ensure that the correct user-specified $scope callback is executed.
     */
    onIconAfterClick:Function;

    /**
     * View should call this method when the before-icon is clicked.
     * This method will ensure that the correct user-specified $scope callback is executed.
     */
    onIconBeforeClick:Function;

    /**
     * View should call this method on focus.
     * This method will ensure that the correct user-specified $scope callback is executed.
     */
    onFocus:Function;

    /**
     * Optional placeholder text to display if input is empty.
     */
    placeholder?:string;

    /**
     * Optional number of rows for a multline `<textarea>`; defaults to 3.
     */
    rows?:number;

    /**
     * Optional custom tab index for input; by default this is 0 (tab order chosen by the browser)
     */
    tabIndex?:number;

    /**
     * Optional HTML input-type (ex. text, password, etc.).
     * Defaults to "text".
     */
    type:string;

    /**
     * Optional ID to assign to the inner <input type="checkbox"> element;
     * A unique ID will be auto-generated if no value is provided.
     */
    uid?:string;

    /**
     * Exposes special validation rules to the view layer to be passed on to the <input> control.
     */
    validationRules:Object;
  }

  var $log_:ng.ILogService;
  var $timeout_:ng.ITimeoutService;
  var fieldHelper_:FieldHelper;

  /**
   * Displays an HTML &lt;input&gt; or &lt;textarea&gt; element along with an optional label.
   *
   * <p>The HTML &lt;input&gt; type can be configured to allow for passwords, numbers, etc.
   * This directive can also be configured to display an informational tooltip.
   * In the event of a validation error, this directive will also render an inline error message.
   *
   * <p>This directive supports the following HTML attributes in addition to its scope properties:
   *
   * <ul>
   *   <li>autofocus: The presence of this attribute will auto-focus the input field.
   *   <li>multiline: The presence of this attribute enables multi-line input.
   * </ul>
   *
   * @example
   * // To create a password input you might use the following markup:
   * <text-field attribute="password" label="Password" type="password"></text-field>
   *
   * // To create a more advanced input field, with placeholder text and help tooltip you might use the following markup:
   * <text-field attribute="username" label="Username"
   *             placeholder="Example brianvaughn"
   *             help="Your username will be visible to others!"></text-field>
   *
   * // To render a multiline text input (or <textarea>):
   * <text-field attribute="description" label="Description" multiline></text-field>
   *
   * // To render icons based on the status of the field (pristin, invalid, valid) pass an object:
   * <text-field attribute="username" label="Username"
   *             icon-after="{pristine: 'fa fa-user', invalid: 'fa fa-times', valid: 'fa fa-check'}">
   * </text-field>
   */
  export class TextFieldDirective implements ng.IDirective {

    require:string = '^formFor';
    restrict:string = 'EA';
    templateUrl:string = ($element, $attributes) => {
        return $attributes['template'] || 'form-for/templates/text-field.html';
    };

    scope:any = {
      attribute: '@',
      debounce: '@?',
      disable: '=',
      focused: '&?',
      blurred: '&?',
      help: '@?',
      iconAfterClicked: '&?',
      iconBeforeClicked: '&?',
      placeholder: '@?',
      rows: '=?',
      controller: '=?'
    };

    /* @ngInject */
    constructor($log:ng.ILogService,
                $timeout:ng.ITimeoutService,
                fieldHelper:FieldHelper) {
      $log_ = $log;
      $timeout_ = $timeout;
      fieldHelper_ = fieldHelper;
    }

    link($scope:TextFieldScope,
         $element:ng.IAugmentedJQuery,
         $attributes:ng.IAttributes,
         formForController:FormForController):void {

      if (!$scope.attribute) {
        $log_.error('Missing required field "attribute"');

        return;
      }

      // Expose textField attributes to textField template partials for easier customization (see issue #61)
      $scope.attributes = $attributes;

      $scope.rows = $scope.rows || 3;
      $scope.type = $attributes['type'] || 'text';
      $scope.multiline = $attributes.hasOwnProperty('multiline') && $attributes['multiline'] !== 'false';
      $scope.tabIndex = $attributes['tabIndex'] || 0;

      $timeout_(() => {
        $scope.controller = $element.find($scope.multiline ? 'textarea' : 'input').controller('ngModel');
      });

      if ($attributes.hasOwnProperty('autofocus')) {
        $timeout_(() => {
          $element.find($scope.multiline ? 'textarea' : 'input')[0].focus();
        });
      }

      fieldHelper_.manageLabel($scope, $attributes, false);
      fieldHelper_.manageFieldRegistration($scope, $attributes, formForController);

      // Expose certain validation rules (such as min/max) so that the view layer can pass them along
      var validationRules:ValidationRules = formForController.getValidationRulesForAttribute($scope.attribute);
      if (validationRules) {
        $scope.validationRules = {
          increment: validationRules.increment,
          maximum: validationRules.maximum,
          minimum: validationRules.minimum
        }

        // TODO We could pull the text field :type from validation rules as well
        // But that would be a non-backwards-compatible change.
      }

      // Update $scope.iconAfter based on the field state (see class-level documentation for more)
      if ($attributes['iconAfter']) {
        var updateIconAfter:(value?:any) => any = () => {
          if (!$scope.model) {
            return;
          }

          var iconAfter:any =
            $attributes['iconAfter'].charAt(0) === '{' ?
              $scope.$eval($attributes['iconAfter']) :
              $attributes['iconAfter'];

          if (angular.isObject(iconAfter)) {
            if ($scope.model.error) {
              $scope.iconAfter = iconAfter['invalid'];
            } else if ($scope.model.pristine) {
              $scope.iconAfter = iconAfter['pristine'];
            } else {
              $scope.iconAfter = iconAfter['valid'];
            }
          } else {
            $scope.iconAfter = iconAfter;
          }
        };

        $attributes.$observe('iconAfter', updateIconAfter);
        $scope.$watch('model.error', updateIconAfter);
        $scope.$watch('model.pristine', updateIconAfter);
      }

      // Update $scope.iconBefore based on the field state (see class-level documentation for more)
      if ($attributes['iconBefore']) {
        var updateIconBefore:(value?:any) => any = () => {
          if (!$scope.model) {
            return;
          }

          var iconBefore:any =
            $attributes['iconBefore'].charAt(0) === '{' ?
              $scope.$eval($attributes['iconBefore']) :
              $attributes['iconBefore'];

          if (angular.isObject(iconBefore)) {
            if ($scope.model.error) {
              $scope.iconBefore = iconBefore['invalid'];
            } else if ($scope.model.pristine) {
              $scope.iconBefore = iconBefore['pristine'];
            } else {
              $scope.iconBefore = iconBefore['valid'];
            }
          } else {
            $scope.iconBefore = iconBefore;
          }
        };

        $attributes.$observe('iconBefore', updateIconBefore);
        $scope.$watch('model.error', updateIconBefore);
        $scope.$watch('model.pristine', updateIconBefore);
      }

      $scope.onIconAfterClick = () => {
        if ($scope.hasOwnProperty('iconAfterClicked')) {
          $scope.iconAfterClicked();
        }
      };
      $scope.onIconBeforeClick = () => {
        if ($scope.hasOwnProperty('iconBeforeClicked')) {
          $scope.iconBeforeClicked();
        }
      };
      $scope.onFocus = () => {
        if ($scope.hasOwnProperty('focused')) {
          $scope.focused();
        }
      };
      $scope.onBlur = () => {
        if ($scope.hasOwnProperty('blurred')) {
          $scope.blurred();
        }
      };
    }
  }

  angular.module('formFor').directive('textField',
    ($log, $timeout, FieldHelper) => {
      return new TextFieldDirective($log, $timeout, FieldHelper);
    });
}

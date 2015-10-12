/// <reference path="../services/field-helper.ts" />
/// <reference path="../services/form-for-configuration.ts" />
/// <reference path="../utils/form-for-guid.ts" />

module formFor {

  /**
   * RadioField $scope.
   */
  interface RadioFieldScope extends ng.IScope {

    /**
     * Name of the attribute within the parent form-for directive's model object.
     * This attributes specifies the data-binding target for the input.
     * Dot notation (ex "address.street") is supported.
     */
    attribute:string;

    /**
     * This RadioField is currently selected for its group.
     */
    checked:boolean;

    /**
     * Click handler; toggles radio group selected value.
     */
    click:Function;

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
     * Only the primary <radio> input should show error message text.
     * If TRUE, this indicates that the current RadioField is not the primary <radio> and so should not show the error.
     */
    hideErrorMessage?:boolean;

    /**
     * Optional group label to be displayed above the radio inputs.
     * HTML is allowed for this attribute.
     */
    label?:string;

    /**
     * Optional class-name for field <label>.
     */
    labelClass?:string;

    /**
     * Optional override for label key in options array.
     * Defaults to "label".
     */
    labelAttribute?:string;

    /**
     * Shared between formFor and RadioField directives.
     * This same data is also shared between all <radio> instances of the current radio group.
     */
    model:BindableFieldWrapper;

    /**
     * Enumeration of radio options.
     * Individual options may be strings or objects containing :label and :value keys.
     * Use labelAttribute and valueAttribute to specify custom option-keys.
     */
    options:Array<String|Object>;

    /**
     * Optional custom tab index for input; by default this is 0 (tab order chosen by the browser).
     */
    tabIndex?:number;

    /**
     * Optional ID to assign to the inner <input type="checkbox"> element;
     * A unique ID will be auto-generated if no value is provided.
     */
    uid:string;

    /**
     * Optional override for value key in options array.
     * Defaults to "value".
     */
    valueAttribute:string;
  }

  /**
   * Radio group information shared between all RadioField instances.
   * This data is created by the first RadioField and shared among all others.
   */
  interface RadioGroupDatum {

    /**
     * The primary RadioField $scope; primary in this case just means the first to register.
     */
    defaultScope:RadioFieldScope;

    /**
     * All RadioField $scopes in this group.
     */
    scopes:Array<RadioFieldScope>;
  }

  var $sce_:ng.ISCEService;
  var $log_:ng.ILogService;
  var fieldHelper_:FieldHelper;

  /**
   * Renders a radio &lt;input&gt; with optional label.
   * This type of component is well-suited for small enumerations.
   *
   * @example
   * // To render a radio group for gender selection you might use the following markup:
   * <radio-field label="Female" attribute="gender" value="f"></radio-field>
   * <radio-field label="Male" attribute="gender" value="m"></radio-field>
   *
   * @param $sce $injector-supplied $sce service
   * @param $log $injector-supplied $log service
   * @param FormForConfiguration
   */
  export class RadioFieldDirective implements ng.IDirective {

    require:string = '^formFor';
    restrict:string = 'EA';
    templateUrl:string = ($element, $attributes) => {
        return $attributes['template'] || 'form-for/templates/radio-field.html';
    };

    scope:any = {
      attribute: '@',
      disable: '=',
      help: '@?',
      options: '=',
      value: '@'
    };

    /* @ngInject */
    constructor($sce:ng.ISCEService, $log:ng.ILogService, FormForConfiguration) {
      fieldHelper_  = new FieldHelper(FormForConfiguration);
      $sce_ = $sce;
      $log_ = $log;
    }

    /* @ngInject */
    link($scope:RadioFieldScope, $element:ng.IAugmentedJQuery, $attributes:ng.IAttributes, formForController:FormForController):void {
      if (!$scope.attribute) {
        $log_.error('Missing required field "attribute"');

        return;
      }

      // Read from $attributes to avoid getting any interference from $scope.
      $scope.labelAttribute = $attributes['labelAttribute'] || 'label';
      $scope.valueAttribute = $attributes['valueAttribute'] || 'value';

      fieldHelper_.manageFieldRegistration($scope, $attributes, formForController);

      // Everything inside of  $scope.model pertains to the first <input type="radio"> for this attribute/name.
      // In order for our view's aria-* and label-for tags to function properly, we need a unique uid for this instance.
      $scope.uid = $attributes['uid'] || FormForGUID.create();

      fieldHelper_.manageLabel($scope, $attributes, true);

      $scope.tabIndex = $attributes['tabIndex'] || 0;

      $scope.click = () => {
        if (!$scope.disable && !$scope.model.disabled) {
          //$scope.model.bindable = $scope.value;
        }
      };

      $scope.$watch('options', (options) => {
        options.forEach((option) => {
          if (!angular.isObject(option[$scope.labelAttribute]))
            option[$scope.labelAttribute] = $sce_.trustAsHtml(option[$scope.labelAttribute]);
        });
      }, true);
      $scope.$watch('model', (value) => {
        $scope.model = value;
      });
      $scope.$watch('disable', (value) => {
        $scope.disable = value;
      });
      $scope.$watch('model.disabled', (value) => {
        if ($scope.model) {
          $scope.model.disabled = value;
        }
      });

      /**
       * Update this RadioField (UI) whenever the group's value changes.
       * This could be triggered by another RadioField in the group.
      $scope.$watch('model.bindable', function(newValue:any) {
        $scope.checked =
          newValue !== undefined &&
          newValue !== null &&
          newValue.toString() === $scope.value.toString();
      });
       */
    }
  }

  angular.module('formFor').directive('radioField',
    ($sce, $log, FormForConfiguration) => {
      return new RadioFieldDirective($sce, $log, FormForConfiguration);
    });
}
/// <reference path="../services/field-helper.ts" />

module formFor {

  /**
   * SelectField $scope.
   */
  interface SelectFieldScope extends ng.IScope {

    /**
     * Allow an empty/blank option in the <select>.
     * Note that this is a display setting only and is not related to form validation.
     * (Fields with blank options may still be required.)
     */
    allowBlank:boolean;

    /**
     * Name of the attribute within the parent form-for directive's model object.
     * This attributes specifies the data-binding target for the input.
     * Dot notation (ex "address.street") is supported.
     */
    attribute:string;

    /**
     * Set of options the directive template should bind to.
     * This set contains all of the "options" as well as an empty/placeholder option under certain conditions.
     */
    bindableOptions:Array<Object>;

    /**
     * Views must call this callback to notify of the <select> menu having been closed.
     */
    close:Function;

    /**
     * Disable input element.
     * Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute.
     * This attribute defaults to 'auto' which means that the menu will drop up or down based on its position within the viewport.
     */
    disable:boolean;

    /**
     * Empty option created if select menu allows empty selection.
     */
    emptyOption:any;

    /**
     * Optional help tooltip to display on hover.
     * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
     */
    help?:string;

    /**
     * Select menu is currently open.
     */
    isOpen:boolean;

    /**
     * Key-down event handler to be called by view template.
     */
    keyDown:(event:any) => void;

    /**
     * Optional field label displayed before the drop-down.
     * (Although not required, it is strongly suggested that you specify a value for this attribute.) HTML is allowed for this attribute.
     */
    label?:string;

    /**
     * Optional override for label key in options array.
     * Defaults to "label".
     */
    labelAttribute?:string;

    /**
     * Optional class-name for field <label>.
     */
    labelClass?:string;

    /**
     * Shared between formFor and SelectField directives.
     */
    model:BindableFieldWrapper;

    /**
     * Updates mouse-over index.
     * Called in response to arrow-key navigation of select menu options.
     */
    mouseOver:(index:number) => void;

    /**
     * Moused-over option.
     */
    mouseOverOption:any;

    /**
     * Index of moused-over option.
     */
    mouseOverIndex:number;

    /**
     * Drop-down list should allow multiple selections.
     */
    multiple?:boolean;

    /**
     * Views must call this callback to notify of the <select> menu having been opened.
     */
    open:Function;

    /**
     * Set of options, each containing a label and value key.
     * The label is displayed to the user and the value is assigned to the corresponding model attribute on selection.
     */
    options:Array<Object>;

    /**
     * Optional placeholder text to display if no value has been selected.
     * The text "Select" will be displayed if no placeholder is provided.
     */
    placeholder?:string;

    /**
     * Optional attribute to override default selection of the first list option.
     * Without this attribute, lists with `allow-blank` will default select the first option in the options array.
     */
    preventDefaultOption:boolean;

    /**
     * Used to share data between main select-field template and ngIncluded templates.
     */
    scopeBuster:any;

    /**
     * Selects the specified option.
     */
    selectOption:(option:any) => void;

    /**
     * Optional custom tab index for input; by default this is 0 (tab order chosen by the browser)
     */
    tabIndex?:number;

    /**
     * Optional ID to assign to the inner <input type="checkbox"> element;
     * A unique ID will be auto-generated if no value is provided.
     */
    uid?:string;

    /**
     * Optional override for value key in options array.
     * Defaults to "value".
     */
    valueAttribute:string;
  }

  var MIN_TIMEOUT_INTERVAL:number = 10;

  var $document_:ng.IAugmentedJQuery;
  var $log_:ng.ILogService;
  var $timeout_:ng.ITimeoutService;
  var fieldHelper_:FieldHelper;
  var formForConfiguration_:FormForConfiguration;

  /**
   * Renders a drop-down &lt;select&gt; menu along with an input label.
   * This type of component works with large enumerations and can be configured to allow for a blank/empty selection
   * by way of an allow-blank attribute.
   *
   * The following HTML attributes are supported by this directive:
   * <ul>
   * <li>allow-blank: The presence of this attribute indicates that an empty/blank selection should be allowed.
   * <li>prevent-default-option: Optional attribute to override default selection of the first list option.
   *       Without this attribute, lists with `allow-blank` will default select the first option in the options array.
   *</ul>
   *
   * @example
   * // To use this component you'll first need to define a set of options. For instance:
   * $scope.genders = [
   *   { value: 'f', label: 'Female' },
   *   { value: 'm', label: 'Male' }
   * ];
   *
   * // To render a drop-down input using the above options:
   * <select-field attribute="gender"
   *               label="Gender"
   *               options="genders">
   * </select-field>
   *
   * // If you want to make this attribute optional you can use the allow-blank attribute as follows:
   * <select-field attribute="gender"
   *               label="Gender"
   *               options="genders"
   *               allow-blank>
   * </select-field>
   *
   * @param $document $injector-supplied $document service
   * @param $log $injector-supplied $log service
   * @param $timeout $injector-supplied $timeout service
   * @param fieldHelper
   * @param formForConfiguration
   */
  export class SelectFieldDirective implements ng.IDirective {

    require:string = '^formFor';
    restrict:string = 'EA';
    templateUrl:string = ($element, $attributes) => {
        return $attributes['template'] || 'form-for/templates/select-field.html';
    };

    scope:any = {
      attribute: '@',
      disable: '=',
      help: '@?',
      multiple: '=?',
      options: '='
    };

    /* @ngInject */
    constructor($document:ng.IAugmentedJQuery,
                $log:ng.ILogService,
                $timeout:ng.ITimeoutService,
                fieldHelper:FieldHelper,
                formForConfiguration:FormForConfiguration) {
      $document_ = $document;
      $log_ = $log;
      $timeout_ = $timeout;
      fieldHelper_ = fieldHelper;
      formForConfiguration_ = formForConfiguration;
    }

    /* @ngInject */
    link($scope:SelectFieldScope,
         $element:ng.IAugmentedJQuery,
         $attributes:ng.IAttributes,
         formForController:FormForController):void {

      if (!$scope.attribute) {
        $log_.error('Missing required field "attribute"');

        return;
      }

      $scope.allowBlank = $attributes.hasOwnProperty('allowBlank');
      $scope.preventDefaultOption = $attributes.hasOwnProperty('preventDefaultOption');

      // Read from $attributes to avoid getting any interference from $scope.
      $scope.labelAttribute = $attributes['labelAttribute'] || 'label';
      $scope.valueAttribute = $attributes['valueAttribute'] || 'value';
      $scope.placeholder = $attributes.hasOwnProperty('placeholder') ? $attributes['placeholder'] : 'Select';
      $scope.tabIndex = $attributes['tabIndex'] || 0;

      $scope.scopeBuster = {};

      fieldHelper_.manageLabel($scope, $attributes, false);
      fieldHelper_.manageFieldRegistration($scope, $attributes, formForController);

      $scope.close = () => {
        $timeout_(() => {
          $scope.isOpen = false;
        });
      };

      $scope.open = () => {
        if ($scope.disable || $scope.model.disabled) {
          return;
        }

        $timeout_(() => {
          $scope.isOpen = true;
        });
      };

      $scope.bindableOptions = [];

      $scope.emptyOption = {};
      $scope.emptyOption[$scope.labelAttribute] = $scope.placeholder;
      $scope.emptyOption[$scope.valueAttribute] = formForConfiguration_.defaultSelectEmptyOptionValue;

      /*****************************************************************************************
       * The following code manages setting the correct default value based on bindable model.
       *****************************************************************************************/

      $scope.selectOption = (option:any) => {
        $scope.model.bindable = option && option[$scope.valueAttribute];
      };

      var updateDefaultOption:(value?:any) => any = () => {
        var numOptions:number = $scope.options && $scope.options.length;

        // Default select the first item in the list
        // Do not do this if a blank option is allowed OR if the user has explicitly disabled this function
        if (!$scope.model.bindable && !$scope.allowBlank && !$scope.preventDefaultOption && numOptions) {
          $scope.selectOption($scope.options[0]);
        }

        // Certain falsy values may indicate a non-selection.
        // In this case, the placeholder (empty) option needs to match the falsy selected value,
        // Otherwise the Angular select directive will generate an additional empty <option> ~ see #110
        // Angular 1.2.x-1.3.x may generate an empty <option> regardless, unless the non-selection is undefined.
        if ($scope.model.bindable === null ||
            $scope.model.bindable === undefined ||
            $scope.model.bindable === '') {

          // Rather than sanitizing `$scope.model.bindable` to undefined, update the empty option's value.
          // This way users are able to choose between undefined, null, and empty string ~ see #141
          $scope.model.bindable = formForConfiguration_.defaultSelectEmptyOptionValue;
          $scope.emptyOption[$scope.valueAttribute] = $scope.model.bindable;
        }

        $scope.bindableOptions.splice(0);

        if (!$scope.model.bindable || $scope.allowBlank) {
          $scope.bindableOptions.push($scope.emptyOption);
        }

        $scope.bindableOptions.push.apply($scope.bindableOptions, $scope.options);

        // Once a value has been selected, clear the placeholder prompt.
        if ($scope.model.bindable) {
          $scope.emptyOption[$scope.labelAttribute] = '';
        }
      };

      // Allow the current $digest cycle (if we're in one) to complete so that the FormForController has a chance to set
      // the bindable model attribute to that of the external formData field. This way we won't overwrite the default
      // value with one of our own.
      $timeout_(() => {
        $scope.$watch('model.bindable', updateDefaultOption);
        $scope.$watch('options.length', updateDefaultOption);
      });

      /*****************************************************************************************
       * The following code deals with toggling/collapsing the drop-down and selecting values.
       *****************************************************************************************/

      var documentClick = (event) => {
        $scope.close();
      };

      var pendingTimeoutId:ng.IPromise<any>;

      $scope.$watch('isOpen', () => {
        if (pendingTimeoutId) {
          $timeout_.cancel(pendingTimeoutId);
        }
        pendingTimeoutId = $timeout_(() => {
          pendingTimeoutId = null;

          if ($scope.isOpen) {
            $document_.on('click', documentClick);
          } else {
            $document_.off('click', documentClick);
          }
        }, MIN_TIMEOUT_INTERVAL);
      });

      $scope.$on('$destroy', () => {
        $document_.off('click', documentClick);
      });

      /*****************************************************************************************
       * The following code responds to keyboard events when the drop-down is visible
       *****************************************************************************************/

      $scope.mouseOver = (index:number) => {
        $scope.mouseOverIndex = index;
        $scope.mouseOverOption = index >= 0 ? $scope.options[index] : null;
      };

      // Listen to key down, not up, because ENTER key sometimes gets converted into a click event.
      $scope.keyDown = (event:KeyboardEvent) => {
        switch (event.keyCode) {
          case 27: // Escape key
            $scope.close();
            break;
          case 13: // Enter key
            if ($scope.isOpen) {
              $scope.selectOption($scope.mouseOverOption);
              $scope.close();
            } else {
              $scope.open();
            }

            event.preventDefault();
            break;
          case 38: // Up arrow
            if ($scope.isOpen) {
              $scope.mouseOver( $scope.mouseOverIndex > 0 ? $scope.mouseOverIndex - 1 : $scope.options.length - 1 );
            } else {
              $scope.open();
            }
            break;
          case 40: // Down arrow
            if ($scope.isOpen) {
              $scope.mouseOver( $scope.mouseOverIndex < $scope.options.length - 1 ? $scope.mouseOverIndex + 1 : 0 );
            } else {
              $scope.open();
            }
            break;
          case 9: // Tabbing (in or out) should close the menu.
          case 16:
            $scope.close();
            break;
          default: // But all other key events should (they potentially indicate a changed type-ahead filter value).
            $scope.open();
            break;
        }
      };
    }
  }

  angular.module('formFor').directive('selectField',
    ($document, $log, $timeout, FieldHelper, FormForConfiguration) => {
      return new SelectFieldDirective($document, $log, $timeout, FieldHelper, FormForConfiguration);
    });
}
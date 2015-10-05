/// <reference path="../services/field-helper.ts" />

module formFor {

  /**
   * SelectField $scope.
   */
  interface TypeAheadFieldScope extends ng.IScope {

    /**
     * Name of the attribute within the parent form-for directive's model object.
     * This attributes specifies the data-binding target for the input.
     * Dot notation (ex "address.street") is supported.
     */
    attribute:string;

    /**
     * Views must call this callback to notify of the <select> menu having been closed.
     */
    close:Function;

    /**
     * Debounce duration (in ms) before filter text is applied to options.
     */
    debounce?:number;

    /**
     * Disable input element.
     * Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute.
     * This attribute defaults to 'auto' which means that the menu will drop up or down based on its position within the viewport.
     */
    disable:boolean;

    /**
     * Two-way bindable filter string.
     * $watch this property to load remote options based on filter text.
     * (Refer to the documentation for coding examples.)
     */
    filter?:string;

    /**
     * Visible options, shown after filtering.
     */
    filteredOptions:Array<any>;

    /**
     * Optional function to be invoked when the filter text has changed.
     * Use this function to implement server-side filtering.
     */
    filterTextChanged?:(data:{[text:string]:string}) => void;

    /**
     * Callback to apply filtered text.
     */
    filterTextClick:Function;

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
     * Shared between formFor and TypeAheadField directives.
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
     * Views must call this callback to notify of the <select> menu having been opened.
     */
    open:Function;

    /**
     * Set of options, each containing a label and value key.
     * The label is displayed to the user and the value is assigned to the corresponding model attribute on selection.
     */
    options:Array<Object>;

    /**
     * Optional placeholder text to display if no value has been selected and no filter text has been entered.
     */
    placeholder?:string;

    /**
     * Used to share data between main select-field template and ngIncluded templates.
     */
    scopeBuster:any;

    searchTextChange?:(text:string) => void;

    /**
     * Selects the specified option.
     */
    selectOption:(option:any) => void;

    /**
     * Sets focus on filter field after a small delay.
     * Can be used to auto-focus on filter field when select menu has been opened.
     */
    setFilterFocus:Function;

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

  /**
   * Renders an &lt;input type="text"&gt; component with type-ahead functionality.
   * This type of component works with a large set of options that can be loaded asynchronously if needed.
   *
   * @example
   * // To use this component you'll first need to define a set of options. For instance:
   * $scope.genders = [
   *   { value: 'f', label: 'Female' },
   *   { value: 'm', label: 'Male' }
   * ];
   *
   * // To render a drop-down input using the above options:
   * <type-ahead-field attribute="gender"
   *                   label="Gender"
   *                   options="genders">
   * </type-ahead-field>
   *
   * @param $document $injector-supplied $document service
   * @param $log $injector-supplied $log service
   * @param $timeout $injector-supplied $timeout service
   * @param fieldHelper
   */
  export class TypeAheadFieldDirective implements ng.IDirective {

    require:string = '^formFor';
    restrict:string = 'EA';
    templateUrl:string = ($element, $attributes) => {
        return $attributes['template'] || 'form-for/templates/type-ahead-field.html';
    };

    scope:any = {
      attribute: '@',
      debounce: '@?',
      disable: '=',
      filterDebounce: '@?',
      filterTextChanged: '&?',
      help: '@?',
      options: '='
    };

    /* @ngInject */
    constructor($document:ng.IAugmentedJQuery,
                $log:ng.ILogService,
                $timeout:ng.ITimeoutService,
                fieldHelper:FieldHelper) {
      $document_ = $document;
      $log_ = $log;
      $timeout_ = $timeout;
      fieldHelper_ = fieldHelper;
    }

    /* @ngInject */
    link($scope:TypeAheadFieldScope,
         $element:ng.IAugmentedJQuery,
         $attributes:ng.IAttributes,
         formForController:FormForController):void {

      if (!$scope.attribute) {
        $log_.error('Missing required field "attribute"');

        return;
      }

      // Read from $attributes to avoid getting any interference from $scope.
      $scope.labelAttribute = $attributes['labelAttribute'] || 'label';
      $scope.valueAttribute = $attributes['valueAttribute'] || 'value';
      $scope.placeholder = $attributes.hasOwnProperty('placeholder') ? $attributes['placeholder'] : 'Select';
      $scope.tabIndex = $attributes['tabIndex'] || 0;

      $scope.scopeBuster = {
        filter: ''
      };

      fieldHelper_.manageLabel($scope, $attributes, false);
      fieldHelper_.manageFieldRegistration($scope, $attributes, formForController);

      /*****************************************************************************************
       * The following code pertains to opening and closing the filter.
       *****************************************************************************************/

      var filterText:HTMLElement;

      // Helper method for setting focus on an item after a delay
      var setDelayedFilterTextFocus:Function = () => {
        if (!filterText) { // Null when link is first run because of ng-include
          var filterTextSelector:ng.IAugmentedJQuery = $element.find('input');

          if (filterTextSelector.length) {
            filterText = filterTextSelector[0];
          }
        }

        if (filterText) {
          $timeout_(filterText.focus.bind(filterText));
        }
      };

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

      /*****************************************************************************************
       * The following code pertains to filtering visible options.
       *****************************************************************************************/

      $scope.filteredOptions = [];

      // Sanitizes option and filter-text values for comparison
      var sanitize:(value:string) => string =
        (value) => {
          return typeof value === "string" ? value.toLowerCase() : '';
        };

      // Updates visible <option>s based on current filter text
      var calculateFilteredOptions = () => {
        var options:Array<any> = $scope.options || [];

        $scope.filteredOptions.splice(0);

        if (!$scope.scopeBuster.filter) {
          angular.copy(options, $scope.filteredOptions);
        } else {
          var filter:string = sanitize($scope.scopeBuster.filter);

          angular.forEach(options, (option) => {
            var index:number = sanitize(option[$scope.labelAttribute]).indexOf(filter);

            if (index >= 0) {
              $scope.filteredOptions.push(option);
            }
          });
        }
      };

      $scope.searchTextChange = (text:string) => {
        // No-op required by Angular Material
      };

      $scope.$watch('scopeBuster.filter', calculateFilteredOptions);
      $scope.$watch('options.length', calculateFilteredOptions);

      /*****************************************************************************************
       * The following code deals with toggling/collapsing the drop-down and selecting values.
       *****************************************************************************************/

      var documentClick = (event) => {
        // See filterTextClick() for why we check this property.
        if (event.ignoreFor === $scope.model.uid) {
          return;
        }

        $scope.close();
      };

      $scope.filterTextClick = (event) => {
        // We can't stop the event from propagating or we might prevent other inputs from closing on blur.
        // But we can't let it proceed as normal or it may result in the $document click handler closing a newly-opened input.
        // Instead we tag it for this particular instance of <select-field> to ignore.
        if ($scope.isOpen) {
          event.ignoreFor = $scope.model.uid;
        }
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

      $scope.setFilterFocus = () => {
        setDelayedFilterTextFocus();
      };

      $scope.mouseOver = (index:number) => {
        $scope.mouseOverIndex = index;
        $scope.mouseOverOption = index >= 0 ? $scope.filteredOptions[index] : null;
      };

      $scope.selectOption = (option:any) => {
        $scope.model.bindable = option && option[$scope.valueAttribute];
        $scope.scopeBuster.filter = option && option[$scope.labelAttribute];
      };

      var syncFilterText = function() {
        if ($scope.model.bindable && $scope.options) {
          $scope.options.forEach((option:any) => {
            if ($scope.model.bindable === option[$scope.valueAttribute]) {
              $scope.scopeBuster.filter = option[$scope.labelAttribute];
            }
          });
        }
      };

      $scope.$watch('model.bindable', syncFilterText);
      $scope.$watch('options.length', syncFilterText);

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
              $scope.mouseOver( $scope.mouseOverIndex > 0 ? $scope.mouseOverIndex - 1 : $scope.filteredOptions.length - 1 );
            } else {
              $scope.open();
            }
            break;
          case 40: // Down arrow
            if ($scope.isOpen) {
              $scope.mouseOver( $scope.mouseOverIndex < $scope.filteredOptions.length - 1 ? $scope.mouseOverIndex + 1 : 0 );
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

      $scope.$watchCollection('[isOpen, filteredOptions.length]', () => {
        // Reset hover anytime our list opens/closes or our collection is refreshed.
        $scope.mouseOver(-1);

        // Pass focus through to filter field when the type-ahead is opened
        if ($scope.isOpen) {
          setDelayedFilterTextFocus();
        }
      });

      if ($scope.filterTextChanged instanceof Function) {
        $scope.$watch('scopeBuster.filter', (text) => {
          $scope.filterTextChanged({text: text});
        });
      }
    }
  }

  angular.module('formFor').directive('typeAheadField',
    ($document, $log, $timeout, FieldHelper) => {
      return new TypeAheadFieldDirective($document, $log, $timeout, FieldHelper);
    });
}
/**
 * @ngdoc Directives
 * @name select-field
 * @description
 * Renders a drop-down &lt;select&gt; menu along with an input label.
 * This type of component works with large enumerations and can be configured to allow for a blank/empty selection by way of an allow-blank attribute.
 *
 * @param {attribute} allow-blank The presence of this attribute indicates that an empty/blank selection should be allowed.
 * @param {String} attribute Name of the attribute within the parent form-for directive's model object.
 * This attributes specifies the data-binding target for the input.
 * Dot notation (ex "address.street") is supported.
 * @param {Boolean} disable Disable input element.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * This attribute defaults to 'auto' which means that the menu will drop up or down based on its position within the viewport.
 * @param {Boolean} enableFiltering Enable filtering of list via a text input at the top of the dropdown.
 * @param {String} filter Two-way bindable filter string.
 * $watch this property to load remote options based on filter text.
 * (Refer to this Plunker demo for an example.)
 * @param {String} help Optional help tooltip to display on hover.
 * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} label Optional field label displayed before the drop-down.
 * (Although not required, it is strongly suggested that you specify a value for this attribute.) HTML is allowed for this attribute.
 * @param {String} labelAttribute Optional override for label key in options array.
 * Defaults to "label".
 * @param {Boolean} multiple Drop-down list should allow multiple selections.
 * @param {Array} options Set of options, each containing a label and value key.
 * The label is displayed to the user and the value is assigned to the corresponding model attribute on selection.
 * @param {String} placeholder Optional placeholder text to display if no value has been selected.
 * The text "Select" will be displayed if no placeholder is provided.
 * @param {attribute} prevent-default-option Optional attribute to override default selection of the first list option.
 * Without this attribute, lists with `allow-blank` will default select the first option in the options array.
 * @param {int} tabIndex Optional custom tab index for input; by default this is 0 (tab order chosen by the browser)
 * @param {String} uid Optional ID to assign to the inner <input type="checkbox"> element;
 * A unique ID will be auto-generated if no value is provided.
 * @param {String} valueAttribute Optional override for value key in options array.
 * Defaults to "value".
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
 */
angular.module('formFor').directive('selectField',
  function($document, $log, $timeout, $window, FieldHelper) {
    var MIN_TIMEOUT_INTERVAL = 10;

    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/select-field.html',
      scope: {
        attribute: '@',
        disable: '=',
        filter: '=?',
        filterDebounce: '@?',
        help: '@?',
        multiple: '=?',
        options: '='
      },
      link: function($scope, $element, $attributes, formForController) {
        $window = angular.element($window);

        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.allowBlank = $attributes.hasOwnProperty('allowBlank');
        $scope.enableFiltering = $attributes.hasOwnProperty('enableFiltering');
        $scope.preventDefaultOption = $attributes.hasOwnProperty('preventDefaultOption');

        $scope.labelAttribute = $attributes.labelAttribute || 'label';
        $scope.valueAttribute = $attributes.valueAttribute || 'value';
        $scope.placeholder = $attributes.placeholder || 'Select';
        $scope.tabIndex = $attributes.tabIndex || 0;

        FieldHelper.manageLabel($scope, $attributes);
        FieldHelper.manageFieldRegistration($scope, $attributes, formForController);

        // Helper method for setting focus on an item after a delay
        var setDelayedFocus = function($target) {
          var target = $target[0];

          $timeout(target.focus.bind(target));
        };

        $scope.close = function() {
          $timeout(function() {
            $scope.isOpen = false;
          });
        };

        $scope.open = function() {
          if ($scope.disable || $scope.model.disabled) {
            return;
          }

          $timeout(function() {
            $scope.isOpen = true;
          });
        };

        /*****************************************************************************************
         * The following code pertains to filtering visible options.
         *****************************************************************************************/

        $scope.emptyOption = {};
        $scope.emptyOption[$scope.labelAttribute] = '';
        $scope.emptyOption[$scope.valueAttribute] = undefined;

        $scope.placeholderOption = {};
        $scope.placeholderOption[$scope.labelAttribute] = $scope.placeholder;
        $scope.placeholderOption[$scope.valueAttribute] = undefined;

        $scope.filteredOptions = [];

        var sanitize = function(value) {
          return value && value.toLowerCase();
        };

        var calculateFilteredOptions = function() {
          var options = $scope.options || [];

          $scope.filteredOptions.splice(0);

          if (!$scope.enableFiltering || !$scope.filter) {
            angular.copy(options, $scope.filteredOptions);
          } else {
            var filter = sanitize($scope.filter);

            angular.forEach(options, function(option) {
              var index = sanitize(option[$scope.labelAttribute]).indexOf(filter);

              if (index >= 0) {
                $scope.filteredOptions.push(option);
              }
            });
          }

          if (!$scope.selectedOption && !$scope.multiple) {
            $scope.filteredOptions.unshift($scope.placeholderOption);
          } else if ($scope.allowBlank) {
            $scope.filteredOptions.unshift($scope.emptyOption);
          }
        };

        $scope.$watch('filter', calculateFilteredOptions);
        $scope.$watch('options.length', calculateFilteredOptions);

        /*****************************************************************************************
         * The following code manages setting the correct default value based on bindable model.
         *****************************************************************************************/

        var updateDefaultOption = function() {
          var selected = $scope.selectedOption && $scope.selectedOption[[$scope.valueAttribute]];
          var matchingOption;

          if ($scope.model.bindable === selected) {

            // Default select the first item in the list
            // Do not do this if a blank option is allowed OR if the user has explicitly disabled this function
            if (!$scope.allowBlank && !$scope.preventDefaultOption && $scope.options && $scope.options.length) {
              $scope.model.bindable = $scope.options[0][$scope.valueAttribute];
            }

            return;
          }
        };

        $scope.$watch('model.bindable', updateDefaultOption);
        $scope.$watch('options.length', updateDefaultOption);

        /*****************************************************************************************
         * The following code deals with toggling/collapsing the drop-down and selecting values.
         *****************************************************************************************/

        $scope.$watch('model.bindable', function(value) {
          var matchingOption;

          angular.forEach($scope.options,
            function(option) {
              if (option[$scope.valueAttribute] === $scope.model.bindable) {
                matchingOption = option;
              }
            });

          $scope.selectedOption = matchingOption;
          $scope.selectedOptionLabel = matchingOption && matchingOption[$scope.labelAttribute];

          // Make sure our filtered text reflects the currently selected label (important for Bootstrap styles).
          $scope.filter = $scope.selectedOptionLabel;
        });

        var documentClick = function(event) {
          // See filterTextClick() for why we check this property.
          if (event.ignoreFor === $scope.model.uid) {
            return;
          }

          $scope.close();
        };

        $scope.filterTextClick = function() {
          // We can't stop the event from propagating or we might prevent other inputs from closing on blur.
          // But we can't let it proceed as normal or it may result in the $document click handler closing a newly-opened input.
          // Instead we tag it for this particular instance of <select-field> to ignore.
          if ($scope.isOpen) {
            event.ignoreFor = $scope.model.uid;
          }
        };

        var pendingTimeout;

        $scope.$watch('isOpen', function(value) {
          if (pendingTimeout) {
            $timeout.cancel(pendingTimeout);
          }
          pendingTimeout = $timeout(function() {
            pendingTimeout = null;

            if ($scope.isOpen) {
              $document.on('click', documentClick);
            } else {
              $document.off('click', documentClick);
            }
          }, MIN_TIMEOUT_INTERVAL);
        });

        $scope.$on('$destroy', function() {
          $document.off('click', documentClick);
        });

        /*****************************************************************************************
         * The following code responds to keyboard events when the drop-down is visible
         *****************************************************************************************/

        var filterText = $element.find('input');

        $scope.setFilterFocus = function() {
          setDelayedFocus(filterText);
        };

        $scope.mouseOver = function(index) {
          $scope.mouseOverIndex = index;
          $scope.mouseOverOption = index >= 0 ? $scope.filteredOptions[index] : null;
        };

        $scope.selectOption = function(option) {
          $scope.model.bindable = option && option[$scope.valueAttribute];
        };

        // Listen to key down, not up, because ENTER key sometimes gets converted into a click event.
        $scope.keyDown = function(event) {
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

        $scope.$watchCollection('[isOpen, filteredOptions.length]', function() {
          // Reset hover anytime our list opens/closes or our collection is refreshed.
          $scope.mouseOver(-1);

          // Pass focus through to filter field when select is opened
          if ($scope.isOpen && $scope.enableFiltering) {
            setDelayedFocus(filterText);
          }
        });
      }
    };
  });

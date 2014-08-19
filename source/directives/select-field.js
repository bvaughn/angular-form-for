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
 * @param {Array} options Set of options, each containing a label and value key.
 * The label is displayed to the user and the value is assigned to the corresponding model attribute on selection.
 * @param {String} placeholder Optional placeholder text to display if no value has been selected.
 * The text "Select" will be displayed if no placeholder is provided.
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
  function($document, $log, $timeout, FieldHelper) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/select-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        filter: '=?',
        filterDebounce: '@?',
        help: '@?',
        options: '=',
        placeholder: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.allowBlank = $attributes.hasOwnProperty('allowBlank');
        $scope.enableFiltering = $attributes.hasOwnProperty('enableFiltering');

        $scope.labelAttribute = $attributes.labelAttribute || 'label';
        $scope.valueAttribute = $attributes.valueAttribute || 'value';

        $scope.model = formForController.registerFormField($scope.attribute);
        $scope.label = FieldHelper.getLabel($attributes, $scope.attribute);

        /*****************************************************************************************
         * The following code pertains to filtering visible options.
         *****************************************************************************************/

        $scope.emptyOption = {};
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

          if ($scope.allowBlank) {
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
            return;
          }

          angular.forEach($scope.options,
            function(option) {
              if (option[$scope.valueAttribute] === $scope.model.bindable) {
                matchingOption = option;
              }
            });

          $scope.selectedOption = matchingOption;
          $scope.selectedOptionLabel = matchingOption && matchingOption[$scope.labelAttribute];
        };

        $scope.$watch('model.bindable', updateDefaultOption);
        $scope.$watch('options', updateDefaultOption);

        /*****************************************************************************************
         * The following code deals with toggling/collapsing the drop-down and selecting values.
         *****************************************************************************************/

        $scope.$watch('model.bindable', function(value) {
          var matchingOption;

          for (var index = 0; index < $scope.filteredOptions.length; index++) {
            var option = $scope.filteredOptions[index];

            if (option[$scope.valueAttribute] === value) {
              matchingOption = option;

              break;
            }
          };

          $scope.selectedOption = matchingOption;
          $scope.selectedOptionLabel = matchingOption && matchingOption[$scope.labelAttribute];
        });

        var oneClick = function(target, handler) {
          $timeout(function() { // Delay to avoid processing the same click event that trigger the toggle-open
            target.one('click', handler);
          }, 1);
        };

        var removeClickWatch = function() {
          $document.off('click', clickWatcher);
        };

        var addClickToOpen = function() {
          oneClick($element.find('.select-field-toggle-button'), clickToOpen);
        };

        $scope.selectOption = function(option) {
          $scope.model.bindable = option && option[$scope.valueAttribute];
          $scope.isOpen = false;

          removeClickWatch();

          addClickToOpen();
        };

        var clickWatcher = function(event) {
          $scope.isOpen = false;
          $scope.$apply();

          removeClickWatch();

          addClickToOpen();
        };

        var scroller = $element.find('.list-group-container');
        var list = $element.find('.list-group');

        var clickToOpen = function() {
          if ($scope.disable || $scope.model.disabled) {
            addClickToOpen();

            return;
          }

          $scope.isOpen = !$scope.isOpen;

          if ($scope.isOpen) {
            // TODO Determine whether to open downward or upward
            // TODO Auto-focus input field if filterable

            oneClick($document, clickWatcher);

            var value = $scope.model.bindable;

            $timeout(
              angular.bind(
                this,
                function() {
                  var listItems = list.find('.list-group-item');
                  var matchingListItem;

                  for (var index = 0; index < listItems.length; index++) {
                    var listItem = listItems[index];
                    var option = $(listItem).scope().option;

                    if (option && option[$scope.valueAttribute] === value) {
                      matchingListItem = listItem;

                      break;
                    }
                  }

                  if (matchingListItem) {
                    scroller.scrollTop(
                      $(matchingListItem).offset().top - $(matchingListItem).parent().offset().top);
                  }
                }), 1);
          }
        };

        addClickToOpen();

        /*****************************************************************************************
         * The following code responds to keyboard events when the drop-down is visible
         *****************************************************************************************/

        $scope.mouseOver = function(index) {
          $scope.mouseOverIndex = index;
          $scope.mouseOverOption = index >= 0 ? $scope.filteredOptions[index] : null;
        };

        // Listen to key down, not up, because ENTER key sometimes gets converted into a click event.
        $scope.keyDown = function(event) {
          switch (event.keyCode) {
            case 27: // Escape key
              $scope.isOpen = false;
              break;
            case 13: // Enter key
              $scope.selectOption($scope.mouseOverOption);
              $scope.isOpen = false;

              // Don't bubble up and submit the parent form
              event.preventDefault();
              event.stopPropagation();
              break;
            case 38: // Up arrow
              $scope.mouseOver( $scope.mouseOverIndex > 0 ? $scope.mouseOverIndex - 1 : $scope.filteredOptions.length - 1 );
              break;
            case 40: // Down arrow
              $scope.mouseOver( $scope.mouseOverIndex < $scope.filteredOptions.length - 1 ? $scope.mouseOverIndex + 1 : 0 );
              break;
          }
        };

        $scope.$watchCollection('[isOpen, filteredOptions.length]', function() {
          $scope.mouseOver(-1); // Reset hover anytime our list opens/closes or our collection is refreshed.
        });

        $scope.$on('$destroy', function() {
          removeClickWatch();

          formForController.unregisterFormField($scope.attribute);
        });
      }
    };
  });

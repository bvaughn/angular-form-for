/**
 * @ngdoc Directives
 * @name checkbox-field
 *
 * @description
 * Displays a HTML <input> element with type-ahead functionality.
 * This component requires the Angular Bootstrap library as a dependency.
 * This directive can be configured to optionally display an informational tooltip.
 * In the event of a validation error, this directive will also render an inline error message.
 *
 * @param {String} attribute Name of the attribute within the parent form-for directive's model object. This attributes specifies the data-binding target for the input. Dot notation (ex "address.street") is supported.
 * @param {attribute} autofocus The presence of this attribute will auto-focus the input field.
 * @param {int} debounce Debounce duration (in ms) before input text is applied to model and evaluated. To disable debounce (update only on blur) specify a value of false. This value's default is determined by FormForConfiguration.
 * @param {Boolean} disable Disable input element. (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * @param {String} filter Two-way bindable filter string. $watch this property to load remote options based on filter text. (Refer to this Plunker demo for an example.)
 * @param {String} help Optional help tooltip to display on hover. By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} label Optional field label displayed before the input. (Although not required, it is strongly suggested that you specify a value for this attribute.) HTML is allowed for this attribute.
 * @param {String} labelAttribute Optional override for label key in options array. Defaults to "label".
 * @param {Array} options Set of options, each containing a label and value key. The label is displayed to the user and the value is assigned to the corresponding model attribute on selection.
 * @param {String} placeholder Optional placeholder text to display if input is empty.
 * @param {String} valueAttribute Optional override for value key in options array. Defaults to "value".
 *
 * @example
 * // To render a type-ahead field that filters data specified via options:
 * <type-ahead-field label="State"
 *                   attribute="state"
 *                   options="states"
 *                   placeholder="Choose a state">
 * </type-ahead-field>
 *
 * // To reload remote data based on filter text, bind to the filter attribute as follows:
 * <type-ahead-field label="State"
 *                   attribute="state"
 *                   options="states"
 *                   placeholder="Choose a state"
 *                   filter="filterText">
 * </type-ahead-field>
 *
 * $scope.$watch('filterText', function(value) {
 *   // Load remote data and update $scope.states collection
 * });
 */
angular.module('formFor').directive('typeAheadField',
  function($log, $filter, $timeout, FieldHelper, FormForConfiguration) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/type-ahead-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        filter: '=?',
        help: '@?',
        options: '=',
        placeholder: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        if ($attributes.hasOwnProperty('autofocus')) {
          $timeout(function() {
            $element.find('input').focus();
          });
        }

        $scope.debounce = $attributes.debounce || FormForConfiguration.defaultDebounceDuration;
        $scope.labelAttribute = $attributes.labelAttribute || 'label';
        $scope.valueAttribute = $attributes.valueAttribute || 'value';

        // Typeahead doesn't handle null values very well so we need to guard against that.
        // See https://github.com/angular-ui/bootstrap/pull/2361
        $scope.filteredOptions = $scope.options || [];

        // Watch filter text changes and notify external listener in case data is loaded remotely.
        $scope.changeHandler = function() {
          $scope.filter = $element.find('input').val();
        };

        var updateFilteredOptions = function() {
          var array = $scope.options || [];

          var expression = {};
          expression[$scope.labelAttribute] = $scope.filter;

          $scope.filteredOptions = $filter('filter')(array, expression);
        };

        $scope.$watch('filter', updateFilteredOptions);
        $scope.$watch('options', updateFilteredOptions);

        $scope.model = formForController.registerFormField($scope.attribute);
        $scope.label = FieldHelper.getLabel($attributes, $scope.attribute);

        // Incoming model values should control the type-ahead field's default value.
        // In this case we need to match the model *value* with the corresponding option (Object).
        var updateDefaultOption = function() {
          var selected = $scope.model.selectedOption && $scope.model.selectedOption[[$scope.valueAttribute]];
          var matched;

          if ($scope.model.bindable === selected) {
            return;
          }

          angular.forEach($scope.options,
            function(option) {
              if (option[$scope.valueAttribute] === $scope.model.bindable) {
                matched = option;
              }
            });

          $scope.model.selectedOption = matched;
        };

        $scope.$watch('model.bindable', updateDefaultOption);
        $scope.$watch('options', updateDefaultOption);

        var initialized;

        // Type-ahead directive doesn't support "option[valueAttribute] as option[labelAttribute]" syntax,
        // So we have to massage the data into the correct format for our parent formFor.
        $scope.$watch('model.selectedOption', function(option, oldOption) {
          if (!initialized) {
            initialized = true;

            return;
          }

          $scope.model.bindable = option && option[$scope.valueAttribute];
        });

        $scope.$on('$destroy', function() {
          formForController.unregisterFormField($scope.attribute);
        });
      }
    };
  });

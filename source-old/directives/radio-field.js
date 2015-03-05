/**
 * @ngdoc Directives
 * @name radio-field
 *
 * @description
 * Renders a radio &lt;input&gt; with optional label.
 * This type of component is well-suited for small enumerations.
 *
 * @param {String} attribute Name of the attribute within the parent form-for directive's model object.
 * This attributes specifies the data-binding target for the input.
 * Dot notation (ex "address.street") is supported.
 * @param {Boolean} disable Disable input element.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * @param {String} help Optional help tooltip to display on hover.
 * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} label Optional field label displayed after the radio input.
 * (Although not required, it is strongly suggested that you specify a value for this attribute.)
 * HTML is allowed for this attribute
 * @param {int} tabIndex Optional custom tab index for input; by default this is 0 (tab order chosen by the browser)
 * @param {String} uid Optional ID to assign to the inner <input type="checkbox"> element;
 * A unique ID will be auto-generated if no value is provided.
 * @param {Object} value Value to be assigned to model if this radio component is selected.
 *
 * @example
 * // To render a radio group for gender selection you might use the following markup:
 * <radio-field label="Female" attribute="gender" value="f"></radio-field>
 * <radio-field label="Male" attribute="gender" value="m"></radio-field>
 */
angular.module('formFor').directive('radioField',
  function($log, $FormForGUID, FieldHelper) {
    var nameToActiveRadioMap = {};

    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/radio-field.html',
      scope: {
        attribute: '@',
        disable: '=',
        help: '@?',
        value: '@'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        if (!nameToActiveRadioMap[$scope.attribute]) {
          var mainRadioDatum = {
            defaultScope: $scope,
            scopes: []
          };

          FieldHelper.manageFieldRegistration($scope, $attributes, formForController);

          nameToActiveRadioMap[$scope.attribute] = mainRadioDatum;
        } else {
          // Only the primary <radio> input should show error message text
          $scope.hideErrorMessage = true;
        }

        // Everything inside of  $scope.model pertains to the first <input type="radio"> for this attribute/name.
        // In order for our view's aria-* and label-for tags to function properly, we need a unique uid for this instance.
        $scope.uid = $attributes.uid || $FormForGUID.create();

        var activeRadio = nameToActiveRadioMap[$scope.attribute];
        activeRadio.scopes.push($scope);

        FieldHelper.manageLabel($scope, $attributes, true);

        $scope.tabIndex = $attributes.tabIndex || 0;

        var $input = $element.find('input');

        $scope.click = function() {
          if (!$scope.disable && !$scope.model.disabled) {
            $scope.model.bindable = $scope.value;
          }
        };

        activeRadio.defaultScope.$watch('model', function(value) {
          $scope.model = value;
        });
        activeRadio.defaultScope.$watch('disable', function(value) {
          $scope.disable = value;
        });
        activeRadio.defaultScope.$watch('model.disabled', function(value) {
          if ($scope.model) {
            $scope.model.disabled = value;
          }
        });

        $scope.$watch('model.bindable', function(newValue, oldValue) {
          $scope.checked =
            newValue !== undefined &&
            newValue !== null &&
            $scope.value !== undefined &&
            $scope.value !== null &&
            newValue.toString() === $scope.value.toString();
        });

        $scope.$on('$destroy', function() {
          activeRadio.scopes.splice(
            activeRadio.scopes.indexOf($scope), 1);

          if (activeRadio.scopes.length === 0) {
            delete nameToActiveRadioMap[$scope.attribute];
          }
        });
      }
    };
  });

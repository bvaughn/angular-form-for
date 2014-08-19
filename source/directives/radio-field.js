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
 * @param {Object} Value to be assigned to model if this radio component is selected.
 *
 * @example
 * // To render a radio group for gender selection you might use the following markup:
 * <radio-field label="Female" attribute="gender" value="f"></radio-field>
 * <radio-field label="Male" attribute="gender" value="m"></radio-field>
 */
angular.module('formFor').directive('radioField',
  function($log, FieldHelper) {
    var nameToActiveRadioMap = {};

    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/radio-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        help: '@?',
        value: '@'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        if (!nameToActiveRadioMap[$scope.attribute]) {
          nameToActiveRadioMap[$scope.attribute] = {
            defaultScope: $scope,
            scopes: [],
            model: formForController.registerFormField($scope.attribute)
          };
        }

        // TODO How to handle errors?
        // Main scope should listen and bucket brigade to others!

        var activeRadio = nameToActiveRadioMap[$scope.attribute];
        activeRadio.scopes.push($scope);

        $scope.model = activeRadio.model;
        $scope.label = FieldHelper.getLabel($attributes, $scope.value);

        var $input = $element.find('input');

        $scope.click = function() {
          if (!$scope.disable && !$scope.model.disabled) {
            $scope.model.bindable = $scope.value;
          }
        };

        activeRadio.defaultScope.$watch('disable', function(value) {
          $scope.disable = value;
        });
        activeRadio.defaultScope.$watch('model.disabled', function(value) {
          $scope.model.disabled = value;
        });

        $scope.$watch('model.bindable', function(newValue, oldValue) {
          if (newValue === $scope.value) {
            $input.attr('checked', true);
          } else {
            $input.removeAttr('checked');
          }
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

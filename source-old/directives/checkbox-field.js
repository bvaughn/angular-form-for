/**
 * @ngdoc Directives
 * @name checkbox-field
 *
 * @description
 * Renders a checkbox &lt;input&gt; with optional label.
 * This type of component is well-suited for boolean attributes.
 *
 * @param {String} attribute Name of the attribute within the parent form-for directive's model object.
 * This attributes specifies the data-binding target for the input.
 * Dot notation (ex "address.street") is supported.
 * @param {Boolean} disable Disable input element.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * @param {String} help Optional help tooltip to display on hover.
 * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} label Optional field label displayed after the checkbox input.
 * (Although not required, it is strongly suggested that you specify a value for this attribute.) HTML is allowed for this attribute.
 * @param {int} tabIndex Optional custom tab index for input; by default this is 0 (tab order chosen by the browser)
 * @param {String} uid Optional ID to assign to the inner <input type="checkbox"> element;
 * A unique ID will be auto-generated if no value is provided.
 * @param {Function} changed Optional function to be invoked on checkbox change.
 *
 * @example
 * // To display a simple TOS checkbox you might use the following markup:
 * <checkbox-field label="I agree with the TOS"
 *                 attribute="accepted">
 * </checkbox-field>
 */
angular.module('formFor').directive('checkboxField',
  function($log, FieldHelper) {
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
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.tabIndex = $attributes.tabIndex || 0;

        var $input = $element.find('input');

        $scope.toggle = function toggle() {
          if (!$scope.disable && !$scope.model.disabled) {
            $scope.model.bindable = !$scope.model.bindable;
          }
        };

        FieldHelper.manageLabel($scope, $attributes);
        FieldHelper.manageFieldRegistration($scope, $attributes, formForController);
      }
    };
  });

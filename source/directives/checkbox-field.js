/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#checkboxfield
 */
angular.module('formFor').directive('checkboxField',
  function($log) {
    return {
      require: '^formFor',
      restrict: 'E',
      templateUrl: 'form-for/templates/checkbox-field.html',
      scope: {
        attribute: '@',
        disabled: '@',
        help: '@?',
        label: '@?',
        placeholder: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.model = formForController.registerFormField($scope, $scope.attribute);

        var $input = $element.find('input');

        $scope.toggle = function toggle() {
          if (!$scope.disabled) {
            $scope.model.bindable = !$scope.model.bindable;
          }
        };
      }
    };
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#textfield
 */
angular.module('formFor').directive('textField',
  function($log) {
    return {
      require: '^formFor',
      restrict: 'E',
      templateUrl: 'form-for/templates/text-field.html',
      scope: {
        attribute: '@',
        help: '@?',
        label: '@?',
        placeholder: '@?',
        type: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.inputType = $scope.type || 'text';

        $scope.model = formForController.registerFormField($scope, $scope.attribute);
      }
    };
  });

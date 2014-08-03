/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#submitbutton
 */
angular.module('formFor').directive('submitButton',
  function($log) {
    return {
      require: '^formFor',
      replace: true,
      restrict: 'E',
      templateUrl: 'form-for/templates/submit-button.html',
      scope: {
        disabled: '@',
        icon: '@',
        label: '@'
      },
      link: function($scope, $element, $attributes, formForController) {
        $scope.class = $attributes.class;

        formForController.registerSubmitButton($scope);
      }
    };
  });

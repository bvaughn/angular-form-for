angular.module('myAngularModule').directive('customField',
    function() {
      return {
        require: '^formFor',
        template: '<input type="text" ng-model="model.bindable" ng-disabled="disabledByForm" ng-debounce>',
        scope: {
          attribute: '@',
          disabledByForm: '@'
        },
        link: function($scope, $element, $attributes, formForController) {
          $scope.model = formForController.registerFormField($scope, $scope.attribute);
        }
      };
    }
  );

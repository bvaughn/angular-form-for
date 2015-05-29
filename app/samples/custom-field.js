angular.module('myAngularModule').directive('customField',
  function(FieldHelper) {
    return {
      restrict: 'E',
      require: '^formFor',
      template: '<div>' +
                '  <p ng-if="model.error" ng-bind="model.error"></p>' +
                '  <input type="text" ng-model="model.bindable" ng-disabled="model.disabled" ng-debounce>' +
                '</div>',
      scope: {
        attribute: '@'
      },
      link: function($scope, $element, $attributes, formForController) {
        // It is not necessary to use FieldHelper, but it simplifies registration.
        // $scope will have a 'model' attribute after this method has executed.
        FieldHelper.manageFieldRegistration($scope, $attributes, formForController);
      }
    };
  }
);

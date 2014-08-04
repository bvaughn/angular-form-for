/**
 * This component is only intended for internal use by the formFor module.
 */
angular.module('formFor').directive('fieldLabel',
  function( $sce ) {
    return {
      restrict: 'AE',
      templateUrl: 'form-for/templates/field-label.html',
      scope: {
        help: '@?',
        label: '@'
      },
      controller: function($scope) {
        $scope.$watch('label', function(value) {
          $scope.bindableLabel = $sce.trustAsHtml(value);
        });
      }
    };
  });

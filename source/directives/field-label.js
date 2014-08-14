/**
 * This component is only intended for internal use by the formFor module.
 */
angular.module('formFor').directive('fieldLabel',
  function( $sce, FormForConfiguration ) {
    return {
      restrict: 'EA',
      templateUrl: 'form-for/templates/field-label.html',
      scope: {
        help: '@?',
        label: '@',
        required: '@?'
      },
      controller: function($scope) {
        $scope.$watch('label', function(value) {
          $scope.bindableLabel = $sce.trustAsHtml(value);
        });

        if ($scope.required) {
          $scope.requiredLabel = FormForConfiguration.requiredLabel;
        }
      }
    };
  });

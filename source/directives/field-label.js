/**
 * This component is only intended for internal use by the formFor module.
 */
angular.module('formFor').directive('fieldLabel',
  function( $state ) {
    return {
      restrict: 'E',
      templateUrl: 'form-for/templates/field-label.html',
      $scope: {
        help: '@?',
        label: '@'
      }
    };
  });

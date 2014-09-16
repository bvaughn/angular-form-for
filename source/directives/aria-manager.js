/**
 * Helper directive for input elements.
 * Observes the $scope :model attribute and updates aria-* elements accordingly.
 */
angular.module('formFor').directive('ariaManager', function() {
  return {
    restrict: 'A',
    link: function($scope, $elements, $attributes) {
      $scope.$watch('model.uid', function(uid) {
        $attributes.$set('ariaDescribedby', uid + '-error');
        $attributes.$set('ariaLabelledby', uid + '-label');
      });

      $scope.$watch('model.error', function(error) {
        $attributes.$set('ariaInvalid', !!error);
      });
    }
  }
});

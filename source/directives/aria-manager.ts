module formFor {

  /**
   * Helper directive for input elements.
   * Observes the $scope :model attribute and updates aria-* elements accordingly.
   */
  export class AriaManager implements ng.IDirective {

    restrict:string = 'A';

    /* @ngInject */
    link($scope:ng.IScope, $element:ng.IAugmentedJQuery, $attributes:ng.IAttributes):void {
      $scope.$watch('model.uid', function(uid) {
        $attributes.$set('ariaDescribedby', uid + '-error');
        $attributes.$set('ariaLabelledby', uid + '-label');
      });

      $scope.$watch('model.error', function(error) {
        $attributes.$set('ariaInvalid', !!error);
      });
    }
  }

  angular.module('formFor').directive('ariaManager', () => {
    return new AriaManager();
  });
}
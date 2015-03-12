module formFor {

  /**
   */
  export function FormForIncludeReplaceDirective():ng.IDirective {
    return {
      require: 'ngInclude',
      restrict: 'A', /* optional */

      link: function($scope:ng.IScope,
                     $element:ng.IAugmentedJQuery,
                     $attributes:ng.IAttributes):void {

        $element.replaceWith($element.children());
      }
    }
  };

  angular.module('formFor').directive('formForIncludeReplace', () => FormForIncludeReplaceDirective());
}
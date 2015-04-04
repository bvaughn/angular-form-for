module formFor {

  /**
   * Adds the ability to replace an ngInclude element with its template content.
   */
  export class FormForIncludeReplaceDirective implements ng.IDirective {
    require:string = 'ngInclude';
    restrict:string = 'A'; /* optional */

    /* @ngInject */
    link($scope:ng.IScope,
         $element:ng.IAugmentedJQuery,
         $attributes:ng.IAttributes):void {

      $element.replaceWith($element.children());
    }
  }

  angular.module('formFor').directive('formForIncludeReplace', () => {
    return new FormForIncludeReplaceDirective();
  });
}
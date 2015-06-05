module formFor {
  var $compile_: ng.ICompileService;

  /**
   * Adds the ability to replace an ngInclude element with its template content.
   */
  export class FormForIncludeReplaceDirective implements ng.IDirective {
    require:string = 'ngInclude';
    restrict:string = 'A'; /* optional */

    /* @ngInject */
    constructor($compile) {
      $compile_ = $compile;
    }

    /* @ngInject */
    link($scope:ng.IScope,
         $element:ng.IAugmentedJQuery,
         $attributes:ng.IAttributes):void {

      var html = $element.prop('innerHTML');
      var compiled = $compile_(html)($scope);
      $element.replaceWith(compiled);
    }
  }

  angular.module('formFor').directive('formForIncludeReplace', ($compile) => {
    return new FormForIncludeReplaceDirective($compile);
  });
}
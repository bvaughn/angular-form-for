module formFor {

  /**
   * SubmitButton $scope.
   */
  interface SubmitButtonScope extends ng.IScope {

    /**
     * Bindable label for template to display.
     */
    bindableLabel:string;

    /**
     * Optional CSS class names to apply to button component.
     */
    buttonClass?:string;

    /**
     * Disable button.
     Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute.
     */
    disable:boolean;

    /**
     * Optional CSS class to display as a button icon.
     */
    icon?:string;

    /**
     * Button label. HTML is allowed for this attribute.
     */
    label?:string;

    /**
     * Data shared between formFor directive and SubmitButton.
     */
    model:SubmitButtonWrapper;

    /**
     * Optional custom tab index for input; by default this is 0 (tab order chosen by the browser)
     */
    tabIndex?:number;
  }

  var $sce_:ng.ISCEService;

  /**
   * Displays a submit &lt;button&gt; component that is automatically disabled when a form is invalid or in the process of submitting.
   *
   * @example
   * // Here is a simple submit button with an icon:
   * <submit-button label="Sign Up" icon="fa fa-user"></submit-button>
   *
   * // You can use your own <button> components within a formFor as well.
   * // If you choose to you must register your button with formFor's controller using registerSubmitButton().
   * // This method returns a model with a bindable 'disabled' attribute that your button should use like so:
   * <form form-for="formData">
   *   <button ng-disabled="model.disabled">Submit</button>
   * </form>
   *
   * @param $sce $injector-supplied $sce service
   */
  export class SubmitButtonDirective implements ng.IDirective {

    require:string = '^formFor';
    restrict:string = 'EA';
    templateUrl:string = ($element, $attributes) => {
        return $attributes['template'] || 'form-for/templates/submit-button.html';
    };

    scope:any = {
      disable: '=',
      buttonClass: '@',
      icon: '@',
      label: '@'
    };

    /* @ngInject */
    constructor($sce:ng.ISCEService) {
      $sce_ = $sce;
    }

    /* @ngInject */
    link($scope:SubmitButtonScope,
         $element:ng.IAugmentedJQuery,
         $attributes:ng.IAttributes,
         formForController:FormForController):void {

      $scope.tabIndex = $attributes['tabIndex'] || 0;

      $scope.$watch('label', function (value) {
        $scope.bindableLabel = $sce_.trustAsHtml(value);
      });

      $scope.model = formForController.registerSubmitButton($scope);
    }
  }

  angular.module('formFor').directive('submitButton', ($sce) => {
    return new SubmitButtonDirective($sce);
  });
}
/**
 * @ngdoc Directives
 * @name submit-button
 *
 * @description
 * Displays a submit &lt;button&gt; component that is automatically disabled when a form is invalid or in the process of submitting.
 *
 * @param {String} buttonClass Optional CSS class names to apply to button component.
 * @param {Boolean} disable Disable button.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * @param {String} icon Optional CSS class to display as a button icon.
 * @param {String} label Button label.
 * HTML is allowed for this attribute.
 * @param {int} tabIndex Optional custom tab index for input; by default this is 0 (tab order chosen by the browser)
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
 */
angular.module('formFor').directive('submitButton',
  function($log, $sce) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/submit-button.html',
      scope: {
        disable: '=',
        icon: '@',
        label: '@'
      },
      link: function($scope, $element, $attributes, formForController) {
        $scope['buttonClass'] = $attributes.buttonClass;
        $scope.tabIndex = $attributes.tabIndex || 0;

        $scope.$watch('label', function(value) {
          $scope.bindableLabel = $sce.trustAsHtml(value);
        });

        $scope.model = formForController.registerSubmitButton($scope);
      }
    };
  });

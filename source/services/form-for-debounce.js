/**
 * Angular introduced debouncing (via ngModelOptions) in version 1.3.
 * As of the time of this writing, that version is still in beta.
 * This component adds debouncing behavior for Angular 1.2.x.
 * It is primarily intended for use with <input type=text> elements.
 */
angular.module('formFor').directive('formForDebounce', function($timeout) {
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: 99,
    link: function(scope, element, attributes, ngModelController) {
      if (attributes.type === 'radio' || attributes.type === 'checkbox') {
        return;
      }

      var duration = attributes.formForDebounce ? parseInt(attributes.formForDebounce) : 1000;

      element.unbind('input');

      var debounce;

      element.bind('input', function() {
        $timeout.cancel(debounce);

        debounce = $timeout(function() {
          scope.$apply(function() {
            ngModelController.$setViewValue(element.val());
          });
        }, duration);
      });

      element.bind('blur', function() {
        scope.$apply(function() {
          ngModelController.$setViewValue(element.val());
        });
      });
    }
  };
});

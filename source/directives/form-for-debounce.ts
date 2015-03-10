/// <reference path="../services/form-for-configuration.ts" />

module formFor {

  /**
   * Angular introduced debouncing (via ngModelOptions) in version 1.3.
   * As of the time of this writing, that version is still in beta.
   * This component adds debouncing behavior for Angular 1.2.x.
   * It is primarily intended for use with &lt;input type=text&gt; and &lt;textarea&gt; elements.
   *
   * @example
   * // To configure this component to debounce with a 2 second delay:
   * <input type="text"
   *        ng-model="username"
   *        form-for-debounce="2000" />
   *
   * // To disable the debounce interval and configure an input to update only on blur:
   * <input type="text"
   *        ng-model="username"
   *        form-for-debounce="false" />
   */
  export function FormForDebounceDirective($log:ng.ILogService,
                                           $sniffer:any,
                                           $timeout:ng.ITimeoutService,
                                           formForConfiguration:FormForConfiguration):ng.IDirective {

    return {
      priority: 99,
      require: 'ngModel',
      restrict: 'A',

      /**
       * Scope.
       *
       * @param formForDebounce Debounce duration in milliseconds.
       *                        By default this value is 1000ms.
       *                        To disable the debounce interval (to update on blur) a value of false should be specified.
       */
      scope: {
        formForDebounce: '@'
      },

      link: ($scope:ng.IScope,
             $element:ng.IAugmentedJQuery,
             $attributes:ng.IAttributes,
             ngModelController:ng.INgModelController) => {

        if ($attributes['type'] === 'radio' || $attributes['type'] === 'checkbox') {
          $log.warn("formForDebounce should only be used with <input type=text> and <textarea> elements");

          return;
        }

        var durationAttributeValue:any = $attributes['formForDebounce'];
        var duration:any = formForConfiguration.defaultDebounceDuration;

        // Debounce can be configured for blur-only by passing a value of 'false'.
        if (durationAttributeValue !== undefined) {
          if (durationAttributeValue.toString() === 'false') {
            duration = false;
          } else {
            durationAttributeValue = parseInt(durationAttributeValue);

            if (angular.isNumber(durationAttributeValue) && !isNaN(durationAttributeValue)) {
              duration = durationAttributeValue;
            }
          }
        }

        // Older IEs do not have 'input' events - and trying to access them can cause TypeErrors.
        // Angular's ngModel falls back to 'keydown' and 'paste' events in this case, so we must also.
        if ($sniffer.hasEvent('input')) {
          $element.off('input');
        } else {
          $element.off('keydown');

          if ($sniffer.hasEvent('paste')) {
            $element.off('paste');
          }
        }

        var debounceTimeoutId:ng.IPromise<any>;

        if (duration !== false) {
          var inputChangeHandler = () => {
            $timeout.cancel(debounceTimeoutId);

            debounceTimeoutId = $timeout(() => {
              $scope.$apply(() => {
                ngModelController.$setViewValue($element.val());
              });
            }, duration);
          };

          if ($sniffer.hasEvent('input')) {
            $element.on('input', undefined, inputChangeHandler);
          } else {
            $element.on('keydown', undefined, inputChangeHandler);

            if ($sniffer.hasEvent('paste')) {
              $element.on('paste', undefined, inputChangeHandler);
            }
          }
        }

        $element.on('blur', undefined, () => {
          $scope.$apply(function () {
            ngModelController.$setViewValue($element.val());
          });
        });

        $scope.$on('$destroy', () => {
          if (debounceTimeoutId) {
            $timeout.cancel(debounceTimeoutId);
          }
        });
      }
    };
  }

  angular.module('formFor').directive('formForDebounce',
    ($log, $sniffer, $timeout, FormForConfiguration) =>
      FormForDebounceDirective($log, $sniffer, $timeout, FormForConfiguration));
}
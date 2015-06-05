/// <reference path="../services/form-for-configuration.ts" />

module formFor {
  var $log_:ng.ILogService;
  var $sniffer_:any;
  var $timeout_:ng.ITimeoutService;
  var formForConfiguration_:FormForConfiguration;

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
  export class FormForDebounceDirective implements ng.IDirective {

    priority:number = 99;
    require:string = 'ngModel';
    restrict:string = 'A';

    /**
     * Scope.
     *
     * @param formForDebounce Debounce duration in milliseconds.
     *                        By default this value is 1000ms.
     *                        To disable the debounce interval (to update on blur) a value of false should be specified.
     */
    scope:any = {
      formForDebounce: '@'
    };

    /* @ngInject */
    constructor($log:ng.ILogService,
                $sniffer:any,
                $timeout:ng.ITimeoutService,
                formForConfiguration:FormForConfiguration) {
      $log_ = $log;
      $sniffer_ = $sniffer;
      $timeout_ = $timeout;
      formForConfiguration_ = formForConfiguration;
    }

    /* @ngInject */
    link($scope:ng.IScope,
         $element:ng.IAugmentedJQuery,
         $attributes:ng.IAttributes,
         ngModelController:ng.INgModelController):void {

      if ($attributes['type'] === 'radio' || $attributes['type'] === 'checkbox') {
        $log_.warn("formForDebounce should only be used with <input type=text> and <textarea> elements");

        return;
      }

      var durationAttributeValue:any = $attributes['formForDebounce'];
      var duration:any = formForConfiguration_.defaultDebounceDuration;

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
      if ($sniffer_.hasEvent('input')) {
        $element.off('input');
      } else {
        $element.off('keydown');

        if ($sniffer_.hasEvent('paste')) {
          $element.off('paste');
        }
      }

      var debounceTimeoutId:ng.IPromise<any>;

      if (duration !== false) {
        var inputChangeHandler = () => {
          $timeout_.cancel(debounceTimeoutId);

          debounceTimeoutId = $timeout_(() => {
            $scope.$apply(() => {
              ngModelController.$setViewValue($element.val());
            });
          }, duration);
        };

        if ($sniffer_.hasEvent('input')) {
          $element.on('input', inputChangeHandler);
        } else {
          $element.on('keydown', inputChangeHandler);

          if ($sniffer_.hasEvent('paste')) {
            $element.on('paste', inputChangeHandler);
          }
        }
      }

      $element.on('blur', () => {
        $scope.$apply(function () {
          ngModelController.$setViewValue($element.val());
        });
      });

      $scope.$on('$destroy', () => {
        if (debounceTimeoutId) {
          $timeout_.cancel(debounceTimeoutId);
        }
      });
    }
  }

  angular.module('formFor').directive('formForDebounce',
    ($log, $sniffer, $timeout, FormForConfiguration) => {
      return new FormForDebounceDirective($log, $sniffer, $timeout, FormForConfiguration);
    });
}
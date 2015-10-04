/// <reference path="../utils/form-for-controller.ts" />
/// <reference path="../utils/promise-utils.ts" />

module formFor {

  var $injector_:ng.auto.IInjectorService;
  var $log_:ng.ILogService;
  var $parse_:ng.IParseService;
  var $sce_:ng.ISCEService;
  var formForConfiguration_:FormForConfiguration;
  var modelValidator_:ModelValidator;
  var promiseUtils_:PromiseUtils;

  /**
   * This directive should be paired with an Angular ngForm object,
   * and should contain at least one of the formFor field types described below.
   * At a high level, it operates on a bindable form-data object and runs validations each time a change is detected.
   */
  export class FormForDirective implements ng.IDirective {

    // We don't need the ngForm controller, but we do rely on the form-submit hook
    require:string = 'form';
    restrict:string = 'A';

    scope:any = {
      controller: '=?',
      disable: '=?',
      formFor: '=',
      service: '@',
      submitComplete: '&?',
      submitError: '&?',
      submitWith: '&?',
      valid: '=?',
      validateOn: '=?',
      validationFailed: '&?',
      validationRules: '=?'
    };

    /* @ngInject */
    constructor($injector:ng.auto.IInjectorService) {
      $injector_ = $injector;
      $log_ = $injector.get('$log');
      $parse_ = $injector.get('$parse');
      $sce_ = $injector.get('$sce');
      formForConfiguration_ = $injector.get('FormForConfiguration');
      modelValidator_ = $injector.get('ModelValidator');
      promiseUtils_ = new PromiseUtils($injector.get('$q'));
    }

    /* @ngInject */
    controller($scope:FormForScope):void {
      if (!$scope.formFor) {
        $log_.error('The form data object specified by <form form-for=""> is null or undefined.');
      }

      $scope.fields = {};
      $scope.collectionLabels = {};
      $scope.buttons = [];
      $scope.controller = $scope.controller || <any> {};

      if ($scope.service) {
        $scope.$service = $injector_.get($scope.service);
      }

      // Validation rules can come through 2 ways:
      // As part of the validation service or as a direct binding (specified via an HTML attribute binding).
      if ($scope.validationRules) {
        $scope.$validationRuleset = $scope.validationRules;
      } else if ($scope.$service) {
        $scope.$validationRuleset = $scope.$service.validationRules;
      }

      // Attach FormForController (interface) methods to the directive's controller (this).
      createFormForController(this, $parse_, promiseUtils_, $scope, modelValidator_, formForConfiguration_);

      // Expose controller methods to the shared, bindable $scope.controller
      if ($scope.controller) {
        angular.copy(this, $scope.controller);
      }

      // Disable all child inputs if the form becomes disabled.
      $scope.$watch('disable', (value) => {
        angular.forEach($scope.fields, (fieldDatum:FieldDatum) => {
          fieldDatum.bindableWrapper.disabled = value;
        });

        angular.forEach($scope.buttons, (buttonWrapper:SubmitButtonWrapper) => {
          buttonWrapper.disabled = value;
        });
      });

      // Track field validity and dirty state.
      $scope.formForStateHelper = new FormForStateHelper($parse_, $scope);

      // Watch for any validation changes or changes in form-state that require us to notify the user.
      // Rather than using a deep-watch, FormForStateHelper exposes a bindable attribute 'watchable'.
      // This attribute is guaranteed to change whenever validation criteria change (but its value is meaningless).
      $scope.$watch('formForStateHelper.watchable', () => {
        var hasFormBeenSubmitted:boolean = $scope.formForStateHelper.hasFormBeenSubmitted();

        // Mark invalid fields
        angular.forEach($scope.fields, (fieldDatum:FieldDatum, bindableFieldName:string) => {
          if (hasFormBeenSubmitted || $scope.formForStateHelper.hasFieldBeenModified(bindableFieldName)) {
            var error:string = $scope.formForStateHelper.getFieldError(bindableFieldName);

            fieldDatum.bindableWrapper.error = error ? $sce_.trustAsHtml(error) : null;
          } else {
            fieldDatum.bindableWrapper.error = null; // Clear out field errors in the event that the form has been reset
          }
        });

        // Mark invalid collections
        angular.forEach($scope.collectionLabels,
          (bindableWrapper:BindableCollectionWrapper, bindableFieldName:string) => {
            var error:string = $scope.formForStateHelper.getFieldError(bindableFieldName);

            bindableWrapper.error = error ? $sce_.trustAsHtml(error) : null;
          });
      });
    }

    /* @ngInject */
    link($scope:FormForScope, $element:ng.IAugmentedJQuery, $attributes:ng.IAttributes):void {
      $element.on('submit', // Override form submit to trigger overall validation.
        () => {
          $scope.formForStateHelper.setFormSubmitted(true);
          $scope.disable = true;

          var validationPromise:ng.IPromise<any>;

          // By default formFor validates on-change,
          // But we need to [re-]validate on submit as well to handle pristine fields.
          // The only case we don't want to validate for is 'manual'.
          if ($scope.validateOn === 'manual') {
            validationPromise = promiseUtils_.resolve();
          } else {
            validationPromise = $scope.controller.validateForm();
          }

          validationPromise.then(
            () => {
              var promise:ng.IPromise<any>;

              // $scope.submitWith is wrapped with a virtual function so we must check via attributes
              if ($attributes['submitWith']) {
                promise = $scope.submitWith({data: $scope.formFor});
              } else if ($scope.$service && $scope.$service.submit) {
                promise = $scope.$service.submit($scope.formFor);
              } else {
                promise = promiseUtils_.reject('No submit function provided');
              }

              // Issue #18 Guard against submit functions that don't return a promise by warning rather than erroring.
              if (!promise) {
                promise = promiseUtils_.reject('Submit function did not return a promise');
              }

              promise.then(
                (response:any) => {
                  // $scope.submitComplete is wrapped with a virtual function so we must check via attributes
                  if ($attributes['submitComplete']) {
                    $scope.submitComplete({data: response});
                  } else {
                    formForConfiguration_.defaultSubmitComplete(response, $scope.controller);
                  }
                },
                (errorMessageOrErrorMap:any) => {
                  // If the remote response returned inline-errors update our error map.
                  // This is unecessary if a string was returned.
                  if (angular.isObject(errorMessageOrErrorMap)) {
                    if ($scope.validateOn !== 'manual') {
                      // TODO Questionable: Maybe server should be forced to return fields/collections constraints?
                      $scope.controller.updateCollectionErrors(errorMessageOrErrorMap);
                      $scope.controller.updateFieldErrors(errorMessageOrErrorMap);
                    }
                  }

                  // $scope.submitError is wrapped with a virtual function so we must check via attributes
                  if ($attributes['submitError']) {
                    $scope.submitError({error: errorMessageOrErrorMap});
                  } else {
                    formForConfiguration_.defaultSubmitError(errorMessageOrErrorMap, $scope.controller);
                  }
                });
              promise['finally'](
                () => {
                  $scope.disable = false;
                });
            },
            (reason:any) => {
              $scope.disable = false;

              // $scope.validationFailed is wrapped with a virtual function so we must check via attributes
              if ($attributes['validationFailed']) {
                $scope.validationFailed();
              } else {
                formForConfiguration_.defaultValidationFailed(reason);
              }
            });

          return false;
        });
    }
  }

  angular.module('formFor').directive('formFor', ($injector) => {
    return new FormForDirective($injector);
  });
}
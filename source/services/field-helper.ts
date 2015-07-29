/// <reference path="form-for-configuration.ts" />

module formFor {

  /**
   * Various helper methods for functionality shared between formFor field directives.
   */
  export class FieldHelper {

    private formForConfiguration_:FormForConfiguration;

    constructor(FormForConfiguration) {
      this.formForConfiguration_ = FormForConfiguration;
    }

    /**
     * Determines the field's label based on its current attributes and the FormForConfiguration configuration settings.
     * Also watches for changes in the (attributes) label and updates $scope accordingly.
     *
     * @param $scope Directive link $scope
     * @param $attributes Directive link $attributes
     * @param humanizeValueAttribute Fall back to a humanized version of the :value attribute if no label is provided;
     *                               This can be useful for radio options where the label should represent the value.
     *                               By default, a humanized version of the :attribute attribute will be used.
     */
    manageLabel($scope:ng.IScope, $attributes:ng.IAttributes, humanizeValueAttribute:boolean):void {
      if (this.formForConfiguration_.autoGenerateLabels) {
        $scope['label'] =
          humanizeValueAttribute ?
            StringUtil.humanize($scope['value']) :
            StringUtil.humanize($scope['attribute']);
      }

      if (this.formForConfiguration_.labelClass) {
        $scope['labelClass'] =
          this.formForConfiguration_.labelClass;
      }

      if ($attributes.hasOwnProperty('label')) {
        $attributes.$observe('label', function (label) {
          $scope['label'] = label;
        });
      }

      if ($attributes.hasOwnProperty('labelClass')) {
        $attributes.$observe('labelClass', function (labelClass) {
          $scope['labelClass'] = labelClass;
        });
      }
    }

    /**
     * Helper method that registers a form field and stores the bindable object returned on the $scope.
     * This method also unregisters the field on $scope $destroy.
     *
     * @param $scope Input field $scope
     * @param $attributes Input field $attributes element
     * @param formForController Controller object for parent formFor
     */
    manageFieldRegistration($scope:ng.IScope, $attributes:ng.IAttributes, formForController:FormForController):void {
      $scope.$watch('attribute', function (newValue, oldValue) {
        if ($scope['model']) {
          formForController.unregisterFormField(oldValue);
        }

        $scope['model'] = formForController.registerFormField($scope['attribute']);

        if ($attributes['uid']) { // Optional override ~ issue #57
          $scope['model']['uid'] = $attributes['uid'];
        }
      });

      $scope.$on('$destroy', function () {
        formForController.unregisterFormField($scope['attribute']);
      });
    }
  }

  angular.module('formFor').service('FieldHelper',
    (FormForConfiguration) => new FieldHelper(FormForConfiguration));
}
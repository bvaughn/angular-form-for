/**
 * @ngdoc Services
 * @name FieldHelper
 * @description
 * Various helper methods for functionality shared between formFor field directives.
 */
angular.module('formFor').service('FieldHelper',
  function(FormForConfiguration, StringUtil) {

    /**
     * Determines the field's label based on its current attributes and the FormForConfiguration configuration settings.
     * Also watches for changes in the (attributes) label and updates $scope accordingly.
     * @memberof FieldHelper
     * @param {Hash} $scope Directive link $scope
     * @param {Hash} $attributes Directive link $attributes
     * @param {Boolean} humanizeValueAttribute Fall back to a humanized version of the :value attribute if no label is provided;
     * By default, a humanized version of the :attribute attribute will be used.
     */
    this.manageLabel = function($scope, $attributes, humanizeValueAttribute) {
      if ($attributes.hasOwnProperty('label')) {
        $attributes.$observe('label', function(label) {
          $scope.label = label;
        });
      }

      if (FormForConfiguration.autoGenerateLabels) {
        $scope.label =
          humanizeValueAttribute ?
            StringUtil.humanize($scope.value) :
            StringUtil.humanize($scope.attribute);
      }
    };

    /**
     * Helper method that registers a form field and stores the bindable object returned on the $scope.
     * This method also unregisters the field on $scope $destroy.
     * @memberof FieldHelper
     * @param {$scope} $scope Input field $scope
     * @param {$attributes} $attributes Input field $attributes element
     * @param {Object} formForController Controller object for parent formFor
     */
    this.manageFieldRegistration = function($scope, $attributes, formForController) {
      $scope.$watch('attribute', function(newValue, oldValue) {
        if ($scope.model) {
          formForController.unregisterFormField(oldValue);
        }

        $scope.model = formForController.registerFormField($scope.attribute);

        if ($attributes.uid) { // Optional override ~ issue #57
          $scope.model.uid = $attributes.uid;
        }
      });

      $scope.$on('$destroy', function() {
        formForController.unregisterFormField($scope.attribute);
      });
    };
  });

/**
 * @ngdoc Directives
 * @name field-label
 * @description
 * This component is only intended for internal use by the formFor module.
 *
 * @param {String} inputUid ID of the associated input field element; used as the :for attribute of the inner <label>
 * @param {String} help Optional help tooltip to display on hover.
 * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} label Field label string. This string can contain HTML markup.
 * @param {String} required Optional attribute specifies that this field is a required field.
 * If a required label has been provided via FormForConfiguration then field label will display that value for required fields.
 * @param {String} uid Optional UID for HTML element containing the label string
 *
 * @example
 * // To display a simple label with a help tooltip:
 * <field-label label="Username"
 *              help="This will be visible to other users">
 * </field-label>
 */
angular.module('formFor').directive('fieldLabel',
  function( $sce, FormForConfiguration ) {
    return {
      restrict: 'EA',
      replace: true, // Necessary for sibling selectors
      templateUrl: 'form-for/templates/field-label.html',
      scope: {
        inputUid: '@',
        help: '@?',
        label: '@',
        required: '@?',
        uid: '@'
      },
      controller: function($scope) {
        $scope.$watch('label', function(value) {
          $scope.bindableLabel = $sce.trustAsHtml(value);
        });

        $scope.$watch('required', function(required) {
          $scope.requiredLabel = $scope.$eval(required) ? FormForConfiguration.requiredLabel : null;
        });
      }
    };
  });

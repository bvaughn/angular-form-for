/**
 * @ngdoc Directives
 * @name field-label
 * @description
 * This component is only intended for internal use by the formFor module.
 *
 * @param {String} help Field label string. This string can contain HTML markup.
 * @param {String} label Optional help tooltip to display on hover.
 * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} required Optional attribute specifies that this field is a required field.
 * If a required label has been provided via FormForConfiguration then field label will display that value for required fields.
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
      templateUrl: 'form-for/templates/field-label.html',
      scope: {
        help: '@?',
        label: '@',
        required: '@?'
      },
      controller: function($scope) {
        $scope.$watch('label', function(value) {
          $scope.bindableLabel = $sce.trustAsHtml(value);
        });

        if ($scope.required) {
          $scope.requiredLabel = FormForConfiguration.requiredLabel;
        }
      }
    };
  });

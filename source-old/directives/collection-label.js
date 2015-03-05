/**
 * @ngdoc Directives
 * @name collection-label
 * @description
 * Header label for collections.
 * This component displays header text as well as collection validation errors.
 *
 * @param {String} help Optional help tooltip to display on hover.
 * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} label Field label string. This string can contain HTML markup.
 * @param {String} attribute Name of collection within validation rules
 *
 * @example
 * // To display a simple collection header:
 * <collection-label  label="Hobbies" attribute="hobbies">
 * </collection-label>
 */
angular.module('formFor').directive('collectionLabel',
  function( $sce, FormForConfiguration ) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/collection-label.html',
      scope: {
        attribute: '@',
        help: '@?',
        label: '@'
      },
      link: function($scope, $element, $attributes, formForController) {
        $scope.$watch('label', function(value) {
          $scope.bindableLabel = $sce.trustAsHtml(value);
        });

        $scope.model = formForController.registerCollectionLabel($scope.attribute);
      }
    };
  });

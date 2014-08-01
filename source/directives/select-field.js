/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#selectfield
 */
angular.module('formFor').directive('selectField',
  function() {
    return {
      require: '^formFor',
      restrict: 'E',
      templateUrl: 'form-for/templates/select-field.html',
      scope: {
        attribute: '@',
        help: '@?',
        label: '@?',
        placeholder: '@?',
        type: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        $scope.allowBlank = $attributes.hasOwnProperty('allowBlank');
        $scope.model = formForController.registerFormField($scope, $scope.attribute);

        // TODO Track scroll position and viewport height and expand upward if needed

        $scope.$watch('model.bindable', function(value) {
          var option = _.find($scope.options,
            function(option) {
              return value === option.value;
            });

          $scope.selectedOption = option;
          $scope.selectedOptionLabel = option && option.label;
        });

        $scope.selectOption = function(option) {
          $scope.model.bindable = option && option.value;
          $scope.isOpen = false;
        };

        var clickWatcher = function() {
          $scope.isOpen = false;
          $scope.$apply();
        };

        $scope.toggleOpen = function() {
          $scope.isOpen = !$scope.isOpen;

          if ($scope.isOpen) {
            $timeout(function() { // Delay to avoid processing the same click event that trigger the toggle-open
              $(window).one('click', clickWatcher);
            }, 1);
          }
        };

        $scope.$on('$destroy', function() {
          $(window).off('click', clickWatcher);
        });
      }
    };
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#textfield
 */
angular.module('formFor').directive('textField',
  function($log, $timeout) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/text-field.html',
      scope: {
        attribute: '@',
        debounce: '@?',
        disable: '@',
        focused: '&?',
        help: '@?',
        iconAfter: '@?',
        iconAfterClicked: '&?',
        iconBefore: '@?',
        iconBeforeClicked: '&?',
        label: '@?',
        placeholder: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.type = $attributes.type || 'text';
        $scope.multiline = $attributes.hasOwnProperty('multiline') && $attributes.multiline !== 'false';

        if ($attributes.hasOwnProperty('autofocus')) {
          $timeout(function() {
            $element.find( $scope.multiline ? 'textarea' : 'input' ).focus();
          });
        }

        $scope.model = formForController.registerFormField($scope, $scope.attribute);

        $scope.onIconAfterClick = function() {
          if ($attributes.hasOwnProperty('iconAfterClicked')) {
            $scope.iconAfterClicked();
          }
        };
        $scope.onIconBeforeClick = function() {
          if ($attributes.hasOwnProperty('iconBeforeClicked')) {
            $scope.iconBeforeClicked();
          }
        };
        $scope.onFocus = function() {
          if ($attributes.hasOwnProperty('focused')) {
            $scope.focused();
          }
        };
      }
    };
  });

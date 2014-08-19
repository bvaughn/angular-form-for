/**
 * @ngdoc Directives
 * @name text-field
 * @description
 * Displays a HTML &lt;input&gt; element along with an input label.
 * This directive can be configured to optionally display an informational tooltip.
 * In the event of a validation error, this directive will also render an inline error message.
 *
 * @param {String} attribute Name of the attribute within the parent form-for directive's model object.
 * This attributes specifies the data-binding target for the input.
 * Dot notation (ex "address.street") is supported.
 * @param {attribute} autofocus The presence of this attribute will auto-focus the input field.
 * @param {int} debounce Debounce duration (in ms) before input text is applied to model and evaluated.
 * To disable debounce (update only on blur) specify a value of false.
 * This value's default is determined by FormForConfiguration.
 * @param {Boolean} disable Disable input element.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * @param {String} help Optional help tooltip to display on hover.
 * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {Function} focused Optional function to be invoked on text input focus.
 * @param {String} iconAfter Optional CSS class to display as an icon after the input field.
 * @param {Function} iconAfterClicked Optional function to be invoked when the after-icon is clicked.
 * @param {String} iconBefore Optional CSS class to display as a icon before the input field.
 * @param {Function} iconBeforeClicked Optional function to be invoked when the before-icon is clicked.
 * @param {String} label Optional field label displayed before the input.
 * (Although not required, it is strongly suggested that you specify a value for this attribute.) HTML is allowed for this attribute.
 * @param {attribute} multiline The presence of this attribute enables multi-line input.
 * @param {String} placeholder Optional placeholder text to display if input is empty.
 * @param {String} type Optional HTML input-type (ex.
 * text, password, etc.).
 * Defaults to "text".
 *
 * @example
 * // To create a password input you might use the following markup:
 * <text-field attribute="password" label="Password" type="password"></text-field>
 *
 * // To create a more advanced input field, with placeholder text and help tooltip you might use the following markup:
 * <text-field attribute="username" label="Username"
 *             placeholder="Example brianvaughn"
 *             help="Your username will be visible to others!"></text-field>
 *
 * // To render a multiline text input (or <textarea>):
 * <text-field attribute="description" label="Description" multiline></text-field>
 */
angular.module('formFor').directive('textField',
  function($log, $timeout, FieldHelper) {
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

        $scope.model = formForController.registerFormField($scope.attribute);
        $scope.label = FieldHelper.getLabel($attributes, $scope.attribute);

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

        $scope.$on('$destroy', function() {
          formForController.unregisterFormField($scope.attribute);
        });
      }
    };
  });

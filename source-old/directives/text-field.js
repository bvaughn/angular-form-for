/**
 * @ngdoc Directives
 * @name text-field
 * @description
 * Displays an HTML &lt;input&gt; or &lt;textarea&gt; element along with an optional label.
 * The HTML &lt;input&gt; type can be configured to allow for passwords, numbers, etc.
 * This directive can also be configured to display an informational tooltip.
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
 * @param {Function} blurred Optional function to be invoked on text input blur.
 * @param {String} iconAfter Optional CSS class to display as an icon after the input field.
 * An object with the following keys may also be provided: pristine, valid, invalid
 * In this case the icon specified by a particular state will be shown based on the field's validation status.
 * @param {Function} iconAfterClicked Optional function to be invoked when the after-icon is clicked.
 * @param {String} iconBefore Optional CSS class to display as a icon before the input field.
 * An object with the following keys may also be provided: pristine, valid, invalid
 * In this case the icon specified by a particular state will be shown based on the field's validation status.
 * @param {Function} iconBeforeClicked Optional function to be invoked when the before-icon is clicked.
 * @param {String} label Optional field label displayed before the input.
 * (Although not required, it is strongly suggested that you specify a value for this attribute.) HTML is allowed for this attribute.
 * @param {attribute} multiline The presence of this attribute enables multi-line input.
 * @param {String} placeholder Optional placeholder text to display if input is empty.
 * @param {int} rows Optional number of rows for a multline `<textarea>`; defaults to 3.
 * @param {int} tabIndex Optional custom tab index for input; by default this is 0 (tab order chosen by the browser)
 * @param {String} type Optional HTML input-type (ex.
 * text, password, etc.).
 * Defaults to "text".
 * @param {String} uid Optional ID to assign to the inner <input type="checkbox"> element;
 * A unique ID will be auto-generated if no value is provided.
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
 *
 * // To render icons based on the status of the field (pristin, invalid, valid) pass an object:
 * <text-field attribute="username" label="Username"
 *             icon-after="{pristine: 'fa fa-user', invalid: 'fa fa-times', valid: 'fa fa-check'}">
 * </text-field>
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
        disable: '=',
        focused: '&?',
        blurred: '&?',
        help: '@?',
        iconAfterClicked: '&?',
        iconBeforeClicked: '&?',
        placeholder: '@?',
        rows: '=?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        // Expose textField attributes to textField template partials for easier customization (see issue #61)
        $scope.attributes = $attributes;

        $scope.rows = $scope.rows || 3;
        $scope.type = $attributes.type || 'text';
        $scope.multiline = $attributes.hasOwnProperty('multiline') && $attributes.multiline !== 'false';
        $scope.tabIndex = $attributes.tabIndex || 0;

        if ($attributes.hasOwnProperty('autofocus')) {
          $timeout(function() {
            $element.find( $scope.multiline ? 'textarea' : 'input' )[0].focus();
          });
        }

        FieldHelper.manageLabel($scope, $attributes);
        FieldHelper.manageFieldRegistration($scope, $attributes, formForController);

        // Update $scope.iconAfter based on the field state (see class-level documentation for more)
        if ($attributes.iconAfter) {
          var updateIconAfter = function() {
            if (!$scope.model) {
              return;
            }

            var iconAfter =
              $attributes.iconAfter.charAt(0) === '{' ?
                $scope.$eval($attributes.iconAfter) :
                $attributes.iconAfter;

            if (angular.isObject(iconAfter)) {
              if ($scope.model.error) {
                $scope.iconAfter = iconAfter.invalid;
              } else if ($scope.model.pristine) {
                $scope.iconAfter = iconAfter.pristine;
              } else {
                $scope.iconAfter = iconAfter.valid;
              }
            } else {
              $scope.iconAfter = iconAfter;
            }
          };

          $attributes.$observe('iconAfter', updateIconAfter);
          $scope.$watch('model.error', updateIconAfter);
          $scope.$watch('model.pristine', updateIconAfter);
        }

        // Update $scope.iconBefore based on the field state (see class-level documentation for more)
        if ($attributes.iconBefore) {
          var updateIconBefore = function() {
            if (!$scope.model) {
              return;
            }

            var iconBefore =
              $attributes.iconBefore.charAt(0) === '{' ?
                $scope.$eval($attributes.iconBefore) :
                $attributes.iconBefore;

            if (angular.isObject(iconBefore)) {
              if ($scope.model.error) {
                $scope.iconBefore = iconBefore.invalid;
              } else if ($scope.model.pristine) {
                $scope.iconBefore = iconBefore.pristine;
              } else {
                $scope.iconBefore = iconBefore.valid;
              }
            } else {
              $scope.iconBefore = iconBefore;
            }
          };

          $attributes.$observe('iconBefore', updateIconBefore);
          $scope.$watch('model.error', updateIconBefore);
          $scope.$watch('model.pristine', updateIconBefore);
        }

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
        $scope.onBlur = function() {
          if ($attributes.hasOwnProperty('blurred')) {
            $scope.blurred();
          }
        };
      }
    };
  });

angular.module("formFor.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("form-for/templates/checkbox-field.html","<div  class=\"field checkbox-field\"\n      ng-class=\"{disabled: disable || model.disabled, \'has-error\': model.error}\">\n\n  <p ng-if=\"model.error\" class=\"text-danger field-error left-aligned\" ng-bind=\"model.error\"></p>\n\n  <label>\n    <div class=\"checkbox-field-input\" ng-class=\"{\'is-checked\': model.bindable}\"></div>\n\n    <input  type=\"checkbox\" ng-model=\"model.bindable\"\n            class=\"field-input\"\n            ng-disabled=\"disable || model.disabled\">\n\n    <field-label  ng-if=\"label\"\n                  label=\"{{label}}\"\n                  help=\"{{help}}\"\n                  ng-click=\"toggle()\">\n    </field-label>\n  </label>\n</div>\n");
$templateCache.put("form-for/templates/field-label.html","<label  class=\"field-label\"\n        popover=\"{{help}}\"\n        popover-trigger=\"mouseenter\"\n        popover-placement=\"right\">\n\n  <span ng-bind-html=\"bindableLabel\"></span>\n\n  <span ng-if=\"help\" class=\"fa-stack help-icon-stack\">\n    <i class=\"fa fa-stack-2x fa-circle help-background-icon\"></i>\n    <i class=\"fa fa-stack-1x fa-inverse fa-question help-foreground-icon\"></i>\n  </span>\n\n  <span class=\"label label-default field-label-required-label\" ng-if=\"requiredLabel\" ng-bind=\"requiredLabel\"></span>\n</label>\n");
$templateCache.put("form-for/templates/radio-field.html","<span class=\"field radio-field\"\n      ng-class=\"{disabled: disable || model.disabled, \'has-error\': model.error}\">\n\n  <p ng-if=\"model.error\" class=\"text-danger field-error left-aligned\" ng-bind=\"model.error\"></p>\n\n  <label>\n    <span  class=\"radio-field-input\" ng-class=\"{\'is-selected\': model.bindable === value}\"\n          ng-click=\"click()\"></span>\n\n    <input  type=\"radio\" ng-model=\"model.bindable\" ng-value=\"value\"\n            class=\"field-input\"\n            ng-disabled=\"disable || model.disabled\">\n\n    <field-label  ng-if=\"label\"\n                  label=\"{{label}}\"\n                  help=\"{{help}}\"\n                  ng-click=\"click()\">\n    </field-label>\n  </label>\n</span>\n");
$templateCache.put("form-for/templates/select-field.html","<div  class=\"form-group field select-field\"\n      ng-class=\"{disabled: disable || model.disabled, open: isOpen, \'has-error\': model.error}\">\n\n  <field-label  ng-if=\"label\"\n                label=\"{{label}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <p ng-if=\"model.error\" class=\"text-danger field-error\" ng-bind=\"model.error\"></p>\n\n  <div  class=\"form-control select-field-toggle-button\"\n        ng-class=\"{open: isOpen, disabled: disable || model.disabled}\">\n\n    <span ng-if=\"selectedOptionLabel\" ng-bind=\"selectedOptionLabel\"></span>\n\n    <span ng-if=\"!selectedOptionLabel\">\n      <span ng-if=\"placeholder\" ng-bind=\"placeholder\"></span>\n      <span ng-if=\"!placeholder\">Select</span>\n    </span>\n\n    <span class=\"fa fa-caret-down pull-right select-field-toggle-caret\"></span>\n  </div>\n\n  <div ng-show=\"isOpen\" class=\"list-group-container\">\n    <div class=\"list-group\">\n      <div  ng-show=\"enableFiltering\" class=\"input-group filter-input-group\"\n            ng-click=\"$event.stopPropagation()\">\n        <input  type=\"text\"\n                class=\"form-control text-field-input filter-text-input\"\n                ng-model=\"filter\"\n                ng-keydown=\"keyDown($event)\"\n                form-for-debounce=\"{{filterDebounce}}\" />\n\n        <span class=\"input-group-addon input-group-addon-after\">\n          <i class=\"fa fa-search text-field-icon\"></i>\n        </span>\n      </div>\n\n      <div class=\"list-group-scrollable\">\n        <a  class=\"list-group-item\"\n            ng-repeat=\"option in filteredOptions\"\n            ng-value=\"option[valueAttribute]\"\n            ng-click=\"selectOption(option)\"\n            ng-mouseenter=\"mouseOver($index)\"\n            ng-class=\"{active: option === selectedOption, hover: $index === mouseOverIndex}\">\n\n          <!-- Bootstrap leaves us no way to style a non-:hover element so we fall back to <strong> -->\n          <strong ng-if=\"$index === mouseOverIndex\" ng-bind=\"option[labelAttribute]\"></strong>\n          <span ng-if=\"$index !== mouseOverIndex\" ng-bind=\"option[labelAttribute]\"></span>\n          <spgn ng-if=\"!option[labelAttribute]\">&nbsp;</spgn> <!-- Gracefully handle empty/null names -->\n        </a>\n\n        <a ng-if=\"!options\" class=\"list-group-item\">\n          <i class=\"fa fa-circle-o-notch fa-spin\"></i>\n          Loading...\n        </a>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("form-for/templates/submit-button.html","<button class=\"btn btn-default submit-button\" ng-disabled=\"disable || disabledByForm\">\n  <i ng-if=\"icon\" class=\"submit-button-icon\" ng-class=\"icon\"></i>\n\n  <span ng-bind-html=\"bindableLabel\"></span>\n</button>\n");
$templateCache.put("form-for/templates/text-field.html","<div  class=\"form-group field text-field\"\n      ng-class=\"{disabled: disable || model.disabled, \'has-error\': model.error}\">\n\n  <field-label  ng-if=\"label\"\n                label=\"{{label}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <p ng-if=\"model.error\" class=\"text-danger field-error\" ng-bind=\"model.error\"></p>\n\n  <div ng-class=\"{\'input-group\': iconBefore || iconAfter}\">\n    <span ng-if=\"iconBefore\" class=\"input-group-addon input-group-addon-before\"\n          ng-click=\"onIconBeforeClick()\">\n      <i class=\"text-field-icon\" ng-class=\"iconBefore\"></i>\n    </span>\n\n    <input  ng-if=\"!multiline\"\n            type=\"{{type}}\"\n            class=\"form-control text-field-input\"\n            ng-class=\"{\'has-icon-before\': iconBefore, \'has-icon-after\': iconAfter}\"\n            ng-disabled=\"disable || model.disabled\"\n            placeholder=\"{{placeholder}}\"\n            ng-model=\"model.bindable\"\n            form-for-debounce=\"{{debounce}}\"\n            ng-click=\"onFocus()\" />\n\n\n    <textarea ng-if=\"multiline\"\n              class=\"form-control text-field-input\"\n              ng-class=\"{\'has-icon-before\': iconBefore, \'has-icon-after\': iconAfter}\"\n              ng-disabled=\"disable || model.disabled\"\n              placeholder=\"{{placeholder}}\"\n              ng-model=\"model.bindable\"\n              form-for-debounce=\"{{debounce}}\"\n              ng-click=\"onFocus()\">\n    </textarea>\n\n    <span ng-if=\"iconAfter\" class=\"input-group-addon input-group-addon-after\"\n          ng-click=\"onIconAfterClick()\">\n      <i class=\"text-field-icon\" ng-class=\"iconAfter\"></i>\n    </span>\n  </div>\n</div>\n");
$templateCache.put("form-for/templates/type-ahead-field.html","<div  class=\"form-group field type-ahead-field\"\n      ng-class=\"{disabled: disable || model.disabled, \'has-error\': model.error}\">\n\n  <field-label  ng-if=\"label\"\n                label=\"{{label}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <p ng-if=\"model.error\" class=\"text-danger field-error\" ng-bind=\"model.error\"></p>\n\n  <input  type=\"text\"\n          class=\"form-control type-ahead-field-input\"\n          placeholder=\"{{placeholder}}\"\n          ng-model=\"model.selectedOption\"\n          ng-change=\"changeHandler()\"\n          typeahead=\"option as option[labelAttribute] for option in filteredOptions\"\n          typeahead-wait-ms=\"debounce || 1000\">\n</div>\n");}]);
angular.module('formFor', ['formFor.templates']);

/**
 * @ngdoc Directives
 * @name checkbox-field
 *
 * @description
 * Renders a checkbox &lt;input&gt; with optional label.
 * This type of component is well-suited for boolean attributes.
 *
 * @param {String} attribute Name of the attribute within the parent form-for directive's model object.
 * This attributes specifies the data-binding target for the input.
 * Dot notation (ex "address.street") is supported.
 * @param {Boolean} disable Disable input element.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * @param {String} help Optional help tooltip to display on hover.
 * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} label Optional field label displayed after the checkbox input.
 * (Although not required, it is strongly suggested that you specify a value for this attribute.) HTML is allowed for this attribute.
 *
 * @example
 * // To display a simple TOS checkbox you might use the following markup:
 * <checkbox-field label="I agree with the TOS"
 *                 attribute="accepted">
 * </checkbox-field>
 */
angular.module('formFor').directive('checkboxField',
  ["$log", "FieldHelper", function($log, FieldHelper) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/checkbox-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        help: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.model = formForController.registerFormField($scope.attribute);
        $scope.label = FieldHelper.getLabel($attributes, $scope.attribute);

        var $input = $element.find('input');

        $scope.toggle = function toggle() {
          if (!$scope.disable && !$scope.model.disabled) {
            $scope.model.bindable = !$scope.model.bindable;
          }
        };
      }
    };
  }]);

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
  ["$sce", "FormForConfiguration", function( $sce, FormForConfiguration ) {
    return {
      restrict: 'EA',
      templateUrl: 'form-for/templates/field-label.html',
      scope: {
        help: '@?',
        label: '@',
        required: '@?'
      },
      controller: ["$scope", function($scope) {
        $scope.$watch('label', function(value) {
          $scope.bindableLabel = $sce.trustAsHtml(value);
        });

        if ($scope.required) {
          $scope.requiredLabel = FormForConfiguration.requiredLabel;
        }
      }]
    };
  }]);

/**
 * @ngdoc Directives
 * @name form-for-debounce
 *
 * @description
 * Angular introduced debouncing (via ngModelOptions) in version 1.3.
 * As of the time of this writing, that version is still in beta.
 * This component adds debouncing behavior for Angular 1.2.x.
 * It is primarily intended for use with &lt;input type=text&gt; and &lt;textarea&gt; elements.
 *
 * @param {int} formForDebounce Debounce duration in milliseconds.
 * By default this value is 1000ms.
 * To disable the debounce interval (aka to update on blur only) a value of false should be specified.
 *
 * @example
 * // To configure this component to debounce with a 2 second delay:
 * <input type="text"
 *        ng-model="username"
 *        form-for-debounce="2000" />
 *
 * // To disable the debounce interval and configure an input to update only on blur:
 * <input type="text"
 *        ng-model="username"
 *        form-for-debounce="false" />
 */
angular.module('formFor').directive('formForDebounce', ["$log", "$timeout", "FormForConfiguration", function($log, $timeout, FormForConfiguration) {
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: 99,
    link: function($scope, $element, attributes, ngModelController) {
      if (attributes.type === 'radio' || attributes.type === 'checkbox') {
        $log.warn('formForDebounce should only be used with <input type=text> and <textarea> elements');

        return;
      }

      var durationAttribute = attributes.formForDebounce;
      var duration = FormForConfiguration.defaultDebounceDuration;
      var debounce;

      // Debounce can be configured for blur-only by passing a value of 'false'.
      if (durationAttribute !== undefined) {
        if (durationAttribute.toString() === 'false') {
          duration = false;
        } else {
          durationAttribute = parseInt(durationAttribute);

          if (angular.isNumber(durationAttribute) && !isNaN(durationAttribute)) {
            duration = durationAttribute;
          }
        }
      }

      $element.unbind('input');

      if (duration !== false) {
        $element.bind('input', function() {
          $timeout.cancel(debounce);

          debounce = $timeout(function() {
            $scope.$apply(function() {
              ngModelController.$setViewValue($element.val());
            });
          }, duration);
        });
      }

      $element.bind('blur', function() {
        $scope.$apply(function() {
          ngModelController.$setViewValue($element.val());
        });
      });

      $scope.$on('$destroy', function() {
        if (debounce) {
          $timeout.cancel(debounce);
        }
      });
    }
  };
}]);

/**
 * @ngdoc Directives
 * @name form-for
 * @description
 * This directive should be paired with an Angular ngForm object and should contain at least one of the formFor field types described below.
 * At a high level, it operates on a bindable form-data object and runs validations each time a change is detected.
 *
 * @param {Object} controller Two way bindable attribute exposing access to the formFor controller API.
 * See below for an example of how to use this binding to access the controller.
 * @param {Boolean} disable Form is disabled.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * This attribute is 2-way bindable.
 * @param {Object} formFor An object on $scope that formFor should read and write data to.
 * To prevent accidentally persisting changes to this object after a cancelled form, it is recommended that you bind to a copied object.
 * For more information refer to angular.copy.
 * @param {String} service Convenience mehtod for identifying an $injector-accessible model containing both the validation rules and submit function.
 * Validation rules should be accessible via an attribute named validationRules and the submit function should be named submit.
 * @param {Function} submitComplete Custom handler to be invoked upon a successful form submission.
 * Use this to display custom messages or do custom routing after submit.
 * This method should accept a "data" parameter.
 * See below for an example.
 * (To set a global, default submit-with handler see FormForConfiguration.)
 * @param {Function} submitError Custom error handler function.
 * This function should accept an "error" parameter.
 * See below for an example.
 * (To set a global, default submit-with handler see FormForConfiguration.)
 * @param {Function} submitWith Function triggered on form-submit.
 * This function should accept a named parameter data (the model object) and should return a promise to be resolved/rejected based on the result of the submission.
 * In the event of a rejection, the promise can return an error string or a map of field-names to specific errors.
 * See below for an example.
 * @param {Object} validationRules Set of client-side validation rules (keyed by form field names) to apply to form-data before submitting.
 * For more information refer to the Validation Types page.
 */
angular.module('formFor').directive('formFor',
  ["$injector", "$parse", "$q", "$sce", "FormForConfiguration", "$FormForStateHelper", "NestedObjectHelper", "ModelValidator", function($injector, $parse, $q, $sce, FormForConfiguration, $FormForStateHelper, NestedObjectHelper, ModelValidator) {
    return {
      require: 'form',
      restrict: 'A',
      scope: {
        controller: '=?',
        disable: '=?',
        errorMap: '=?',
        formFor: '=',
        service: '@',
        submitComplete: '&?',
        submitError: '&?',
        submitWith: '&?',
        valid: '=?',
        validationRules: '=?'
      },
      controller: ["$scope", function($scope) {

        // Map of safe (bindable, $scope.$watch-able) field names to objects containing the following keys:
        // • bindableWrapper: Shared between formFor and field directives. Returned by registerFormField(). Contains:
        //   • bindable: Used for easier 2-way data binding between formFor and input field
        //   • disabled: Field should be disabled (generally because form-submission is in progress)
        //   • error: Field should display the following validation error message
        //   • required: Informs the field's label if it should show a "required" marker
        // • fieldName: Original field name
        // • unwatchers: Array of unwatch functions to be invoked on field-unregister
        // • validationAttribute: Maps field name to the location of field validation rules
        //
        // A note on safe field names:
        // A field like 'hobbies[0].name' might be mapped to something like 'hobbies__0__name' so that we can safely $watch it.
        $scope.fields = {};

        // Set of bindable wrappers used to disable buttons when form-submission is in progress.
        // Wrappers contain the following keys:
        //   • disabled: Button should be disabled (generally because form-submission is in progress)
        //
        // Note that there is no current way to associate a wrapper with a button.
        $scope.buttons = [];

        if ($scope.service) {
          $scope.$service = $injector.get($scope.service);
        }

        // Validation rules can come through 2 ways:
        // As part of the validation service or as a direct binding.
        if ($scope.$service) {
          $scope.$validationRules = $scope.$service.validationRules;
        } else {
          $scope.$validationRules = $scope.validationRules;
        }

        // Attaching controller methods to a 'controller' object instead of 'this' results in prettier JSDoc display.
        var controller = this;

        /**
         * All form-input children of formFor must register using this function.
         * @memberof form-for
         * @param {String} fieldName Unique identifier of field within model; used to map errors back to input fields
         * @return {Object} Object containing keys to be observed by the input field:
         * • bindable: Input should 2-way bind against this attribute in order to sync data with formFor.
         * • disabled: Input should disable itself if this value becomes true; typically this means the form is being submitted.
         * • error: Input should display the string contained in this field (if one exists); this means the input value is invalid.
         * • required: Input should display a 'required' indicator if this value is true.
         */
        controller.registerFormField = function(fieldName) {
          var bindableFieldName = NestedObjectHelper.flattenAttribute(fieldName);
          var rules = NestedObjectHelper.readAttribute($scope.$validationRules, fieldName);

          // Store information about this field that we'll need for validation and binding purposes.
          // @see Above documentation for $scope.fields
          var fieldDatum = {
            bindableWrapper: {
              bindable: null,
              disabled: false,
              error: null,
              required: ModelValidator.isFieldRequired(fieldName, $scope.validationRules)
            },
            fieldName: fieldName,
            unwatchers: [],
            validationAttribute: fieldName.split('[')[0]
          };

          $scope.fields[bindableFieldName] = fieldDatum;

          var getter = $parse(fieldName);
          var setter = getter.assign;

          console.log('• watching: fields.' + bindableFieldName + '.bindableWrapper.bindable');
          // Changes made by our field should be synced back to the form-data model.
          fieldDatum.unwatchers.push(
            $scope.$watch('fields.' + bindableFieldName + '.bindableWrapper.bindable', function(newValue, oldValue) {
              console.log('•• triggered: fields.' + bindableFieldName + '.bindableWrapper.bindable ~>',newValue);
              if (newValue !== oldValue) {
                setter($scope.formFor, newValue);
              }
            }));

          var formDataWatcherInitialized;

          console.log('• watching: formFor.' + fieldName);
          // Changes made to the form-data model should likewise be synced to the field's bindable model.
          // (This is necessary for data that is loaded asynchronously after a form has already been displayed.)
          fieldDatum.unwatchers.push(
            $scope.$watch('formFor.' + fieldName, function(newValue, oldValue) {
              console.log('•• triggered: formFor.' + fieldName,'~>',newValue);
              fieldDatum.bindable = getter($scope.formFor);

              // Changes in form-data should also trigger validations.
              // Validation failures will not be displayed unless the form-field has been marked dirty (changed by user).
              // We shouldn't mark our field as dirty when Angular auto-invokes the initial watcher though,
              // So we ignore the first invocation...
              if (!formDataWatcherInitialized) {
                formDataWatcherInitialized = true;

              // If formFor was binded with an empty object, ngModel will auto-initialize keys on blur.
              // We shouldn't treat this as a user-edit though unless the user actually typed something.
              // It's possible they typed and then erased, but that seems less likely.
              // So we also shouldn't mark as dirty unless a truthy value has been provided.
              } else if (oldValue !== undefined || newValue !== '') {
                $scope.formForStateHelper.setFieldHasBeenModified(bindableFieldName, true);
              }

              // Run validations and store the result keyed by our bindableFieldName for easier subsequent lookup.
              if ($scope.$validationRules) {
                console.log('•• validating field:', fieldName);
                ModelValidator.validateField(
                    $scope.formFor,
                    fieldName,
                    $scope.$validationRules
                  ).then(
                      function() {
                        $scope.formForStateHelper.setFieldError(bindableFieldName, null);
                      },
                      function(error) {
                        console.log('•• field error:',error);
                        $scope.formForStateHelper.setFieldError(bindableFieldName, error);
                      });
              }
            }));

          return fieldDatum.bindableWrapper;
        };

        /**
         * Form fields created within ngRepeat or ngIf directive should clean up themselves on removal.
         * @memberof form-for
         * @param {String} fieldName Unique identifier of field within model; used to map errors back to input fields
         */
        this.unregisterFormField = function(fieldName) {
          var bindableFieldName = NestedObjectHelper.flattenAttribute(fieldName);

          angular.foreach(
            $scope.fields[bindableFieldName].unwatchers,
            function(unwatch) {
              unwatch();
            });
        };

        /**
         * All submitButton children must register with formFor using this function.
         * @memberof form-for
         * @param {$scope} submitButtonScope $scope of submit button directive
         * @return {Object} Object containing keys to be observed by the input button:
         * • disabled: Button should disable itself if this value becomes true; typically this means the form is being submitted.
         */
        controller.registerSubmitButton = function(submitButtonScope) {
          var bindableWrapper = {
            disabled: false
          };

          $scope.buttons.push(bindableWrapper);

          return bindableWrapper;
        };

        /**
         * Resets errors displayed on the <form> without resetting the form data values.
         * @memberof form-for
         */
        controller.resetErrors = function() {
          $scope.formForStateHelper.setFormSubmitted(false);

          var keys = NestedObjectHelper.flattenObjectKeys($scope.errorMap);

          angular.forEach(keys, function(fieldName) {
            $scope.formForStateHelper.setFieldHasBeenModified(fieldName, false);
          });
        };

        // Expose controller methods to the $scope.controller interface
        $scope.controller = $scope.controller || {};
        $scope.controller.registerFormField = this.registerFormField;
        $scope.controller.registerSubmitButton = this.registerSubmitButton;
        $scope.controller.resetErrors = this.resetErrors;
        $scope.controller.unregisterFormField = this.unregisterFormField;

        // Disable all child inputs if the form becomes disabled.
        $scope.$watch('disable', function(value) {
          angular.forEach($scope.fields, function(field) {
            field.bindableWrapper.disabled = value;
          });

          angular.forEach($scope.buttons, function(wrapper) {
            wrapper.disabled = value;
          });
        });

        // Track field validity and dirty state.
        $scope.formForStateHelper = new $FormForStateHelper($scope);

        // Watch for any validation changes or changes in form-state that require us to notify the user.
        // Rather than using a deep-watch, FormForStateHelper exposes a bindable attribute 'watchable'.
        // This attribute is gauranteed to change whenever validation criteria change (but its value is meaningless).
        $scope.$watch('formForStateHelper.watchable', function() {
          var hasFormBeenSubmitted = $scope.formForStateHelper.hasFormBeenSubmitted();

          angular.forEach($scope.fields, function(fieldDatum, bindableFieldName) {
            console.log('• watchable changed, checking:',bindableFieldName);
            if (hasFormBeenSubmitted || $scope.formForStateHelper.hasFieldBeenModified(bindableFieldName)) {
              var error = $scope.formForStateHelper.getFieldError(bindableFieldName);
              console.log('•• error:',error);

              fieldDatum.bindableWrapper.error = error ? $sce.trustAsHtml(error) : null;
            } else {
              fieldDatum.bindableWrapper.error = null; // Clear out field errors in the event that the form has been reset.
            }
          });
        });

        /*
         * Update all registered form fields with the specified error messages.
         * Specified map should be keyed with fieldName and should container user-friendly error strings.
         * @param {Object} errorMap Map of field names (or paths) to errors
         */
        $scope.updateErrors = function(errorMap) {
          angular.forEach($scope.fields, function(scope, bindableFieldName) {
            var error = NestedObjectHelper.readAttribute(errorMap, bindableFieldName);

            $scope.formForStateHelper.setFieldError(bindableFieldName, error);
          });
        };

        /*
         * Validate all registered fields and update FormForStateHelper's error mapping.
         * This update indirectly triggers form validity check and inline error message display.
         */
        $scope.validateAll = function() {
          $scope.updateErrors({}); // Reset errors before starting new validation.

          var validationPromise;

          if ($scope.$validationRules) {
            var validationKeys = [];

            angular.forEach($scope.fields, function(field) {

              // Only validate collections once
              if (validationKeys.indexOf(field.validationAttribute) < 0) {
                validationKeys.push(field.validationAttribute);
              }
            });

            validationPromise = ModelValidator.validateFields($scope.formFor, validationKeys, $scope.$validationRules);
          } else {
            validationPromise = $q.resolve();
          }

          validationPromise.then(angular.noop, $scope.updateErrors);

          return validationPromise;
        };
      }],
      link: function($scope, $element, $attributes, controller) {
        $element.on('submit', // Override form submit to trigger overall validation.
          function() {
            $scope.formForStateHelper.setFormSubmitted(true);
            $scope.disable = true;

            $scope.validateAll().then(
              function(response) {
                var promise;

                // $scope.submitWith is wrapped with a virtual function so we must check via attributes
                if ($attributes.submitWith) {
                  promise = $scope.submitWith({data: $scope.formFor});
                } else if ($scope.$service && $scope.$service.submit) {
                  promise = $scope.$service.submit($scope.formFor);
                } else {
                  promise = $q.reject('No submit function provided');
                }

                // Issue #18 Guard against submit functions that don't return a promise by warning rather than erroring.
                if (!promise) {
                  promise = $q.reject('Submit function did not return a promise');
                }

                promise.then(
                  function(response) {
                    // $scope.submitComplete is wrapped with a virtual function so we must check via attributes
                    if ($attributes.submitComplete) {
                      $scope.submitComplete({data: response});
                    } else {
                      FormForConfiguration.defaultSubmitComplete(response);
                    }
                  },
                  function(errorMessageOrErrorMap) {
                    // If the remote response returned inline-errors update our error map.
                    // This is unecessary if a string was returned.
                    if (angular.isObject(errorMessageOrErrorMap)) {
                      $scope.updateErrors(errorMessageOrErrorMap);
                    }

                    // $scope.submitError is wrapped with a virtual function so we must check via attributes
                    if ($attributes.submitError) {
                      $scope.submitError({error: errorMessageOrErrorMap});
                    } else {
                      FormForConfiguration.defaultSubmitError(errorMessageOrErrorMap);
                    }
                  });
                promise['finally'](
                  function() {
                    $scope.disable = false;
                  });
              },
              function() {
                $scope.disable = false;
              });

          return false;
        });
      }
    };
  }]);

/**
 * @ngdoc Directives
 * @name radio-field
 *
 * @description
 * Renders a radio &lt;input&gt; with optional label.
 * This type of component is well-suited for small enumerations.
 *
 * @param {String} attribute Name of the attribute within the parent form-for directive's model object.
 * This attributes specifies the data-binding target for the input.
 * Dot notation (ex "address.street") is supported.
 * @param {Boolean} disable Disable input element.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * @param {String} help Optional help tooltip to display on hover.
 * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} label Optional field label displayed after the radio input.
 * (Although not required, it is strongly suggested that you specify a value for this attribute.)
 * HTML is allowed for this attribute
 * @param {Object} Value to be assigned to model if this radio component is selected.
 *
 * @example
 * // To render a radio group for gender selection you might use the following markup:
 * <radio-field label="Female" attribute="gender" value="f"></radio-field>
 * <radio-field label="Male" attribute="gender" value="m"></radio-field>
 */
angular.module('formFor').directive('radioField',
  ["$log", "FieldHelper", function($log, FieldHelper) {
    var nameToActiveRadioMap = {};

    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/radio-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        help: '@?',
        value: '@'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        if (!nameToActiveRadioMap[$scope.attribute]) {
          nameToActiveRadioMap[$scope.attribute] = {
            defaultScope: $scope,
            scopes: [],
            model: formForController.registerFormField($scope.attribute)
          };
        }

        // TODO How to handle errors?
        // Main scope should listen and bucket brigade to others!

        var activeRadio = nameToActiveRadioMap[$scope.attribute];
        activeRadio.scopes.push($scope);

        $scope.model = activeRadio.model;
        $scope.label = FieldHelper.getLabel($attributes, $scope.value);

        var $input = $element.find('input');

        $scope.click = function() {
          if (!$scope.disable && !$scope.model.disabled) {
            $scope.model.bindable = $scope.value;
          }
        };

        activeRadio.defaultScope.$watch('disable', function(value) {
          $scope.disable = value;
        });
        activeRadio.defaultScope.$watch('model.disabled', function(value) {
          $scope.model.disabled = value;
        });

        $scope.$watch('model.bindable', function(newValue, oldValue) {
          if (newValue === $scope.value) {
            $input.attr('checked', true);
          } else {
            $input.removeAttr('checked');
          }
        });

        $scope.$on('$destroy', function() {
          activeRadio.scopes.splice(
            activeRadio.scopes.indexOf($scope), 1);

          if (activeRadio.scopes.length === 0) {
            delete nameToActiveRadioMap[$scope.attribute];
          }
        });
      }
    };
  }]);

/**
 * @ngdoc Directives
 * @name select-field
 * @description
 * Renders a drop-down &lt;select&gt; menu along with an input label.
 * This type of component works with large enumerations and can be configured to allow for a blank/empty selection by way of an allow-blank attribute.
 *
 * @param {attribute} allow-blank The presence of this attribute indicates that an empty/blank selection should be allowed.
 * @param {String} attribute Name of the attribute within the parent form-for directive's model object.
 * This attributes specifies the data-binding target for the input.
 * Dot notation (ex "address.street") is supported.
 * @param {Boolean} disable Disable input element.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * @param {Boolean} enableFiltering Enable filtering of list via a text input at the top of the dropdown.
 * @param {String} filter Two-way bindable filter string.
 * $watch this property to load remote options based on filter text.
 * (Refer to this Plunker demo for an example.)
 * @param {String} help Optional help tooltip to display on hover.
 * By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} label Optional field label displayed before the drop-down.
 * (Although not required, it is strongly suggested that you specify a value for this attribute.) HTML is allowed for this attribute.
 * @param {String} labelAttribute Optional override for label key in options array.
 * Defaults to "label".
 * @param {Array} options Set of options, each containing a label and value key.
 * The label is displayed to the user and the value is assigned to the corresponding model attribute on selection.
 * @param {String} placeholder Optional placeholder text to display if no value has been selected.
 * The text "Select" will be displayed if no placeholder is provided.
 * @param {String} valueAttribute Optional override for value key in options array.
 * Defaults to "value".
 *
 * @example
 * // To use this component you'll first need to define a set of options. For instance:
 * $scope.genders = [
 *   { value: 'f', label: 'Female' },
 *   { value: 'm', label: 'Male' }
 * ];
 *
 * // To render a drop-down input using the above options:
 * <select-field attribute="gender"
 *               label="Gender"
 *               options="genders">
 * </select-field>
 *
 * // If you want to make this attribute optional you can use the allow-blank attribute as follows:
 * <select-field attribute="gender"
 *               label="Gender"
 *               options="genders"
 *               allow-blank>
 * </select-field>
 */
angular.module('formFor').directive('selectField',
  ["$document", "$log", "$timeout", "FieldHelper", function($document, $log, $timeout, FieldHelper) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/select-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        filter: '=?',
        filterDebounce: '@?',
        help: '@?',
        options: '=',
        placeholder: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.allowBlank = $attributes.hasOwnProperty('allowBlank');
        $scope.enableFiltering = $attributes.hasOwnProperty('enableFiltering');

        $scope.labelAttribute = $attributes.labelAttribute || 'label';
        $scope.valueAttribute = $attributes.valueAttribute || 'value';

        $scope.model = formForController.registerFormField($scope.attribute);
        $scope.label = FieldHelper.getLabel($attributes, $scope.attribute);

        /*****************************************************************************************
         * The following code pertains to filtering visible options.
         *****************************************************************************************/

        $scope.emptyOption = {};
        $scope.filteredOptions = [];

        var sanitize = function(value) {
          return value && value.toLowerCase();
        };

        var calculateFilteredOptions = function() {
          var options = $scope.options || [];

          $scope.filteredOptions.splice(0);

          if (!$scope.enableFiltering || !$scope.filter) {
            angular.copy(options, $scope.filteredOptions);
          } else {
            var filter = sanitize($scope.filter);

            angular.forEach(options, function(option) {
              var index = sanitize(option[$scope.labelAttribute]).indexOf(filter);

              if (index >= 0) {
                $scope.filteredOptions.push(option);
              }
            });
          }

          if ($scope.allowBlank) {
            $scope.filteredOptions.unshift($scope.emptyOption);
          }
        };

        $scope.$watch('filter', calculateFilteredOptions);
        $scope.$watch('options.length', calculateFilteredOptions);

        /*****************************************************************************************
         * The following code manages setting the correct default value based on bindable model.
         *****************************************************************************************/

        var updateDefaultOption = function() {
          var selected = $scope.selectedOption && $scope.selectedOption[[$scope.valueAttribute]];
          var matchingOption;

          if ($scope.model.bindable === selected) {
            return;
          }

          angular.forEach($scope.options,
            function(option) {
              if (option[$scope.valueAttribute] === $scope.model.bindable) {
                matchingOption = option;
              }
            });

          $scope.selectedOption = matchingOption;
          $scope.selectedOptionLabel = matchingOption && matchingOption[$scope.labelAttribute];
        };

        $scope.$watch('model.bindable', updateDefaultOption);
        $scope.$watch('options', updateDefaultOption);

        /*****************************************************************************************
         * The following code deals with toggling/collapsing the drop-down and selecting values.
         *****************************************************************************************/

        $scope.$watch('model.bindable', function(value) {
          var matchingOption;

          for (var index = 0; index < $scope.filteredOptions.length; index++) {
            var option = $scope.filteredOptions[index];

            if (option[$scope.valueAttribute] === value) {
              matchingOption = option;

              break;
            }
          };

          $scope.selectedOption = matchingOption;
          $scope.selectedOptionLabel = matchingOption && matchingOption[$scope.labelAttribute];
        });

        var oneClick = function(target, handler) {
          $timeout(function() { // Delay to avoid processing the same click event that trigger the toggle-open
            target.one('click', handler);
          }, 1);
        };

        var removeClickWatch = function() {
          $document.off('click', clickWatcher);
        };

        var addClickToOpen = function() {
          oneClick($element.find('.select-field-toggle-button'), clickToOpen);
        };

        $scope.selectOption = function(option) {
          $scope.model.bindable = option && option[$scope.valueAttribute];
          $scope.isOpen = false;

          removeClickWatch();

          addClickToOpen();
        };

        var clickWatcher = function(event) {
          $scope.isOpen = false;
          $scope.$apply();

          removeClickWatch();

          addClickToOpen();
        };

        var scroller = $element.find('.list-group-container');
        var list = $element.find('.list-group');

        var clickToOpen = function() {
          if ($scope.disable || $scope.model.disabled) {
            addClickToOpen();

            return;
          }

          $scope.isOpen = !$scope.isOpen;

          if ($scope.isOpen) {
            // TODO Determine whether to open downward or upward
            // TODO Auto-focus input field if filterable

            oneClick($document, clickWatcher);

            var value = $scope.model.bindable;

            $timeout(
              angular.bind(
                this,
                function() {
                  var listItems = list.find('.list-group-item');
                  var matchingListItem;

                  for (var index = 0; index < listItems.length; index++) {
                    var listItem = listItems[index];
                    var option = $(listItem).scope().option;

                    if (option && option[$scope.valueAttribute] === value) {
                      matchingListItem = listItem;

                      break;
                    }
                  }

                  if (matchingListItem) {
                    scroller.scrollTop(
                      $(matchingListItem).offset().top - $(matchingListItem).parent().offset().top);
                  }
                }), 1);
          }
        };

        addClickToOpen();

        /*****************************************************************************************
         * The following code responds to keyboard events when the drop-down is visible
         *****************************************************************************************/

        $scope.mouseOver = function(index) {
          $scope.mouseOverIndex = index;
          $scope.mouseOverOption = index >= 0 ? $scope.filteredOptions[index] : null;
        };

        // Listen to key down, not up, because ENTER key sometimes gets converted into a click event.
        $scope.keyDown = function(event) {
          switch (event.keyCode) {
            case 27: // Escape key
              $scope.isOpen = false;
              break;
            case 13: // Enter key
              $scope.selectOption($scope.mouseOverOption);
              $scope.isOpen = false;

              // Don't bubble up and submit the parent form
              event.preventDefault();
              event.stopPropagation();
              break;
            case 38: // Up arrow
              $scope.mouseOver( $scope.mouseOverIndex > 0 ? $scope.mouseOverIndex - 1 : $scope.filteredOptions.length - 1 );
              break;
            case 40: // Down arrow
              $scope.mouseOver( $scope.mouseOverIndex < $scope.filteredOptions.length - 1 ? $scope.mouseOverIndex + 1 : 0 );
              break;
          }
        };

        $scope.$watchCollection('[isOpen, filteredOptions.length]', function() {
          $scope.mouseOver(-1); // Reset hover anytime our list opens/closes or our collection is refreshed.
        });

        $scope.$on('$destroy', function() {
          removeClickWatch();
        });
      }
    };
  }]);

/**
 * @ngdoc Directives
 * @name submit-button
 *
 * @description
 * Displays a submit &lt;button&gt; component that is automatically disabled when a form is invalid or in the process of submitting.
 *
 * @param {String} class Optional CSS class names to apply to button component.
 * @param {Boolean} disable Disable button.
 * (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * @param {String} icon Optional CSS class to display as a button icon.
 * @param {String} label Button label.
 * HTML is allowed for this attribute.
 *
 * @example
 * // Here is a simple submit button with an icon:
 * <submit-button label="Sign Up" icon="fa fa-user"></submit-button>
 *
 * // You can use your own <button> components within a formFor as well.
 * // If you choose to, it is recommended that you bind your buttons disabled attribute to a disabledByForm scope property (managed by formFor) as follows:
 * <form form-for="formData">
 *   <button ng-disabled="disabledByForm">Submit</button>
 * </form>
 */
angular.module('formFor').directive('submitButton',
  ["$log", "$sce", function($log, $sce) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/submit-button.html',
      scope: {
        disable: '@',
        icon: '@',
        label: '@'
      },
      link: function($scope, $element, $attributes, formForController) {
        $scope['class'] = $attributes['class'];

        $scope.$watch('label', function(value) {
          $scope.bindableLabel = $sce.trustAsHtml(value);
        });

        formForController.registerSubmitButton($scope);
      }
    };
  }]);

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
  ["$log", "$timeout", "FieldHelper", function($log, $timeout, FieldHelper) {
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
      }
    };
  }]);

/**
 * @ngdoc Directives
 * @name checkbox-field
 *
 * @description
 * Displays a HTML <input> element with type-ahead functionality.
 * This component requires the Angular Bootstrap library as a dependency.
 * This directive can be configured to optionally display an informational tooltip.
 * In the event of a validation error, this directive will also render an inline error message.
 *
 * @param {String} attribute Name of the attribute within the parent form-for directive's model object. This attributes specifies the data-binding target for the input. Dot notation (ex "address.street") is supported.
 * @param {attribute} autofocus The presence of this attribute will auto-focus the input field.
 * @param {int} debounce Debounce duration (in ms) before input text is applied to model and evaluated. To disable debounce (update only on blur) specify a value of false. This value's default is determined by FormForConfiguration.
 * @param {Boolean} disable Disable input element. (Note the name is disable and not disabled to avoid collisions with the HTML5 disabled attribute).
 * @param {String} filter Two-way bindable filter string. $watch this property to load remote options based on filter text. (Refer to this Plunker demo for an example.)
 * @param {String} help Optional help tooltip to display on hover. By default this makes use of the Angular Bootstrap tooltip directive and the Font Awesome icon set.
 * @param {String} label Optional field label displayed before the input. (Although not required, it is strongly suggested that you specify a value for this attribute.) HTML is allowed for this attribute.
 * @param {String} labelAttribute Optional override for label key in options array. Defaults to "label".
 * @param {Array} options Set of options, each containing a label and value key. The label is displayed to the user and the value is assigned to the corresponding model attribute on selection.
 * @param {String} placeholder Optional placeholder text to display if input is empty.
 * @param {String} valueAttribute Optional override for value key in options array. Defaults to "value".
 *
 * @example
 * // To render a type-ahead field that filters data specified via options:
 * <type-ahead-field label="State"
 *                   attribute="state"
 *                   options="states"
 *                   placeholder="Choose a state">
 * </type-ahead-field>
 *
 * // To reload remote data based on filter text, bind to the filter attribute as follows:
 * <type-ahead-field label="State"
 *                   attribute="state"
 *                   options="states"
 *                   placeholder="Choose a state"
 *                   filter="filterText">
 * </type-ahead-field>
 *
 * $scope.$watch('filterText', function(value) {
 *   // Load remote data and update $scope.states collection
 * });
 */
angular.module('formFor').directive('typeAheadField',
  ["$log", "$filter", "$timeout", "FieldHelper", "FormForConfiguration", function($log, $filter, $timeout, FieldHelper, FormForConfiguration) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/type-ahead-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        filter: '=?',
        help: '@?',
        options: '=',
        placeholder: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        if ($attributes.hasOwnProperty('autofocus')) {
          $timeout(function() {
            $element.find('input').focus();
          });
        }

        $scope.debounce = $attributes.debounce || FormForConfiguration.defaultDebounceDuration;
        $scope.labelAttribute = $attributes.labelAttribute || 'label';
        $scope.valueAttribute = $attributes.valueAttribute || 'value';

        // Typeahead doesn't handle null values very well so we need to guard against that.
        // See https://github.com/angular-ui/bootstrap/pull/2361
        $scope.filteredOptions = $scope.options || [];

        // Watch filter text changes and notify external listener in case data is loaded remotely.
        $scope.changeHandler = function() {
          $scope.filter = $element.find('input').val();
        };

        var updateFilteredOptions = function() {
          var array = $scope.options || [];

          var expression = {};
          expression[$scope.labelAttribute] = $scope.filter;

          $scope.filteredOptions = $filter('filter')(array, expression);
        };

        $scope.$watch('filter', updateFilteredOptions);
        $scope.$watch('options', updateFilteredOptions);

        $scope.model = formForController.registerFormField($scope.attribute);
        $scope.label = FieldHelper.getLabel($attributes, $scope.attribute);

        // Incoming model values should control the type-ahead field's default value.
        // In this case we need to match the model *value* with the corresponding option (Object).
        var updateDefaultOption = function() {
          var selected = $scope.model.selectedOption && $scope.model.selectedOption[[$scope.valueAttribute]];
          var matched;

          if ($scope.model.bindable === selected) {
            return;
          }

          angular.forEach($scope.options,
            function(option) {
              if (option[$scope.valueAttribute] === $scope.model.bindable) {
                matched = option;
              }
            });

          $scope.model.selectedOption = matched;
        };

        $scope.$watch('model.bindable', updateDefaultOption);
        $scope.$watch('options', updateDefaultOption);

        var initialized;

        // Type-ahead directive doesn't support "option[valueAttribute] as option[labelAttribute]" syntax,
        // So we have to massage the data into the correct format for our parent formFor.
        $scope.$watch('model.selectedOption', function(option, oldOption) {
          if (!initialized) {
            initialized = true;

            return;
          }

          $scope.model.bindable = option && option[$scope.valueAttribute];
        });
      }
    };
  }]);

/**
 * @ngdoc Services
 * @name FieldHelper
 * @description
 * Various helper methods for functionality shared between formFor field directives.
 */
angular.module('formFor').service('FieldHelper',
  ["FormForConfiguration", "StringUtil", function(FormForConfiguration, StringUtil) {

    /**
     * Determines the field's label based on its current attributes and the FormForConfiguration configuration settings.
     * @memberof FieldHelper
     * @param {Hash} $attributes Directive link $attributes
     * @param {Object} valueToHumanize Default value (if no override specified on $attributes)
     * @returns {String} Label to display (or null if no label)
     */
    this.getLabel = function($attributes, valueToHumanize) {
      if ($attributes.hasOwnProperty('label')) {
        return $attributes.label;
      }

      if (FormForConfiguration.autoGenerateLabels) {
        return StringUtil.humanize(valueToHumanize);
      }
    }
  }]);

/**
 * @ngdoc Services
 * @name FormForConfiguration
 * @description
 * This service can be used to configure default behavior for all instances of formFor within a project.
 * Note that it is a service accessible to during the run loop and not a provider accessible during config.
 */
angular.module('formFor').service('FormForConfiguration',
  function() {
    return {

      autoGenerateLabels: false,
      defaultDebounceDuration: 1000,
      defaultSubmitComplete: angular.noop,
      defaultSubmitError: angular.noop,
      requiredLabel: null,
      validationFailedForCustomMessage: 'Failed custom validation',
      validationFailedForPatternMessage: 'Invalid format',
      validationFailedForMaxCollectionSizeMessage: 'Must be fewer than {{num}} items',
      validationFailedForMaxLengthMessage: 'Must be fewer than {{num}} characters',
      validationFailedForMinCollectionSizeMessage: 'Must at least {{num}} items',
      validationFailedForMinLengthMessage: 'Must be at least {{num}} characters',
      validationFailedForRequiredMessage: 'Required field',
      validationFailedForEmailTypeMessage: 'Invalid email format',
      validationFailedForIntegerTypeMessage: 'Must be an integer',
      validationFailedForNegativeTypeMessage: 'Must be negative',
      validationFailedForNumericTypeMessage: 'Must be numeric',
      validationFailedForPositiveTypeMessage: 'Must be positive',

      /**
       * Use this method to disable auto-generated labels for formFor input fields.
       * @memberof FormForConfiguration
       */
      disableAutoLabels: function() {
        this.autoGenerateLabels = false;
      },

      /**
       * Use this method to enable auto-generated labels for formFor input fields.
       * Labels will be generated based on attribute-name for fields without a label attribute present.
       * Radio fields are an exception to this rule.
       * Their names are generated from their values.
       * @memberof FormForConfiguration
       */
      enableAutoLabels: function() {
        this.autoGenerateLabels = true;
      },

      /**
       * Sets the default debounce interval for all textField inputs.
       * This setting can be overridden on a per-input basis (see textField).
       * @memberof FormForConfiguration
       * @param {int} duration Debounce duration (in ms).
       * Defaults to 1000ms.
       * To disable debounce (update only on blur) pass false.
       */
      setDefaultDebounceDuration: function(value) {
        this.defaultDebounceDuration = value;
      },

      /**
       * Sets the default submit-complete behavior for all formFor directives.
       * This setting can be overridden on a per-form basis (see formFor).
       * @memberof FormForConfiguration
       * @param {Function} method Default handler function accepting a data parameter representing the server-response returned by the submitted form.
       * This function should accept a single parameter, the response data from the form-submit method.
       */
      setDefaultSubmitComplete: function(value) {
        this.defaultSubmitComplete = value;
      },

      /**
       * Sets the default submit-error behavior for all formFor directives.
       * This setting can be overridden on a per-form basis (see formFor).
       * @memberof FormForConfiguration
       * @param {Function} method Default handler function accepting an error parameter representing the data passed to the rejected submit promise.
       * This function should accept a single parameter, the error returned by the form-submit method.
       */
      setDefaultSubmitError: function(value) {
        this.defaultSubmitError = value;
      },

      /**
       * Sets a default label to be displayed beside each text and select input for required attributes only.
       * @memberof FormForConfiguration
       * @param {String} value Message to be displayed next to the field label (ex. "*", "required")
       */
      setRequiredLabel: function(value) {
        this.requiredLabel = value;
      },

      /**
       * Override the default error message for failed custom validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForCustomMessage: function(value) {
        this.validationFailedForCustomMessage = value;
      },

      /**
       * Override the default error message for failed max collection size validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForMaxCollectionSizeMessage: function(value) {
        this.validationFailedForMaxCollectionSizeMessage = value;
      },

      /**
       * Override the default error message for failed maxlength validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForMaxLengthMessage: function(value) {
        this.validationFailedForMaxLengthMessage = value;
      },

      /**
       * Override the default error message for failed min collection size validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForMinCollectionSizeMessage: function(value) {
        this.validationFailedForMaxCollectionSizeMessage = value;
      },

      /**
       * Override the default error message for failed minlength validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForMinLengthMessage: function(value) {
        this.validationFailedForMinLengthMessage = value;
      },

      /**
       * Override the default error message for failed pattern validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForPatternMessage: function(value) {
        this.validationFailedForPatternMessage = value;
      },

      /**
       * Override the default error message for failed required validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForRequiredMessage: function(value) {
        this.validationFailedForRequiredMessage = value;
      },

      /**
       * Override the default error message for failed type = 'email' validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForEmailTypeMessage: function(value) {
        this.validationFailedForEmailTypeMessage = value;
      },

      /**
       * Override the default error message for failed type = 'integer' validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForIntegerTypeMessage: function(value) {
        this.validationFailedForIntegerTypeMessage = value;
      },

      /**
       * Override the default error message for failed type = 'negative' validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForNegativeTypeMessage: function(value) {
        this.validationFailedForNegativeTypeMessage = value;
      },

      /**
       * Override the default error message for failed type = 'numeric' validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForNumericTypeMessage: function(value) {
        this.validationFailedForNumericTypeMessage = value;
      },

      /**
       * Override the default error message for failed type = 'positive' validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForPositiveTypeMessage: function(value) {
        this.validationFailedForPositiveTypeMessage = value;
      }
    };
  });

/*
 * Organizes state management for form-submission and field validity.
 * Intended for use only by formFor directive.
 */
angular.module('formFor').factory('$FormForStateHelper', ["NestedObjectHelper", function(NestedObjectHelper) {
  var FormForStateHelper = function($scope) {
    $scope.errorMap = $scope.errorMap || {};
    $scope.valid = true;

    this.formScope = $scope;
    this.fieldNameToModificationMap = {};
    this.formSubmitted = false;
    this.shallowErrorMap = {};

    this.watchable = 0;
  };

  FormForStateHelper.prototype.getFieldError = function(fieldName) {
    return NestedObjectHelper.readAttribute(this.formScope.errorMap, fieldName);
  };

  FormForStateHelper.prototype.hasFieldBeenModified = function(fieldName) {
    return NestedObjectHelper.readAttribute(this.fieldNameToModificationMap, fieldName);
  };

  FormForStateHelper.prototype.hasFormBeenSubmitted = function() {
    return this.formSubmitted;
  };

  FormForStateHelper.prototype.isFieldValid = function(fieldName) {
    return !getFieldError(fieldName);
  };

  FormForStateHelper.prototype.isFormInvalid = function() {
    return !this.isFormValid();
  };

  FormForStateHelper.prototype.isFormValid = function() {
    for (var prop in this.shallowErrorMap) {
      return false;
    }

    return true;
  };

  FormForStateHelper.prototype.setFieldError = function(fieldName, error) {
    var safeFieldName = NestedObjectHelper.flattenAttribute(fieldName);

    NestedObjectHelper.writeAttribute(this.formScope.errorMap, fieldName, error);

    if (error) {
      this.shallowErrorMap[safeFieldName] = error;
    } else {
      delete this.shallowErrorMap[safeFieldName];
    }

    this.formScope.valid = this.isFormValid();
    this.watchable++;
  };

  FormForStateHelper.prototype.setFieldHasBeenModified = function(fieldName, value) {
    NestedObjectHelper.writeAttribute(this.fieldNameToModificationMap, fieldName, value);

    this.watchable++;
  };

  FormForStateHelper.prototype.setFormSubmitted = function(value) {
    this.formSubmitted = value;
    this.watchable++;
  };

  return FormForStateHelper;
}]);

/**
 * @ngdoc Services
 * @name ModelValidator
 * @description
 * ModelValidator service used by formFor to determine if each field in the form-data passes validation rules.
 * This service is not intended for use outside of the formFor module/library.
 */
angular.module('formFor').service('ModelValidator',
  ["$interpolate", "$parse", "$q", "FormForConfiguration", "NestedObjectHelper", function($interpolate, $parse, $q, FormForConfiguration, NestedObjectHelper) {

    /*
     * Strip array brackets from field names so that model values can be mapped to rules.
     * For instance:
     * • 'foo[0].bar' should be validated against 'foo.collection.fields.bar'.
     */
    this.$getRulesForFieldName = function(validationRules, fieldName) {
      fieldName = fieldName.replace(/\[[^\]]+\]/g, '.collection.fields');

      return NestedObjectHelper.readAttribute(validationRules, fieldName);
    };

    /**
     * Convenience method for determining if the specified field is flagged as required.
     */
    this.isFieldRequired = function(fieldName, validationRules) {
      var rules = this.$getRulesForFieldName(validationRules, fieldName);

      return  rules &&
              rules.required &&
              (angular.isObject(rules.required) ? rules.required.rule : rules.required);
    };

    /**
     * Validates the model against all rules in the validationRules.
     * This method returns a promise to be resolved on successful validation,
     * Or rejected with a map of field-name to error-message.
     * @memberof ModelValidator
     * @param {Object} model Form-data object model is contained within
     * @param {Object} validationRules Set of named validation rules
     * @returns {Promise} To be resolved or rejected based on validation success or failure.
     */
    this.validateAll = function(model, validationRules) {
      var fields = NestedObjectHelper.flattenObjectKeys(validationRules);

      return this.validateFields(model, fields, validationRules);
    };

    /**
     * Validates the values in model with the rules defined in the current validationRules.
     * This method returns a promise to be resolved on successful validation,
     * Or rejected with a map of field-name to error-message.
     * @memberof ModelValidator
     * @param {Object} model Form-data object model is contained within
     * @param {Array} fieldNames Whitelist set of fields to validate for the given model; values outside of this list will be ignored
     * @param {Object} validationRules Set of named validation rules
     * @returns {Promise} To be resolved or rejected based on validation success or failure.
     */
    this.validateFields = function(model, fieldNames, validationRules) {
      var deferred = $q.defer();
      var promises = [];
      var errorMap = {};
      var that = this;

      angular.forEach(fieldNames, function(fieldName) {
        var rules = this.$getRulesForFieldName(validationRules, fieldName);

        if (rules) {
          var promise = that.validateField(model, fieldName, validationRules);

          promise.then(
            angular.noop,
            function(error) {
              $parse(fieldName).assign(errorMap, error);
            });

          promises.push(promise);
        }
      }, this);

      $q.waitForAll(promises).then(
        deferred.resolve,
        function() {
          deferred.reject(errorMap);
        });

      return deferred.promise;
    };

    /*
     * Helper function used to validate a basic field OR individual items within a collections field.
     * This function returns a promise.
     */
    this.$validateWithRules = function(model, value, rules) {
      value = value || '';

      if (rules.required) {
        var required = angular.isObject(rules.required) ? rules.required.rule : rules.required;

        if (!!value !== required) {
          return $q.reject(
            angular.isObject(rules.required) ?
              rules.required.message :
              FormForConfiguration.validationFailedForRequiredMessage);
        }
      }

      if (rules.minlength) {
        var minlength = angular.isObject(rules.minlength) ? rules.minlength.rule : rules.minlength;

        if (value.length < minlength) {
          return $q.reject(
            angular.isObject(rules.minlength) ?
              rules.minlength.message :
              $interpolate(FormForConfiguration.validationFailedForMinLengthMessage)({num: minlength}));
        }
      }

      if (rules.maxlength) {
        var maxlength = angular.isObject(rules.maxlength) ? rules.maxlength.rule : rules.maxlength;

        if (value.length > maxlength) {
          return $q.reject(
            angular.isObject(rules.maxlength) ?
              rules.maxlength.message :
              $interpolate(FormForConfiguration.validationFailedForMaxLengthMessage)({num: maxlength}));
        }
      }

      if (rules.type) {
        var type = angular.isObject(rules.type) ? rules.type.rule : rules.type;
        var stringValue = value.toString();

        if (type.indexOf('integer') >= 0 && !stringValue.match(/^\-*[0-9]+$/)) {
          return $q.reject(
            angular.isObject(rules.type) ?
              rules.type.message :
              FormForConfiguration.validationFailedForIntegerTypeMessage);
        }

        if (type.indexOf('number') >= 0 && !stringValue.match(/^\-*[0-9\.]+$/)) {
          return $q.reject(
            angular.isObject(rules.type) ?
              rules.type.message :
              FormForConfiguration.validationFailedForNumericTypeMessage);
        }

        if (type.indexOf('negative') >= 0 && !stringValue.match(/^\-[0-9\.]+$/)) {
          return $q.reject(
            angular.isObject(rules.type) ?
              rules.type.message :
              FormForConfiguration.validationFailedForNegativeTypeMessage);
        }

        if (type.indexOf('positive') >= 0 && !stringValue.match(/^[0-9\.]+$/)) {
          return $q.reject(
            angular.isObject(rules.type) ?
              rules.type.message :
              FormForConfiguration.validationFailedForPositiveTypeMessage);
        }

        if (type.indexOf('email') >= 0 && !stringValue.match(/^[\w\.\+]+@\w+\.\w+$/)) {
          return $q.reject(
            angular.isObject(rules.type) ?
              rules.type.message :
              FormForConfiguration.validationFailedForEmailTypeMessage);
        }
      }

      if (rules.pattern) {
        var isRegExp = rules.pattern instanceof RegExp;
        var pattern = isRegExp ? rules.pattern : rules.pattern.rule;

        if (!pattern.exec(value)) {
          return $q.reject(
            isRegExp ?
              FormForConfiguration.validationFailedForPatternMessage :
              rules.pattern.message);
        }
      }

      if (rules.custom) {
        var defaultErrorMessage = angular.isFunction(rules.custom) ? FormForConfiguration.validationFailedForCustomMessage : rules.custom.message;
        var validationFunction = angular.isFunction(rules.custom) ? rules.custom : rules.custom.rule;

        // Validations can fail in 3 ways:
        // A promise that gets rejected (potentially with an error message)
        // An error that gets thrown (potentially with a message)
        // A falsy value

        try {
          var returnValue = validationFunction(value, model);
        } catch (error) {
          return $q.reject(error.message || defaultErrorMessage);
        }

        if (angular.isObject(returnValue) && angular.isFunction(returnValue.then)) {
          return returnValue.then(
            function(reason) {
              return $q.resolve(reason);
            },
            function(reason) {
              return $q.reject(reason || defaultErrorMessage);
            });
        } else if (returnValue) {
          return $q.resolve(returnValue);
        } else {
          return $q.reject(defaultErrorMessage);
        }
      }

      return $q.resolve();
    };

    /**
     * Validates a value against the related rule-set (within validationRules).
     * This method returns a promise to be resolved on successful validation.
     * If validation fails the promise will be rejected with an error message.
     * @memberof ModelValidator
     * @param {Object} model Form-data object model is contained within
     * @param {String} fieldName Name of field used to associate the rule-set map with a given value
     * @param {Object} validationRules Set of named validation rules
     * @returns {Promise} To be resolved or rejected based on validation success or failure.
     */
    this.validateField = function(model, fieldName, validationRules) {
      var rules = this.$getRulesForFieldName(validationRules, fieldName);
      var value = $parse(fieldName)(model);

      if (rules) {
        if (rules.collection) {
          value = value || [];

          var collectionRules = rules.collection;
          var promises = [];

          if (collectionRules.min) {
            var min = angular.isObject(collectionRules.min) ? collectionRules.min.rule : collectionRules.min;

            if (value.length < min) {
              promises.push(
                $q.reject(
                  angular.isObject(collectionRules.min) ?
                    collectionRules.min.message :
                    $interpolate(FormForConfiguration.validationFailedForMinCollectionSizeMessage)({num: min})));
            }
          }

          if (collectionRules.max) {
            var max = angular.isObject(collectionRules.max) ? collectionRules.max.rule : collectionRules.max;

            if (value.length > max) {
              promises.push(
                $q.reject(
                  angular.isObject(collectionRules.max) ?
                    collectionRules.max.message :
                    $interpolate(FormForConfiguration.validationFailedForMaxCollectionSizeMessage)({num: max})));
            }
          }

          // Items within the collection should be validated
          if (collectionRules.fields) {
            angular.forEach(value, function(item) {
              promises.push(
                this.validateAll(item, collectionRules.fields));
            }, this);
          }

          return $q.waitForAll(promises);

        } else {
          return this.$validateWithRules(model, value, rules);
        }
      }

      return $q.resolve();
    };

    return this;
  }]);

/**
 * @ngdoc Services
 * @name NestedObjectHelper
 * @description
 * Helper utility to simplify working with nested objects.
 */
angular.module('formFor').service('NestedObjectHelper', ["$parse", function($parse) {

  return {

    // For Angular 1.2.21 and below, $parse does not handle array brackets gracefully.
    // Essentially we need to create Arrays that don't exist yet or objects within array indices that don't yet exist.
    // @see https://github.com/angular/angular.js/issues/2845
    $createEmptyArrays: function(object, attribute) {
      var startOfArray = 0;

      while (true) {
        startOfArray = attribute.indexOf('[', startOfArray);

        if (startOfArray < 0) {
          break;
        }

        var arrayAttribute = attribute.substr(0, startOfArray);
        var possibleArray = this.readAttribute(object, arrayAttribute);

        // Create the Array if it doesn't yet exist
        if (!possibleArray) {
          possibleArray = [];

          this.writeAttribute(object, arrayAttribute, possibleArray);
        }

        // Create an empty Object in the Array if the user is about to write to one (and one does not yet exist)
        var match = attribute.substr(startOfArray).match(/([0-9]+)\]\./);

        if (match) {
          var index = parseInt(match[1]);

          if (!possibleArray[index]) {
            possibleArray[index] = {};
          }
        }

        // Increment and keep scanning
        startOfArray++;
      }
    },

    flattenAttribute: function(attribute) {
      attribute = attribute.replace(/\[([^\]]+)\]\.{0,1}/g, '___$1___');
      attribute = attribute.replace(/\./g, '___');

      return attribute;
    },

    /**
     * Crawls an object and returns a flattened set of all attributes using dot notation.
     * This converts an Object like: {foo: {bar: true}, baz: true}
     * Into an Array like ['foo', 'foo.bar', 'baz']
     * @memberof NestedObjectHelper
     * @param {Object} object Object to be flattened
     * @returns {Array} Array of flattened keys (perhaps containing dot notation)
     */
    flattenObjectKeys: function(object) {
      var keys = [];
      var queue = [{
        object: object,
        prefix: null
      }];

      while (true) {
        if (queue.length === 0) {
          break;
        }

        var data = queue.pop();
        var prefix = data.prefix ? data.prefix + '.' : '';

        if (typeof data.object === 'object') {
          for (var prop in data.object) {
            var path = prefix + prop;

            keys.push(path);

            queue.push({
              object: data.object[prop],
              prefix: path
            });
          }
        }
      }

      return keys;
    },

    /**
     * Returns the value defined by the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     * @memberof NestedObjectHelper
     * @param {Object} object Object ot be read
     * @param {String} attribute Attribute (or dot-notation path) to read
     * @returns {Object} Value defined at the specified key
     */
    readAttribute: function(object, attribute) {
      return $parse(attribute)(object);
    },

    /**
     * Writes the specified value to the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     * @memberof NestedObjectHelper
     * @param {Object} object Object ot be updated
     * @param {String} attribute Attribute (or dot-notation path) to update
     * @param {Object} value Value to be written
     */
    writeAttribute: function(object, attribute, value) {
      this.$createEmptyArrays(object, attribute);

      $parse(attribute).assign(object, value);
    }
  };
}]);

/**
 * @ngdoc Services
 * @name $q
 * @description
 * Decorates the $q utility with additional methods used by formFor.
 * @private
 * This set of helper methods, small though they are, might be worth breaking apart into their own library?
 */
var qDecorator = ["$delegate", function($delegate) {

  /**
   * Similar to $q.reject, this is a convenience method to create and resolve a Promise.
   * @memberof $q
   * @param {Object} data Value to resolve the promise with
   * @returns {Promise} A resolved promise
   */
  $delegate.resolve = function(data) {
    var deferred = this.defer();
    deferred.resolve(data);

    return deferred.promise;
  };

  /**
   * Similar to $q.all but waits for all promises to resolve/reject before resolving/rejecting.
   * @memberof $q
   * @param {Array} promises Array of promises
   * @returns {Promise} A promise to be resolved or rejected once all of the observed promises complete
   */
  $delegate.waitForAll = function(promises) {
    var deferred = this.defer();
    var results = [];
    var counter = 0;
    var errored = false;

    var udpateResult = function(key, data) {
      if (!results.hasOwnProperty(key)) {
        results[key] = data;

        counter--;
      }

      checkForDone();
    };

    var checkForDone = function() {
      if (counter === 0) {
        if (errored) {
          deferred.reject(results);
        } else {
          deferred.resolve(results);
        }
      }
    };

    angular.forEach(promises, function(promise, key) {
      counter++;

      promise.then(
        function(data) {
          udpateResult(key, data);
        },
        function(data) {
          errored = true;

          udpateResult(key, data);
        });
    });

    checkForDone(); // Handle empty Array

    return deferred.promise;
  };

  return $delegate;
}];

angular.module('formFor').config(
  ["$provide", function($provide) {
    $provide.decorator('$q', qDecorator);
  }]);

/**
 * @ngdoc Services
 * @name StringUtil
 * @description
 * Utility for working with strings.
 */
angular.module('formFor').service('StringUtil', function() {

  /**
   * Converts text in common variable formats to humanized form.
   * @memberof StringUtil
   * @param {String} text Name of variable to be humanized (ex. myVariable, my_variable)
   * @returns {String} Humanized string (ex. 'My Variable')
   */
  this.humanize = function(text) {
    if (!text) {
      return '';
    }

    text = text.replace(/[A-Z]/g, function(match) {
      return ' ' + match;
    });

    text = text.replace(/_([a-z])/g, function(match, $1) {
      return ' ' + $1.toUpperCase();
    });

    text = text.replace(/\s+/g, ' ');
    text = text.trim();
    text = text.charAt(0).toUpperCase() + text.slice(1);

    return text;
  };
});

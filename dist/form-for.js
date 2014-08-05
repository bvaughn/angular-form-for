angular.module("formFor.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("form-for/templates/checkbox-field.html","<div  class=\"field checkbox-field\"\n      ng-class=\"{disabled: disable || disabledByForm, \'has-error\': error}\">\n\n  <p ng-if=\"error\" class=\"text-danger field-error left-aligned\" ng-bind=\"error\"></p>\n\n  <label>\n    <div class=\"checkbox-field-input\" ng-class=\"{\'is-checked\': model.bindable}\"></div>\n\n    <input  type=\"checkbox\" ng-model=\"model.bindable\"\n            class=\"field-input\"\n            ng-disabled=\"disable || disabledByForm\">\n\n    <field-label  ng-if=\"label\" label=\"{{label}}\" help=\"{{help}}\"\n                  ng-click=\"toggle()\"></field-label>\n  </label>\n</div>\n");
$templateCache.put("form-for/templates/field-label.html","<label  class=\"field-label\"\n        popover=\"{{help}}\"\n        popover-trigger=\"mouseenter\"\n        popover-placement=\"right\">\n\n  <span ng-bind-html=\"bindableLabel\"></span>\n\n  <span ng-if=\"help\" class=\"fa-stack help-icon-stack\">\n    <i class=\"fa fa-stack-2x fa-circle help-background-icon\"></i>\n    <i class=\"fa fa-stack-1x fa-inverse fa-question help-foreground-icon\"></i>\n  </span>\n</label>\n");
$templateCache.put("form-for/templates/radio-field.html","<div  class=\"field radio-field\"\n      ng-class=\"{disabled: disable || disabledByForm, \'has-error\': error}\">\n\n  <p ng-if=\"error\" class=\"text-danger field-error left-aligned\" ng-bind=\"error\"></p>\n\n  <label>\n    <div  class=\"radio-field-input\" ng-class=\"{\'is-selected\': model.bindable === value}\"\n          ng-click=\"click()\"></div>\n\n    <input  type=\"radio\" ng-model=\"model.bindable\" ng-value=\"value\"\n            class=\"field-input\"\n            ng-disabled=\"disable || disabledByForm\">\n\n    <field-label  ng-if=\"label\" label=\"{{label}}\" help=\"{{help}}\"\n                  ng-click=\"click()\"></field-label>\n  </label>\n</div>\n");
$templateCache.put("form-for/templates/select-field.html","<div  class=\"form-group field select-field\"\n      ng-class=\"{disabled: disable || disabledByForm, open: isOpen, \'has-error\': error}\">\n\n  <field-label ng-if=\"label\" label=\"{{label}}\" help=\"{{help}}\"></field-label>\n\n  <p ng-if=\"error\" class=\"text-danger field-error\" ng-bind=\"error\"></p>\n\n  <div  class=\"form-control select-field-toggle-button\" role=\"button\" data-toggle=\"dropdown\"\n        ng-class=\"{open: isOpen, disabled: disable || disabledByForm}\">\n    <span ng-if=\"selectedOptionLabel\" ng-bind=\"selectedOptionLabel\"></span>\n\n    <span ng-if=\"!selectedOptionLabel\">\n      <span ng-if=\"placeholder\" ng-bind=\"placeholder\"></span>\n      <span ng-if=\"!placeholder\">Select</span>\n    </span>\n\n    <span class=\"fa fa-caret-down pull-right select-field-toggle-caret\"></span>\n  </div>\n\n  <div ng-show=\"isOpen\" class=\"unstyled list-group-container\">\n    <div class=\"list-group unstyled list-group\" role=\"menu\">\n      <a class=\"list-group-item\" ng-if=\"allowBlank\" ng-click=\"selectOption()\">&nbsp;</a>\n\n      <a  class=\"list-group-item\"\n          ng-repeat=\"option in options\"\n          ng-value=\"option.value\"\n          ng-click=\"selectOption(option)\"\n          ng-bind=\"option.label\"\n          ng-class=\"{active: option === selectedOption}\"></a>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("form-for/templates/submit-button.html","<button class=\"btn btn-default submit-button\" ng-disabled=\"disable || disabledByForm\">\n  <i ng-if=\"icon\" class=\"submit-button-icon\" ng-class=\"icon\"></i>\n\n  <span ng-bind-html=\"bindableLabel\"></span>\n</button>\n");
$templateCache.put("form-for/templates/text-field.html","<div  class=\"form-group field text-field\"\n      ng-class=\"{disabled: disable || disabledByForm, \'has-error\': error}\">\n\n  <field-label ng-if=\"label\" label=\"{{label}}\" help=\"{{help}}\"></field-label>\n\n  <p ng-if=\"error\" class=\"text-danger field-error\" ng-bind=\"error\"></p>\n\n  <div class=\"input-group\">\n    <span ng-if=\"iconBefore\" class=\"input-group-addon input-group-addon-before\">\n      <i class=\"text-field-icon\" ng-class=\"iconBefore\"></i>\n    </span>\n\n    <input  ng-if=\"!multiline\"\n            type=\"{{type}}\"\n            class=\"form-control text-field-input\"\n            ng-class=\"{\'has-icon-before\': iconBefore, \'has-icon-after\': iconAfter}\"\n            ng-disabled=\"disable || disabledByForm\"\n            placeholder=\"{{placeholder}}\"\n            ng-model=\"model.bindable\"\n            form-for-debounce=\"{{debounce}}\" />\n\n\n    <textarea ng-if=\"multiline\"\n              class=\"form-control text-field-input\"\n              ng-class=\"{\'has-icon-before\': iconBefore, \'has-icon-after\': iconAfter}\"\n              ng-disabled=\"disable || disabledByForm\"\n              placeholder=\"{{placeholder}}\"\n              ng-model=\"model.bindable\"\n              form-for-debounce=\"{{debounce}}\">\n    </textarea>\n\n    <span ng-if=\"iconAfter\" class=\"input-group-addon input-group-addon-after\">\n      <i class=\"text-field-icon\" ng-class=\"iconAfter\"></i>\n    </span>\n  </div>\n</div>\n");}]);
angular.module('formFor', ['formFor.templates']);

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#checkboxfield
 */
angular.module('formFor').directive('checkboxField',
  function($log) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/checkbox-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        help: '@?',
        label: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        $scope.model = formForController.registerFormField($scope, $scope.attribute);

        var $input = $element.find('input');

        $scope.toggle = function toggle() {
          if (!$scope.disable && !$scope.disabledByForm) {
            $scope.model.bindable = !$scope.model.bindable;
          }
        };
      }
    };
  });

/**
 * This component is only intended for internal use by the formFor module.
 */
angular.module('formFor').directive('fieldLabel',
  function( $sce ) {
    return {
      restrict: 'EA',
      templateUrl: 'form-for/templates/field-label.html',
      scope: {
        help: '@?',
        label: '@'
      },
      controller: function($scope) {
        $scope.$watch('label', function(value) {
          $scope.bindableLabel = $sce.trustAsHtml(value);
        });
      }
    };
  });

/**
 * Angular introduced debouncing (via ngModelOptions) in version 1.3.
 * As of the time of this writing, that version is still in beta.
 * This component adds debouncing behavior for Angular 1.2.x.
 * It is primarily intended for use with <input type=text> elements.
 */
angular.module('formFor').directive('formForDebounce', function($log, $timeout, FormForConfiguration) {
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

          if (!_.isNaN(durationAttribute)) {
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
});

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#formfor
 */
angular.module('formFor').directive('formFor',
  function($injector, $parse, $q, $sce, FormForConfiguration, $FormForStateHelper, NestedObjectHelper, ModelValidator) {
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
      controller: function($scope) {
        $scope.formFieldScopes = {};
        $scope.bindable = {};
        $scope.scopeWatcherUnwatchFunctions = [];
        $scope.submitButtonScopes = [];


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

        /**
         * All form-input children of formFor must register using this function.
         * @param formFieldScope $scope of input directive
         * @param fieldName Unique identifier of field within model; used to map errors back to input fields
         */
        this.registerFormField = function(formFieldScope, fieldName) {
          var safeFieldName = NestedObjectHelper.flattenAttribute(fieldName);

          $scope.formFieldScopes[fieldName] = formFieldScope;
          $scope.bindable[safeFieldName] = {bindable: null};

          // TRICKY Why do we use $parse?
          // Dot notation (ex. 'foo.bar') causes trouble with the brackets accessor.
          // To simplify binding for formFor children, we encapsulate this and return a simple bindable model.
          // We need to manage 2-way binding to keep the original model and our wrapper in sync though.
          // Given a model {foo: {bar: 'baz'}} and a field-name 'foo.bar' $parse allows us to retrieve 'baz'.

          var getter = $parse(fieldName);
          var setter = getter.assign;

          $scope.$watch('bindable.' + safeFieldName + '.bindable', function(newValue, oldValue) {
            if (newValue !== oldValue) {
              setter($scope.formFor, newValue);
            }
          });

          $scope.$watch('formFor.' + fieldName, function(newValue, oldValue) {
            $scope.bindable[safeFieldName].bindable = getter($scope.formFor);
          });

          // Also run validations on-change as necessary.
          createScopeWatcher(fieldName);

          return $scope.bindable[safeFieldName];
        };

        /**
         * All submitButton children must register with formFor using this function.
         */
        this.registerSubmitButton = function(submitButtonScope) {
          $scope.submitButtonScopes.push(submitButtonScope);
        };

        /**
         * Resets errors displayed on the <form> without resetting the form data values.
         */
        this.resetErrors = function() {
          $scope.formForStateHelper.setFormSubmitted(false);

          var keys = NestedObjectHelper.flattenObjectKeys($scope.errorMap);

          _.each(keys, function(fieldName) {
            $scope.formForStateHelper.setFieldHasBeenModified(fieldName, false);
          });
        };

        // Expose controller methods to the $scope.controller interface
        $scope.controller = $scope.controller || {};
        $scope.controller.registerFormField = this.registerFormField;
        $scope.controller.registerSubmitButton = this.registerSubmitButton;
        $scope.controller.resetErrors = this.resetErrors;

        // Disable all child inputs if the form becomes disabled.
        $scope.$watch('disable', function(value) {
          _.each($scope.formFieldScopes, function(scope) {
            scope.disabledByForm = value;
          });

          _.each($scope.submitButtonScopes, function(scope) {
            scope.disabledByForm = value;
          });
        });

        // Track field validity and dirty state.
        $scope.formForStateHelper = new $FormForStateHelper($scope);

        /**
         * Setup a debounce validator on a registered form field.
         * This validator will update error messages inline as the user progresses through the form.
         */
        var createScopeWatcher = function(fieldName) {
          var formFieldScope = $scope.formFieldScopes[fieldName];
          var initialized;

          return $scope.$watch('formFor.' + fieldName,
            function(newValue, oldValue) {
              // Scope watchers always trigger once when added.
              // Only mark our field dirty when a user-edit actually triggers the watcher.
              if (!initialized) {
                initialized = true;

              // If formFor was binded with an empty object, ngModel will auto-initialize keys on blur.
              // We shouldn't treat this as a user-edit though unless the user actually typed something.
              // It's possible they typed and then erased, but that seems less likely...
              } else if (oldValue !== undefined || newValue !== '') {
                $scope.formForStateHelper.setFieldHasBeenModified(fieldName, true);
              }

              if ($scope.$validationRules) {
                ModelValidator.validateField($scope.formFor, fieldName, $scope.$validationRules).then(
                  function() {
                    $scope.formForStateHelper.setFieldError(fieldName, null);
                  },
                  function(error) {
                    $scope.formForStateHelper.setFieldError(fieldName, error);
                  });
              }
            });
        };

        // Watch for any validation changes or changes in form-state that require us to notify the user.
        // Rather than using a deep-watch, FormForStateHelper exposes a bindable attribute 'watchable'.
        // This attribute is gauranteed to change whenever validation criteria change, but its value is meaningless.
        $scope.$watch('formForStateHelper.watchable', function() {
          var formForStateHelper = $scope.formForStateHelper;

          _.each($scope.formFieldScopes, function(scope, fieldName) {
            if (formForStateHelper.hasFormBeenSubmitted() || formForStateHelper.hasFieldBeenModified(fieldName)) {
              var error = formForStateHelper.getFieldError(fieldName);

              scope.error = error ? $sce.trustAsHtml(error) : null;
            } else {
              // Clear out field errors in the event that the form has been reset.
              scope.error = null;
            }
          });
        });

        /**
         * Update all registered form fields with the specified error messages.
         * Specified map should be keyed with fieldName and should container user-friendly error strings.
         *
         * @param errorMap Map of field names (or paths) to errors
         */
        $scope.updateErrors = function(errorMap) {
          _.each($scope.formFieldScopes, function(scope, fieldName) {
            var error = NestedObjectHelper.readAttribute(errorMap, fieldName);

            $scope.formForStateHelper.setFieldError(fieldName, error);
          });
        };

        /**
         * Validate all registered fields and update FormForStateHelper's error mapping.
         * This update indirectly triggers form validity check and inline error message display.
         */
        $scope.validateAll = function() {
          $scope.updateErrors({});

          var validationPromise;

          if ($scope.$validationRules) {
            validationPromise =
              ModelValidator.validateFields(
                $scope.formFor,
                _.keys($scope.formFieldScopes),
                $scope.$validationRules);
          } else {
            validationPromise = $q.resolve();
          }

          validationPromise.then(angular.noop, $scope.updateErrors);

          return validationPromise;
        };

        // Clean up dangling watchers on destroy.
        $scope.$on('$destroy', function() {
          _.each($scope.scopeWatcherUnwatchFunctions, function(unwatch) {
            unwatch();
          });
        });
      },
      link: function($scope, $element, $attributes, controller) {
        // Override form submit to trigger overall validation.
        $element.on('submit',
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
                  promise = $q.reject('No submit implementation provided');
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
                    if (_.isObject(errorMessageOrErrorMap)) {
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
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#radiofield
 */
angular.module('formFor').directive('radioField',
  function($log) {
    var nameToActiveRadioMap = {};

    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/radio-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        help: '@?',
        label: '@?',
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
            model: formForController.registerFormField($scope, $scope.attribute)
          };
        }

        // TODO How to handle errors?
        // Main scope should listen and bucket brigade to others!

        var activeRadio = nameToActiveRadioMap[$scope.attribute];
        activeRadio.scopes.push($scope);

        $scope.model = activeRadio.model;

        var $input = $element.find('input');

        $scope.click = function() {
          if (!$scope.disable && !$scope.disabledByForm) {
            $scope.model.bindable = $scope.value;
          }
        };

        activeRadio.defaultScope.$watch('disable', function(value) {
          $scope.disable = value;
        });
        activeRadio.defaultScope.$watch('disabledByForm', function(value) {
          $scope.disabledByForm = value;
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
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#selectfield
 */
angular.module('formFor').directive('selectField',
  function($document, $log, $timeout) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/select-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        help: '@?',
        label: '@?',
        options: '=',
        placeholder: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute || !$scope.options) {
          $log.error('Missing required field(s) "attribute" or "options"');

          return;
        }

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

        var oneClick = function(target, handler) {
          $timeout(function() { // Delay to avoid processing the same click event that trigger the toggle-open
            target.one('click', handler);
          }, 1);
        };

        var removeClickWatch = function() {
          $document.off('click', clickWatcher);
          $element.off('click', clickWatcher);
        };

        $scope.selectOption = function(option) {
          console.log('selectOption:'); // TESTING
          $scope.model.bindable = option && option.value;
          $scope.isOpen = false;

          removeClickWatch();

          oneClick($element, clickToOpen);
        };

        var clickWatcher = function(event) {
          console.log('clickWatcher:'); // TESTING
          $scope.isOpen = false;
          $scope.$apply();

          removeClickWatch();

          oneClick($element, clickToOpen);
        };

        var scroller = $element.find('.list-group-container');
        var list = $element.find('.list-group');

        var clickToOpen = function() {
          if ($scope.disable || $scope.disabledByForm) {
            oneClick($element, clickToOpen);

            return;
          }

          $scope.isOpen = !$scope.isOpen;
          console.log('clickToOpen:',$scope.isOpen); // TESTING

          if ($scope.isOpen) {
            oneClick($document, clickWatcher);
            oneClick($element, clickWatcher);

            var value = $scope.model.bindable;

            $timeout(function() {
              var listItem =
                _.find(list.find('.list-group-item'),
                  function(listItem) {
                    var option = $(listItem).scope().option;

                    return option && option.value === value;
                  });

              if (listItem) {
                scroller.scrollTop(
                  $(listItem).offset().top - $(listItem).parent().offset().top);
              }
            }.bind(this), 1);
          }
        };

        oneClick($element, clickToOpen);

        $scope.$on('$destroy', function() {
          removeClickWatch();
        });
      }
    };
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#submitbutton
 */
angular.module('formFor').directive('submitButton',
  function($log, $sce) {
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
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#textfield
 */
angular.module('formFor').directive('textField',
  function($log) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/text-field.html',
      scope: {
        attribute: '@',
        debounce: '@?',
        disable: '@',
        help: '@?',
        iconAfter: '@?',
        iconBefore: '@?',
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

        $scope.model = formForController.registerFormField($scope, $scope.attribute);
      }
    };
  });

/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#formfor
 */
angular.module('formFor').service('FormForConfiguration',
  function() {
    return {
      defaultDebounceDuration: 1000,
      defaultSubmitComplete: angular.noop,
      defaultSubmitError: angular.noop,
      setDefaultDebounceDuration: function(value) {
        this.defaultDebounceDuration = value;
      },
      setDefaultSubmitComplete: function(value) {
        this.defaultSubmitComplete = value;
      },
      setDefaultSubmitError: function(value) {
        this.defaultSubmitError = value;
      }
    };
  });

/**
 * Organizes state management for form-submission and field validity.
 * Intended for use only by formFor directive.
 */
angular.module('formFor').factory('$FormForStateHelper', function(NestedObjectHelper) {
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
    return _.isEmpty(this.shallowErrorMap);
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
});

/**
 * ModelValidator service used by formFor to determine if each field in the form-data passes validation rules.
 * This service is not intended for use outside of the formFor module/library.
 */
angular.module('formFor').service('ModelValidator', function($parse, $q, NestedObjectHelper) {

  /**
   * Validates the model against all rules in the validationRules.
   * This method returns a promise to be resolved on successful validation,
   * Or rejected with a map of field-name to error-message.
   *
   * @param model Model data to validate with any existing rules
   * @param validationRules Set of named validation rules
   */
  this.validateAll = function(model, validationRules) {
    var fields = NestedObjectHelper.flattenObjectKeys(validationRules);

    return this.validateFields(model, fields, validationRules);
  };

  /**
   * Validates the values in model with the rules defined in the current validationRules.
   * This method returns a promise to be resolved on successful validation,
   * Or rejected with a map of field-name to error-message.
   *
   * @param model Model data
   * @param fieldNames Whitelist set of fields to validate for the given model; values outside of this list will be ignored
   * @param validationRules Set of named validation rules
   */
  this.validateFields = function(model, fieldNames, validationRules) {
    var deferred = $q.defer();
    var promises = [];
    var errorMap = {};
    var that = this;

    _.each(fieldNames, function(fieldName) {
      var rules = NestedObjectHelper.readAttribute(validationRules, fieldName);

      if (rules) {
        var promise = that.validateField(model, fieldName, validationRules);

        promise.then(
          angular.noop,
          function(error) {
            $parse(fieldName).assign(errorMap, error);
          });

        promises.push(promise);
      }
    });

    $q.waitForAll(promises).then(
      deferred.resolve,
      function() {
        deferred.reject(errorMap);
      });

    return deferred.promise;
  };

  /**
   * Validates a value against the related rule-set (within validationRules).
   * This method returns a promise to be resolved on successful validation.
   * If validation fails the promise will be rejected with an error message.
   *
   * @param model Form-data object model is contained within
   * @param fieldName Name of field used to associate the rule-set map with a given value
   * @param validationRules Set of named validation rules
   */
  this.validateField = function(model, fieldName, validationRules) {
    var rules = NestedObjectHelper.readAttribute(validationRules, fieldName);
    var value = $parse(fieldName)(model);

    if (rules) {
      value = value || '';

      if (rules.required) {
        var required = _.isObject(rules.required) ? rules.required.rule : rules.required;

        if (!!value !== required) {
          var errorMessage = _.isObject(rules.required) ? rules.required.message : 'Required field';

          return $q.reject(errorMessage);
        }
      }

      if (rules.minlength) {
        var minlength = _.isObject(rules.minlength) ? rules.minlength.rule : rules.minlength;

        if (value.length < minlength) {
          var errorMessage = _.isObject(rules.minlength) ? rules.minlength.message : 'Must be at least ' + minlength + ' characters';

          return $q.reject(errorMessage);
        }
      }

      if (rules.maxlength) {
        var maxlength = _.isObject(rules.maxlength) ? rules.maxlength.rule : rules.maxlength;

        if (value.length > maxlength) {
          var errorMessage = _.isObject(rules.maxlength) ? rules.maxlength.message : 'Must be fewer than ' + maxlength + ' characters';

          return $q.reject(errorMessage);
        }
      }

      if (rules.pattern) {
        var pattern = _.isRegExp(rules.pattern) ? rules.pattern : rules.pattern.rule;

        if (!pattern.exec(value)) {
          var errorMessage = _.isRegExp(rules.pattern) ? 'Invalid format' : rules.pattern.message;

          return $q.reject(errorMessage);
        }
      }

      if (rules.custom) {
        return rules.custom(value, model).then(
          function(reason) {
            return $q.resolve(reason);
          },
          function(reason) {
            return $q.reject(reason || 'Failed custom validation');
          });
      }
    }

    return $q.resolve();
  };

  return this;
});

/**
 * Helper utility to simplify working with nested objects.
 */
angular.module('formFor').service('NestedObjectHelper', function($parse) {
  return {

    flattenAttribute: function(attribute) {
      return attribute.replace(/\./g, '___');
    },

    /**
     * Crawls an object and returns a flattened set of all attributes using dot notation.
     * This converts an Object like: {foo: {bar: true}, baz: true}
     * Into an Array like ['foo', 'foo.bar', 'baz']
     */
    flattenObjectKeys: function(object) {
      var internalCrawler = function(object, path, array) {
        array = array || [];

        var prefix = path ? path + '.' : '';

        _.forIn(object,
          function(value, relativeKey) {
            var fullKey = prefix + relativeKey;

            array.push(fullKey);

            internalCrawler(value, fullKey, array);
          });

        return array;
      };

      return internalCrawler(object);
    },

    /**
     * Returns the value defined by the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     *
     * @param object Object
     * @param attribute Attribute (or dot-notation path)
     */
    readAttribute: function(object, attribute) {
      return $parse(attribute)(object);
    },

    /**
     * Writes the specified value to the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     *
     * @param object Object
     * @param attribute Attribute (or dot-notation path)
     * @param value Value to be written
     */
    writeAttribute: function(object, attribute, value) {
      $parse(attribute).assign(object, value);
    }
  };
});

/**
 * Decorates the $q utility with additional methods used by formFor.
 *
 * @private
 * This set of helper methods, small though they are, might be worth breaking apart into their own library?
 */
var qDecorator = function($delegate) {

  /**
   * Similar to $q.reject, this is a convenience method to create and resolve a Promise.
   */
  $delegate.resolve = function(data) {
    var deferred = this.defer();
    deferred.resolve(data);

    return deferred.promise;
  };

  /**
   * Similar to $q.all but waits for all promises to resolve/reject before resolving/rejecting.
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
};

angular.module('formFor').config(
  function($provide) {
    $provide.decorator('$q', qDecorator);
  });

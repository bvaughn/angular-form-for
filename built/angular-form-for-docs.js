angular.module('formForDocumentation', ['oc.lazyLoad', 'flashr', 'formFor', 'formFor.defaultTemplates', 'ngRoute', 'ui.bootstrap', 'ngMaterial', 'ui.router']).
  config(["$logProvider", "$stateProvider", "$urlRouterProvider", function($logProvider, $stateProvider, $urlRouterProvider) {
    $logProvider.debugEnabled(true);

    $stateProvider.state('app', {
      'abstract': true,
      url: '',
      templateUrl: 'app/views/partials/layout.html'
    });

    // Reports

    $stateProvider.state('app.formBuilderMarkup', {
      url: '/demo/form-builder-markup',
      templateUrl: 'app/views/form-builder-markup.html',
      controller: 'FormBuilderMarkupDemoController',
      controllerAs: 'ctrl'
    });

    $stateProvider.state('app.manualFormMarkup', {
      url: '/demo/manual-form-markup',
      templateUrl: 'app/views/manual-form-markup.html',
      controller: 'ManualFormMarkupDemoController',
      controllerAs: 'ctrl'
    });

    $stateProvider.state('app.selectField', {
      url: '/demo/select-field',
      templateUrl: 'app/views/select-field.html',
      controller: 'SelectFieldDemoController',
      controllerAs: 'ctrl'
    });

    $stateProvider.state('app.typeAhead', {
      url: '/demo/type-ahead',
      templateUrl: 'app/views/type-ahead.html',
      controller: 'TypeAheadDemoController',
      controllerAs: 'ctrl'
    });

    $stateProvider.state('app.dynamicIcons', {
      url: '/demo/dynamic-icons',
      templateUrl: 'app/views/dynamic-icons.html',
      controller: 'DynamicIconsDemoController',
      controllerAs: 'ctrl'
    });

    $stateProvider.state('app.collectionsForm', {
      url: '/demo/collections-form',
      templateUrl: 'app/views/collections.html',
      controller: 'CollectionsDemoController',
      controllerAs: 'ctrl'
    });

    $stateProvider.state('app.formMetadata', {
      url: '/demo/form-metadata',
      templateUrl: 'app/views/form-metadata.html',
      controller: 'FormMetadataDemoController',
      controllerAs: 'ctrl'
    });

    // Guides

    $stateProvider.state('app.overview', {
      url: '/demo/overview',
      templateUrl: 'app/views/overview.html'
    });

    $stateProvider.state('app.inputTypes', {
      url: '/demo/input-types',
      templateUrl: 'app/views/input-types.html'
    });

    $stateProvider.state('app.validationTypes', {
      url: '/demo/validation-types',
      templateUrl: 'app/views/validation-types.html'
    });

    $stateProvider.state('app.formBuilder', {
      url: '/demo/form-builder',
      templateUrl: 'app/views/form-builder.html',
      controller: 'IndexFormDemoController'
    });

    $stateProvider.state('app.templateOverrides', {
      url: '/demo/template-overrides',
      templateUrl: 'app/views/template-overrides.html'
    });

    $stateProvider.state('app.ie8Support', {
      url: '/demo/ie8-support',
      templateUrl: 'app/views/ie8-support.html'
    });

    // Default

    $stateProvider.state('app.index', {
      url: '/index',
      templateUrl: 'app/views/index.html',
      controller: 'IndexFormDemoController',
      controllerAs: 'ctrl'
    });

    // API docuumentation

    $stateProvider.state('app.documentation', {
      url: '/documentation',
      templateUrl: 'app/views/documentation/layout.html'
    });
    $stateProvider.state('app.documentation.index', {
      parent: 'app.documentation',
      url: '/index',
      templateUrl: 'app/views/documentation/index.html'
    });
    $stateProvider.state('app.documentation.forClass', {
      parent: 'app.documentation',
      url: '/:className',
      templateUrl: 'app/views/documentation/for-class.html',
      controller: ["$scope", "$stateParams", function ($scope, $stateParams) {
        if ($stateParams.className) {
          $scope.templateUrl = 'app/views/documentation/classes/' + $stateParams.className + '.html';
        } else {
          $scope.templateUrl = 'app/views/documentation/index.html';
        }
      }]
    });

    $urlRouterProvider.otherwise('/index');
  }]);
angular.module('formForDocumentation').controller('ManualFormMarkupDemoController',
  ["$scope", "$timeout", "flashr", function($scope, $timeout, flashr) {
    $scope.formData = {};

    // Simulate a delay in loading remote data
    $timeout(function() {
      $scope.formData = {
        password: 'password'
      };
    },1000);

    $scope.genders = [
      {label: 'Male', value: '1'},
      {label: 'Female', value: '2'},
      {label: 'Unspecified', value: '3'}
    ];

    $scope.hobbies = [
      {value: 'art', label: 'Art'},
      {value: 'music', label: 'Music'},
      {value: 'running', label: 'Running'},
      {value: 'video_games', label: 'Video Games'}
    ];

    $scope.submitFailed = function(error) {
      flashr.now.info(error);
    };
}]);

angular.module('formForDocumentation').service('UserSignUp', ["$q", "$timeout", function($q, $timeout) {
  return {
    validationRules: {
      agreed: {
        required: {
          rule: true,
          message: 'You must accept the TOS'
        }
      },
      signupEmail: {
        required: true,
        pattern: /\w+@\w+\.\w+/,
        custom: function(value) {
          if (value === 'briandavidvaughn@gmail.com') {
            return $q.reject('That email is already mine!');
          }

          return true; // Could also return a resolved Promise
        }
      },
      comments: {
        required: true
      },
      gender: {
        required: true
      },
      language: {
        required: true
      },
      password: {
        required: true,
        minlength: 6,
        maxlength: 15,
        pattern: {
          rule: /[0-9]/,
          message: 'Your password must contain at least 1 number'
        }
      },
      username: {
        required: true
      },
      email: {
        type: 'email'
      },
      negativeInteger: {
        type: 'negative integer'
      },
      positiveNumber: {
        type: 'positive number'
      },
      rangeFrom2To5: {
        minimum: 2,
        maximum: 5,
        type: 'number'
      }
    },
    submit: function(data) {
      var deferred = $q.defer();
      $timeout(function() {
        deferred.reject('Your form has been submitted');
      }, 1000);
      return deferred.promise;
    }
  }
}]);

angular.module('formForDocumentation').controller('CollectionsDemoController',
  ["flashr", function(flashr) {
    this.formData = {
      hobbies: [
        {
          name: 'Creating forms',
          frequency: 'daily',
          paid: false,
          recommend: true
        }
      ]
    };

    this.hobbyFrequencyOptions = [
      {label: 'Daily', value: 'daily'},
      {label: 'Weekly', value: 'weekly'},
      {label: 'Monthly', value: 'monthly'}
    ];

    this.validationRules = {
      name: {
        required: true
      },
      hobbies: {
        collection: {
          min: {
            rule: 2,
            message: 'Come on, speak up. Tell us at least two things you enjoy doing'
          },
          max: {
            rule: 4,
            message: 'Do not be greedy. Four hobbies are probably enough!'
          },
          fields: {
            name: {
              required: true
            },
            frequency: {
              required: true
            }
          }
        }
      }
    };

    this.hobbyOptions = [
      {value: true, label: 'Yes'},
      {value: false, label: 'I wish'}
    ];

    this.addHobby = function() {
      this.formData.hobbies.push({});
    };
    this.removeHobby = function(hobby) {
      this.formData.hobbies.splice(
        this.formData.hobbies.indexOf(hobby), 1);
    };

    this.submit = function(data) {
      flashr.now.info('Your form has been submitted');
    };
  }]);

angular.module('formForDocumentation').controller('DynamicIconsDemoController',
  ["FormForConfiguration", "flashr", function(FormForConfiguration, flashr) {
    FormForConfiguration.enableAutoLabels();

    this.bindableAfterIcon = 'fa fa-arrow-circle-o-left';
    this.bindableBeforeIcon = 'fa fa-arrow-circle-o-right';

    this.formController = {};
    this.formData = {};

    this.validationRules = {
      email: {
        required: true,
        pattern: /\w+@\w+\.\w+/
      },
      password: {
        required: true,
        pattern: {
          rule: /[0-9]/,
          message: 'Your password must contain at least 1 number'
        }
      }
    };

    this.submit = function(data) {
      flashr.now.info('Your form has been submitted');
    };
  }]);

angular.module('formForDocumentation').controller('FormBuilderMarkupDemoController',
  ["flashr", function(flashr) {

    // Form inputs will write values to this object
    this.formData = {};

    // This object defines the shape of your data (validation rules)
    // As well as the presentational rules (view schema)
    this.schema = {
      email: {
        inputType: 'text',
        label: 'Email',
        required: true,
        type: 'email'
      },
      password: {
        inputType: 'password',
        label: 'Password',
        minlength: 6,
        pattern: {
          rule: /[0-9]/,
          message: 'Your password must contain at least 1 number'
        }
      },
      gender: {
        inputType: 'radio',
        label: 'Gender',
        required: true,
        values: [
          {value: 'female', label: 'Female'},
          {value: 'male', label: 'Male'}
        ]
      },
      referralSource: {
        allowBlank: true,
        inputType: 'select',
        label: 'How did you hear about us?',
        required: true,
        values: [
          {label: 'Search engine', value: 1},
          {label: 'Forum', value: 2},
          {label: 'Friend', value: 3},
          {label: 'Other', value: 4}
        ]
      },
      tos: {
        inputType: 'checkbox',
        label: 'I agree to the terms of service',
        required: true,
        custom: {
          rule: function(value) {
            return !!value;
          },
          message: 'You must agree to the terms of service'
        }
      }
    };

    // Custom submit function triggered only when a valid form is submitted
    this.submit = function() {
      flashr.now.success('Your form has been submitted');
    };
  }]);

angular.module('formForDocumentation').controller('FormMetadataDemoController',
  ["FormForConfiguration", "flashr", function(FormForConfiguration, flashr) {
    FormForConfiguration.enableAutoLabels();

    this.formData = {
      validateOn: 'manual'
    };
    this.formController = {};

    this.options = [
      {label: 'Option One', value: 1},
      {label: 'Option Two', value: 2},
      {label: 'Option Three', value: 3}
    ];

    this.disableButton = false;
    this.disableCheckbox = false;
    this.disablePassword = false;
    this.disablePlainText = false;
    this.disableRadio = false;
    this.disableSelect = false;

    this.validationRules = {
      plainText: {
        required: true,
        minlength: 3
      },
      password: {
        required: true
      },
      checkSomething: {
        required: true
      },
      gender: {
        required: true
      },
      selectSomething: {
        required: true
      }
    };

    this.validateOptions = [
      {value: '', label: 'default (no setting)'},
      {value: 'change', label: 'on-change'},
      {value: 'manual', label: 'manual'},
      {value: 'submit', label: 'on-submit'}
    ];

    this.setFieldError = function() {
      var error = window.prompt('Enter a custom validation error message:', '');

      this.formController.setFieldError('plainText', error);
    };

    this.onFocus = function() {
      this.focused = true;
    };

    this.onBlur = function() {
      this.focused = false;
    };

    this.manuallyTriggerValidations = function(showErrors) {
      this.formController.validateForm(showErrors).then(
        function() {
          flashr.now.success('Your form is valid');
        },
        function() {
          flashr.now.error('Your form is invalid');
        });
    };

    this.toggleAutoTrim = function() {
      this.autoTrimIsEnabled = !this.autoTrimIsEnabled;

      if (this.autoTrimIsEnabled) {
        FormForConfiguration.enableAutoTrimValues(); 
      } else {
        FormForConfiguration.disableAutoTrimValues(); 
      }
    };

    this.submit = function(data) {
      flashr.now.info('Your form has been submitted');
    };
  }]);


angular.module('formForDocumentation').controller('IndexFormDemoController',
  ["FormForConfiguration", "flashr", function(FormForConfiguration, flashr) {
    FormForConfiguration.enableAutoLabels();

    this.formData = {};

    this.validationAndViewRules = {
      email: {
        inputType: 'text',
        pattern: /\w+@\w+\.\w+/,
        required: true
      },
      password: {
        inputType: 'password',
        pattern: {
          rule: /[0-9]/,
          message: 'Your password must contain at least 1 number'
        },
        required: true
      }
    };

    this.submit = function(data) {
      flashr.now.info('Your form has been submitted');
    };
  }]);

angular.module('formForDocumentation').controller('ManualFormMarkupDemoController',
  ["$timeout", "flashr", function($timeout, flashr) {
   this.formData = {};

    // Simulate a delay in loading remote data
    $timeout(function() {
      this.formData = {
        password: 'password'
      };
    },1000);

    this.genders = [
      {label: 'Male', value: '1'},
      {label: 'Female', value: '2'},
      {label: 'Unspecified', value: '3'}
    ];

    this.hobbies = [
      {value: 'art', label: 'Art'},
      {value: 'music', label: 'Music'},
      {value: 'running', label: 'Running'},
      {value: 'video_games', label: 'Video Games'}
    ];

    this.submitFailed = function(error) {
      flashr.now.info(error);
    };
}]);

angular.module('formForDocumentation').service('UserSignUp', ["$q", "$timeout", function($q, $timeout) {
  return {
    validationRules: {
      agreed: {
        required: {
          rule: true,
          message: 'You must accept the TOS'
        }
      },
      signupEmail: {
        required: true,
        pattern: /\w+@\w+\.\w+/,
        custom: function(value) {
          if (value === 'briandavidvaughn@gmail.com') {
            return $q.reject('That email is already mine!');
          }

          return true; // Could also return a resolved Promise
        }
      },
      comments: {
        required: true
      },
      gender: {
        required: true
      },
      language: {
        required: true
      },
      password: {
        required: true,
        minlength: 6,
        maxlength: 15,
        pattern: {
          rule: /[0-9]/,
          message: 'Your password must contain at least 1 number'
        }
      },
      username: {
        required: true
      },
      email: {
        type: 'email'
      },
      negativeInteger: {
        type: 'negative integer'
      },
      positiveNumber: {
        type: 'positive number'
      },
      rangeFrom2To5: {
        minimum: 2,
        maximum: 5,
        type: 'number'
      }
    },
    submit: function(data) {
      var deferred = $q.defer();
      $timeout(function() {
        deferred.reject('Your form has been submitted');
      }, 1000);
      return deferred.promise;
    }
  }
}]);

angular.module('formForDocumentation').controller('SelectFieldDemoController',
  ["$timeout", function($timeout) {
    this.formData = {
      preselectedLocale: 'en',
      asynchronousLocale: 'en'
    };

    this.localeOptions = [
      {value: 'ar', label: 'Arabic'},
      {value: 'zh', label: 'Chinese'},
      {value: 'nl', label: 'Dutch'},
      {value: 'en', label: 'English'},
      {value: 'fi', label: 'Finnish'},
      {value: 'fr', label: 'French'},
      {value: 'de', label: 'German'},
      {value: 'el', label: 'Greek'},
      {value: 'iw', label: 'Hebrew'},
      {value: 'ga', label: 'Irish'},
      {value: 'it', label: 'Italian'},
      {value: 'ja', label: 'Japanese'},
      {value: 'ko', label: 'Korean'},
      {value: 'mt', label: 'Maltese'},
      {value: 'pl', label: 'Polish'},
      {value: 'ru', label: 'Russian'},
      {value: 'sk', label: 'Slovak'},
      {value: 'es', label: 'Spanish'},
      {value: 'sv', label: 'Swedish'},
      {value: 'th', label: 'Thai'},
      {value: 'uk', label: 'Ukrainian'},
      {value: 'vi', label: 'Vietnamese'}
    ];

    $timeout(function() {
      this.asynchronousLocaleOptions = [];

      angular.copy(this.localeOptions, this.asynchronousLocaleOptions);
    }.bind(this), 1000);
  }]);

angular.module('formForDocumentation').controller('TypeAheadDemoController',
  ["$timeout", function($timeout) {
    this.formData = {
      preselectedLocale: 'es',
      remotelyFilteredLocale: undefined,
      unspecifiedLocale: undefined
    };

    this.localeOptions = [
      {value: 'ar', label: 'Arabic'},
      {value: 'zh', label: 'Chinese'},
      {value: 'nl', label: 'Dutch'},
      {value: 'en', label: 'English'},
      {value: 'fi', label: 'Finnish'},
      {value: 'fr', label: 'French'},
      {value: 'de', label: 'German'},
      {value: 'el', label: 'Greek'},
      {value: 'iw', label: 'Hebrew'},
      {value: 'ga', label: 'Irish'},
      {value: 'it', label: 'Italian'},
      {value: 'ja', label: 'Japanese'},
      {value: 'ko', label: 'Korean'},
      {value: 'mt', label: 'Maltese'},
      {value: 'pl', label: 'Polish'},
      {value: 'ru', label: 'Russian'},
      {value: 'sk', label: 'Slovak'},
      {value: 'es', label: 'Spanish'},
      {value: 'sv', label: 'Swedish'},
      {value: 'th', label: 'Thai'},
      {value: 'uk', label: 'Ukrainian'},
      {value: 'vi', label: 'Vietnamese'}
    ];

    var timeoutId;
    this.filterTextChanged = function(filterText) {
      this.remoteLocaleOptions = null;

      if (timeoutId) {
        $timeout.cancel(timeoutId);
      }

      var latency = 1000 + 1000 * Math.random();

      // This demo doesn't actually load data remotely.
      // It simulates the latency of a remotely-loaded list though.
      // It also simulates simple filtering.
      timeoutId = $timeout(function() {
        this.remoteLocaleOptions = this.localeOptions.filter(
          function(localeOption) {
            return localeOption.label.indexOf(filterText) >= 0;
          });
      }.bind(this), latency);
    };
  }]);


angular.module('formForDocumentation').directive('prism',
  ["$compile", "$http", function($compile, $http) {
    return {
      restrict: 'EA',
      link: function($scope, $element, $attributes) {
        var parser = $attributes.hasOwnProperty('parser') ? $attributes['parser'] : 'markup';

        var highlight = function(text) {
          var html = Prism.highlight(text, Prism.languages[parser]);

          $element.html('<pre class="language-' + parser + '"><code>' + html + '</code></pre>');
        };

        var showError = function() {
          $element.html('<p class="alert alert-danger"><i class="fa fa-times"></i> The specified template could not be loaded.</p>');
        };

        if ($attributes.source) {
          $element.html('<i class="fa fa-spin fa-spinner"></i> Loading...');

          $http({method: 'GET', url: $attributes.source}).
            success(
              function(data) {
                if (data) {
                  highlight(data);
                } else {
                  showError();
                }
              }).
            error(showError);
        } else if ($attributes.hasOwnProperty('data')) {
          $attributes.$observe('data', function(data) {
            highlight(data);
          });
        } else {
          highlight($element.html());
        }
      }
    };
}]);

angular.module('formForDocumentation').directive('formDataInspector', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/templates/form-data-inspector.html',
    scope: {
      formData: '='
    },
    link: function($scope, $element, $attributes) {
      $scope.formDataName = $attributes.formDataName || 'formData';
      $scope.$watch('formData', function(formData) {
        $scope.formDataJson = angular.toJson(formData, true);
      }, true);
    }
  };
});

angular.module('formForDocumentation').directive('tabbedDemo', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/templates/tabbed-demo.html',
    link: function($scope, $element, $attributes) {
      $scope.htmlSource = $attributes.htmlSource;
      $scope.jsSource = $attributes.jsSource ? $attributes.jsSource : null;
      $scope.formData = $scope.ctrl ? $scope.ctrl.formData : {};
    }
  };
});

angular.module('formForDocumentation').directive('disableFieldButton', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/templates/disable-field-button.html',
    scope: {
      isDisabled: '='
    }
  };
});

angular.module('formForDocumentation').directive('validateFieldButton', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/templates/validate-field-button.html',
    scope: {
      fieldName: '@',
      formController: '='
    },
    controller: ["$scope", function($scope) {
      $scope.validateField = function() {
        $scope.formController.validateField($scope.fieldName, true);
      };
    }]
  };
});

angular.module('formForDocumentation').directive('resetFieldButton', function() {
  return {
    restrict: 'E',
    templateUrl: 'app/templates/reset-field-button.html',
    scope: {
      fieldName: '@',
      formController: '='
    },
    controller: ["$scope", function($scope) {
      $scope.resetField = function() {
        $scope.formController.resetField($scope.fieldName);
      };
    }]
  };
});

angular.module('formForDocumentation').value('currentTemplates', {
  key: 'default'
});

angular.module('formForDocumentation').directive('templateToggler', ["$ocLazyLoad", "$state", "$stateParams", "currentTemplates", function($ocLazyLoad, $state, $stateParams, currentTemplates) {
  var baseUrl = '//rawgit.com/bvaughn/angular-form-for/4.1.6/dist/';
  var map = {};
  map['bootstrap'] = ['formFor.bootstrapTemplates', baseUrl + 'form-for.bootstrap-templates.js'];
  map['default'] = ['formFor.defaultTemplates', baseUrl + 'form-for.default-templates.js'];
  map['material'] = ['formFor.materialTemplates', baseUrl + 'form-for.material-templates.js'];

  return {
    restrict: 'E',
    templateUrl: 'app/templates/template-toggler.html',
    scope: {
      message: '@?'
    },
    link: function($scope) {
      $scope.current = currentTemplates.key;

      $scope.load = function(key) {
        $scope.current = currentTemplates.key = key;

        var module = map[key][0];
        var url = map[key][1];

        var modules = $ocLazyLoad.getModules();
        var index = modules.indexOf(module);

        if (index >= 0) {
          modules.splice(index, 1);
        }

        $ocLazyLoad.load({
          name: module,
          cache: false,
          files: [url]
        }).then(function() {
          $state.go($state.current, $stateParams, {reload: true});
        });

        return false;
      }
    }
  };
}]);

angular.module('formForDocumentation').directive('githubInfo', ["Github", function(Github) {
  return {
    restrict: 'EA',
    templateUrl: 'app/templates/github-info.html',
    controller: ["$scope", function($scope) {
      $scope.githubData = Github.load().$object;
    }]
  };
}]);

/**
 * Renders a link to documentation for the specified class.
 */
angular.module('formForDocumentation').directive('doclink',
  function() {
    return {
      restrict: 'EA',
      scope: {
        name: '@'
      },
      templateUrl: 'app/templates/doclink.html'
    };
  });

/**
 * Renders a link to documentation for the specified class.
 */
angular.module('formForDocumentation').directive('navdoclink',
  function() {
    return {
      restrict: 'EA',
      scope: {
        name: '@'
      },
      templateUrl: 'app/templates/navdoclink.html'
    };
  });

/**
 * Renders example usage code snippets using the Prism JS library for syntax highlighting.
 */
angular.module('formForDocumentation').directive('usage',
  function() {
    return {
      restrict: 'EA',
      scope: {
        source: '@'
      },
      templateUrl: 'app/templates/usage.html',
      link: function($scope, $element, $attributes) {
        $scope.parser = $attributes['parser'] || 'javascript';
        $scope.heading = $attributes['heading'] || 'Usage';
      }
    };
  });

/**
 * Renders a method signature doc including (optional) typed parameters and (optional) return type information.
 */
angular.module('formForDocumentation').directive('signature',
  ["$sce", function($sce) {
    return {
      restrict: 'EA',
      scope: {
        params: '=?',
        returnType: '@'
      },
      link: function($scope, $element, $attributes) {
        $scope.heading = $attributes['heading'] || 'Params';

        $scope.trust = function(value) {
          return $sce.trustAsHtml(value);
        }
        
        if ($attributes.return) {
          if ($attributes.return.indexOf('{') >= 0) {
            var parsed = $scope.$eval($attributes.return);

            $scope.returnDescription = $sce.trustAsHtml(parsed.description);
            $scope.returnType = parsed.type;
          } else {
            $scope.returnType = $sce.trustAsHtml($attributes.return);
          }
        }
      },
      templateUrl: 'app/templates/signature.html'
    };
  }]);

/**
 * Renders a template displaying the various errors a method may throw.
 */
angular.module('formForDocumentation').directive('throws',
  function() {
    return {
      restrict: 'EA',
      scope: {
        errors: '='
      },
      templateUrl: 'app/templates/throws.html'
    };
  });

/**
 * Renders a class type with a link to the source code and a docs issue button.
 */
angular.module('formForDocumentation').directive('classname',
  function() {
    return {
      restrict: 'EA',
      scope: {
        name: '@',
        source: '@',
        super: '@?'
      },
      templateUrl: 'app/templates/classname.html'
    };
  });


/* **********************************************
     Begin prism-core.js
********************************************** */

self = (typeof window !== 'undefined')
  ? window   // if in browser
  : (
    (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
    ? self // if in worker
    : {}   // if in node js
  );

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

var _ = self.Prism = {
  util: {
    encode: function (tokens) {
      if (tokens instanceof Token) {
        return new Token(tokens.type, _.util.encode(tokens.content));
      } else if (_.util.type(tokens) === 'Array') {
        return tokens.map(_.util.encode);
      } else {
        return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
      }
    },

    type: function (o) {
      return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
    },

    // Deep clone a language definition (e.g. to extend it)
    clone: function (o) {
      var type = _.util.type(o);

      switch (type) {
        case 'Object':
          var clone = {};

          for (var key in o) {
            if (o.hasOwnProperty(key)) {
              clone[key] = _.util.clone(o[key]);
            }
          }

          return clone;

        case 'Array':
          return o.slice();
      }

      return o;
    }
  },

  languages: {
    extend: function (id, redef) {
      var lang = _.util.clone(_.languages[id]);

      for (var key in redef) {
        lang[key] = redef[key];
      }

      return lang;
    },

    // Insert a token before another token in a language literal
    insertBefore: function (inside, before, insert, root) {
      root = root || _.languages;
      var grammar = root[inside];
      var ret = {};

      for (var token in grammar) {

        if (grammar.hasOwnProperty(token)) {

          if (token == before) {

            for (var newToken in insert) {

              if (insert.hasOwnProperty(newToken)) {
                ret[newToken] = insert[newToken];
              }
            }
          }

          ret[token] = grammar[token];
        }
      }

      return root[inside] = ret;
    },

    // Traverse a language definition with Depth First Search
    DFS: function(o, callback) {
      for (var i in o) {
        callback.call(o, i, o[i]);

        if (_.util.type(o) === 'Object') {
          _.languages.DFS(o[i], callback);
        }
      }
    }
  },

  highlightAll: function(async, callback) {
    var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

    for (var i=0, element; element = elements[i++];) {
      _.highlightElement(element, async === true, callback);
    }
  },

  highlightElement: function(element, async, callback) {
    // Find language
    var language, grammar, parent = element;

    while (parent && !lang.test(parent.className)) {
      parent = parent.parentNode;
    }

    if (parent) {
      language = (parent.className.match(lang) || [,''])[1];
      grammar = _.languages[language];
    }

    if (!grammar) {
      return;
    }

    // Set language on the element, if not present
    element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

    // Set language on the parent, for styling
    parent = element.parentNode;

    if (/pre/i.test(parent.nodeName)) {
      parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
    }

    var code = element.textContent;

    if(!code) {
      return;
    }

    var env = {
      element: element,
      language: language,
      grammar: grammar,
      code: code
    };

    _.hooks.run('before-highlight', env);

    if (async && self.Worker) {
      var worker = new Worker(_.filename);

      worker.onmessage = function(evt) {
        env.highlightedCode = Token.stringify(JSON.parse(evt.data), language);

        _.hooks.run('before-insert', env);

        env.element.innerHTML = env.highlightedCode;

        callback && callback.call(env.element);
        _.hooks.run('after-highlight', env);
      };

      worker.postMessage(JSON.stringify({
        language: env.language,
        code: env.code
      }));
    }
    else {
      env.highlightedCode = _.highlight(env.code, env.grammar, env.language)

      _.hooks.run('before-insert', env);

      env.element.innerHTML = env.highlightedCode;

      callback && callback.call(element);

      _.hooks.run('after-highlight', env);
    }
  },

  highlight: function (text, grammar, language) {
    var tokens = _.tokenize(text, grammar);
    return Token.stringify(_.util.encode(tokens), language);
  },

  tokenize: function(text, grammar, language) {
    var Token = _.Token;

    var strarr = [text];

    var rest = grammar.rest;

    if (rest) {
      for (var token in rest) {
        grammar[token] = rest[token];
      }

      delete grammar.rest;
    }

    tokenloop: for (var token in grammar) {
      if(!grammar.hasOwnProperty(token) || !grammar[token]) {
        continue;
      }

      var patterns = grammar[token];
      patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

      for (var j = 0; j < patterns.length; ++j) {
        var pattern = patterns[j],
          inside = pattern.inside,
          lookbehind = !!pattern.lookbehind,
          lookbehindLength = 0;

        pattern = pattern.pattern || pattern;

        for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop

          var str = strarr[i];

          if (strarr.length > text.length) {
            // Something went terribly wrong, ABORT, ABORT!
            break tokenloop;
          }

          if (str instanceof Token) {
            continue;
          }

          pattern.lastIndex = 0;

          var match = pattern.exec(str);

          if (match) {
            if(lookbehind) {
              lookbehindLength = match[1].length;
            }

            var from = match.index - 1 + lookbehindLength,
              match = match[0].slice(lookbehindLength),
              len = match.length,
              to = from + len,
              before = str.slice(0, from + 1),
              after = str.slice(to + 1);

            var args = [i, 1];

            if (before) {
              args.push(before);
            }

            var wrapped = new Token(token, inside? _.tokenize(match, inside) : match);

            args.push(wrapped);

            if (after) {
              args.push(after);
            }

            Array.prototype.splice.apply(strarr, args);
          }
        }
      }
    }

    return strarr;
  },

  hooks: {
    all: {},

    add: function (name, callback) {
      var hooks = _.hooks.all;

      hooks[name] = hooks[name] || [];

      hooks[name].push(callback);
    },

    run: function (name, env) {
      var callbacks = _.hooks.all[name];

      if (!callbacks || !callbacks.length) {
        return;
      }

      for (var i=0, callback; callback = callbacks[i++];) {
        callback(env);
      }
    }
  }
};

var Token = _.Token = function(type, content) {
  this.type = type;
  this.content = content;
};

Token.stringify = function(o, language, parent) {
  if (typeof o == 'string') {
    return o;
  }

  if (Object.prototype.toString.call(o) == '[object Array]') {
    return o.map(function(element) {
      return Token.stringify(element, language, o);
    }).join('');
  }

  var env = {
    type: o.type,
    content: Token.stringify(o.content, language, parent),
    tag: 'span',
    classes: ['token', o.type],
    attributes: {},
    language: language,
    parent: parent
  };

  if (env.type == 'comment') {
    env.attributes['spellcheck'] = 'true';
  }

  _.hooks.run('wrap', env);

  var attributes = '';

  for (var name in env.attributes) {
    attributes += name + '="' + (env.attributes[name] || '') + '"';
  }

  return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

};

if (!self.document) {
  if (!self.addEventListener) {
    // in Node.js
    return self.Prism;
  }
  // In worker
  self.addEventListener('message', function(evt) {
    var message = JSON.parse(evt.data),
        lang = message.language,
        code = message.code;

    self.postMessage(JSON.stringify(_.tokenize(code, _.languages[lang])));
    self.close();
  }, false);

  return self.Prism;
}

// Get current script and highlight
var script = document.getElementsByTagName('script');

script = script[script.length - 1];

if (script) {
  _.filename = script.src;

  if (document.addEventListener && !script.hasAttribute('data-manual')) {
    document.addEventListener('DOMContentLoaded', _.highlightAll);
  }
}

return self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
  'comment': /<!--[\w\W]*?-->/g,
  'prolog': /<\?.+?\?>/,
  'doctype': /<!DOCTYPE.+?>/,
  'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
  'tag': {
    pattern: /<\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+))?\s*)*\/?>/gi,
    inside: {
      'tag': {
        pattern: /^<\/?[\w:-]+/i,
        inside: {
          'punctuation': /^<\/?/,
          'namespace': /^[\w-]+?:/
        }
      },
      'attr-value': {
        pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
        inside: {
          'punctuation': /=|>|"/g
        }
      },
      'punctuation': /\/?>/g,
      'attr-name': {
        pattern: /[\w:-]+/g,
        inside: {
          'namespace': /^[\w-]+?:/
        }
      }

    }
  },
  'entity': /\&#?[\da-z]{1,8};/gi
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

  if (env.type === 'entity') {
    env.attributes['title'] = env.content.replace(/&amp;/, '&');
  }
});


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
  'comment': /\/\*[\w\W]*?\*\//g,
  'atrule': {
    pattern: /@[\w-]+?.*?(;|(?=\s*{))/gi,
    inside: {
      'punctuation': /[;:]/g
    }
  },
  'url': /url\((["']?).*?\1\)/gi,
  'selector': /[^\{\}\s][^\{\};]*(?=\s*\{)/g,
  'property': /(\b|\B)[\w-]+(?=\s*:)/ig,
  'string': /("|')(\\?.)*?\1/g,
  'important': /\B!important\b/gi,
  'punctuation': /[\{\};:]/g,
  'function': /[-a-z0-9]+(?=\()/ig
};

if (Prism.languages.markup) {
  Prism.languages.insertBefore('markup', 'tag', {
    'style': {
      pattern: /<style[\w\W]*?>[\w\W]*?<\/style>/ig,
      inside: {
        'tag': {
          pattern: /<style[\w\W]*?>|<\/style>/ig,
          inside: Prism.languages.markup.tag.inside
        },
        rest: Prism.languages.css
      }
    }
  });
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
  'comment': [
    {
      pattern: /(^|[^\\])\/\*[\w\W]*?\*\//g,
      lookbehind: true
    },
    {
      pattern: /(^|[^\\:])\/\/.*?(\r?\n|$)/g,
      lookbehind: true
    }
  ],
  'string': /("|')(\\?.)*?\1/g,
  'class-name': {
    pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/ig,
    lookbehind: true,
    inside: {
      punctuation: /(\.|\\)/
    }
  },
  'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/g,
  'boolean': /\b(true|false)\b/g,
  'function': {
    pattern: /[a-z0-9_]+\(/ig,
    inside: {
      punctuation: /\(/
    }
  },
  'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
  'operator': /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|\~|\^|\%/g,
  'ignore': /&(lt|gt|amp);/gi,
  'punctuation': /[{}[\];(),.:]/g
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
  'keyword': /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/g,
  'number': /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?|NaN|-?Infinity)\b/g
});

Prism.languages.insertBefore('javascript', 'keyword', {
  'regex': {
    pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
    lookbehind: true
  }
});

if (Prism.languages.markup) {
  Prism.languages.insertBefore('markup', 'tag', {
    'script': {
      pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/ig,
      inside: {
        'tag': {
          pattern: /<script[\w\W]*?>|<\/script>/ig,
          inside: Prism.languages.markup.tag.inside
        },
        rest: Prism.languages.javascript
      }
    }
  });
}


/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function(){

if (!self.Prism || !self.document || !document.querySelector) {
  return;
}

var Extensions = {
  'js': 'javascript',
  'html': 'markup',
  'svg': 'markup',
  'xml': 'markup',
  'py': 'python'
};

Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function(pre) {
  var src = pre.getAttribute('data-src');
  var extension = (src.match(/\.(\w+)$/) || [,''])[1];
  var language = Extensions[extension] || extension;

  var code = document.createElement('code');
  code.className = 'language-' + language;

  pre.textContent = '';

  code.textContent = 'Loading…';

  pre.appendChild(code);

  var xhr = new XMLHttpRequest();

  xhr.open('GET', src, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {

      if (xhr.status < 400 && xhr.responseText) {
        code.textContent = xhr.responseText;

        Prism.highlightElement(code);
      }
      else if (xhr.status >= 400) {
        code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
      }
      else {
        code.textContent = '✖ Error: File does not exist or is empty';
      }
    }
  };

  xhr.send(null);
});

})();

angular.module('formForDocumentation').service('Github', ["$http", "$q", function($http, $q) {
  this.load = function() {
    var deferred = $q.defer();
    deferred.promise.$object = {};

    $http.get('https://api.github.com/repos/bvaughn/angular-form-for').
      success(
        function(response) {
          deferred.promise.$object.forks = response.forks_count;
          deferred.promise.$object.forks_url = response.html_url + '/network';
          deferred.promise.$object.stargazers = response.stargazers_count;
          deferred.promise.$object.stargazers_url = response.html_url + '/stargazers';
          deferred.promise.$object.url = response.html_url;
          deferred.promise.$object.watchers = response.subscribers_count;
          deferred.promise.$object.watchers_url = response.html_url + '/watchers';

          deferred.resolve(deferred.promise.$object);
        }).
      error(deferred.reject);

    return deferred.promise;
  };
}]);

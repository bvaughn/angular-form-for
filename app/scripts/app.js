angular.module('formForDocumentation', ['oc.lazyLoad', 'flashr', 'formFor', 'formFor.bootstrapTemplates', 'ngRoute', 'ui.bootstrap', 'ui.router']).
  config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('app', {
      'abstract': true,
      url: '',
      templateUrl: 'app/views/partials/layout.html'
    });

    // Reports

    $stateProvider.state('app.simpleForm', {
      url: '/demo/simple-form',
      templateUrl: 'app/views/simple-form.html',
      controller: 'SimpleFormDemoController'
    });

    $stateProvider.state('app.advancedForm', {
      url: '/demo/advanced-form',
      templateUrl: 'app/views/advanced-form.html',
      controller: 'AdvancedFormDemoController'
    });

    $stateProvider.state('app.dynamicForm', {
      url: '/demo/dynamic-form',
      templateUrl: 'app/views/dynamic-dropdowns.html',
      controller: 'DynamicDropdownsDemoController'
    });

    $stateProvider.state('app.dynamicIcons', {
      url: '/demo/dynamic-icons',
      templateUrl: 'app/views/dynamic-icons.html',
      controller: 'DynamicIconsDemoController'
    });

    $stateProvider.state('app.collectionsForm', {
      url: '/demo/collections-form',
      templateUrl: 'app/views/collections.html',
      controller: 'CollectionsDemoController'
    });

    $stateProvider.state('app.formMetadata', {
      url: '/demo/form-metadata',
      templateUrl: 'app/views/form-metadata.html',
      controller: 'FormMetadataDemoController'
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
      controller: 'IndexController'
    });

    $urlRouterProvider.otherwise('/index');
  });

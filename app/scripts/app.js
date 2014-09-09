angular.module('formForDocumentation', ['oc.lazyLoad', 'flashr', 'formFor', 'formFor.bootstrapTemplates', 'ngRoute', 'ui.bootstrap']).
  config(function($routeProvider) {
    $routeProvider.when('/index', {templateUrl: 'app/views/index.html', controller: 'IndexController'});

    $routeProvider.when('/demo/simple-form', {templateUrl: 'app/views/simple-form.html', controller: 'SimpleFormDemoController'});
    $routeProvider.when('/demo/advanced-form', {templateUrl: 'app/views/advanced-form.html', controller: 'AdvancedFormDemoController'});
    $routeProvider.when('/demo/dynamic-dropdowns', {templateUrl: 'app/views/dynamic-dropdowns.html', controller: 'DynamicDropdownsDemoController'});
    $routeProvider.when('/demo/dynamic-icons', {templateUrl: 'app/views/dynamic-icons.html', controller: 'DynamicIconsDemoController'});
    $routeProvider.when('/demo/collections', {templateUrl: 'app/views/collections.html', controller: 'CollectionsDemoController'});
    $routeProvider.when('/demo/form-metadata', {templateUrl: 'app/views/form-metadata.html', controller: 'FormMetadataDemoController'});

    $routeProvider.when('/overview', {templateUrl: 'app/views/overview.html'});
    $routeProvider.when('/input-types', {templateUrl: 'app/views/input-types.html'});
    $routeProvider.when('/validation-types', {templateUrl: 'app/views/validation-types.html'});
    $routeProvider.when('/template-overrides', {templateUrl: 'app/views/template-overrides.html'});
    $routeProvider.when('/ie8-support', {templateUrl: 'app/views/ie8-support.html'});

    $routeProvider.otherwise({redirectTo: '/index'});
  });

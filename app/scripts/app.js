angular.module('formForDocumentation', ['formFor', 'ngRoute']).
  config(function($routeProvider) {
    $routeProvider.when('/index', {templateUrl: 'views/index.html', controller: 'IndexController'});

    $routeProvider.when('/demo/simple-form', {templateUrl: 'views/simple-form.html', controller: 'SimpleFormDemoController'});
    $routeProvider.when('/demo/advanced-form', {templateUrl: 'views/advanced-form.html', controller: 'AdvancedFormDemoController'});
    $routeProvider.when('/demo/dynamic-dropdowns', {templateUrl: 'views/dynamic-dropdowns.html', controller: 'DynamicDropdownsDemoController'});

    $routeProvider.when('/overview', {templateUrl: 'views/overview.html', controller: 'OverviewController'});
    $routeProvider.when('/input-types', {templateUrl: 'views/input-types.html', controller: 'InputTypesController'});
    $routeProvider.when('/validation-types', {templateUrl: 'views/validation-types.html', controller: 'ValidationTypesController'});
    $routeProvider.when('/template-overrides', {templateUrl: 'views/template-overrides.html', controller: 'TemplateOverridesController'});
    $routeProvider.when('/ie8-support', {templateUrl: 'views/ie8-support.html', controller: 'IE8SupportController'});
    $routeProvider.otherwise({redirectTo: '/index'});
  });

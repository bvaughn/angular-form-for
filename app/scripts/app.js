angular.module('formForDocumentation', ['formFor', 'ngRoute']).
  config(function($routeProvider) {
    $routeProvider.when('/index', {templateUrl: 'app/views/index.html', controller: 'IndexController'});

    $routeProvider.when('/demo/simple-form', {templateUrl: 'app/views/simple-form.html', controller: 'SimpleFormDemoController'});
    $routeProvider.when('/demo/advanced-form', {templateUrl: 'app/views/advanced-form.html', controller: 'AdvancedFormDemoController'});
    $routeProvider.when('/demo/dynamic-dropdowns', {templateUrl: 'app/views/dynamic-dropdowns.html', controller: 'DynamicDropdownsDemoController'});

    $routeProvider.when('/overview', {templateUrl: 'app/views/overview.html', controller: 'OverviewController'});
    $routeProvider.when('/input-types', {templateUrl: 'app/views/input-types.html', controller: 'InputTypesController'});
    $routeProvider.when('/validation-types', {templateUrl: 'app/views/validation-types.html', controller: 'ValidationTypesController'});
    $routeProvider.when('/template-overrides', {templateUrl: 'app/views/template-overrides.html', controller: 'TemplateOverridesController'});
    $routeProvider.when('/ie8-support', {templateUrl: 'app/views/ie8-support.html', controller: 'IE8SupportController'});
    $routeProvider.otherwise({redirectTo: '/index'});
  });

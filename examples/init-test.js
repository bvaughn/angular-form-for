function init(callback) {

  // http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
  var getUrlParameter = function(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  };

  var loadingResources = [];

  var resourceLoaded = function(resource) {
    console.log('Resource loaded: ' + resource);

    loadingResources.splice(loadingResources.indexOf(resource), 1);

    // Once all resources have loaded, proceed to bootstrap the application
    if (loadingResources.length == 0) {
      console.log('Initiliazing module');

      var module = angular.module('ExampleApp', dependencies);
      module.controller('ExampleController', function($scope, $timeout) {
        $scope.controller = {};
        $scope.formData = {};
        $scope.validation = {};

        callback($scope);

        $scope.$watch('controller', function(controller) {
          $timeout(function() {
            controller.validateForm(true);
          }, 1);
        });
      });

      var body = $('body');
      body.attr('ng-controller', 'ExampleController');

      angular.bootstrap(body, ['ExampleApp']);
    }
  };

  // Load CSS stylesheets
  var loadStylesheet = function(source) {
    console.log('Loading style: ' + source);

    loadingResources.push(source);

    $.get(source)
      .done(function(response) {
        $('head').append(`<style type="text/css">${response}</style>`);

        resourceLoaded(source);
      })
      .fail(function() {
        console.warn('Resource failed: ' + source);
      });
  };

  // Load JS script
  var loadScript = function(source) {
    console.log('Loading script: ' + source);

    loadingResources.push(source);

    $.getScript(source)
      .done(function () {
        resourceLoaded(source);
      })
      .fail(function() {
        console.warn('Resource failed: ' + source);
      });
  };

  // Load scripts needed by all tests
  loadScript('/dist/form-for.js');
  loadScript('/node_modules/angular-aria/angular-aria.js');
  loadScript('/node_modules/angular-route/angular-route.js');

  var dependencies = [
    'formFor',
    'ngRoute'
  ];

  // Load the additional dependencies needed by the targed template.
  switch (getUrlParameter('template')) {
    case 'bootstrap':
      loadScript('/dist/form-for.bootstrap-templates.js');
      loadScript('/node_modules/angular-bootstrap-npm/dist/angular-bootstrap.js');
      loadStylesheet('/node_modules/bootstrap/dist/css/bootstrap.css');
      loadStylesheet('/node_modules/font-awesome/css/font-awesome.css');

      dependencies.push('formFor.bootstrapTemplates');
      dependencies.push('ui.bootstrap');
      break;
    case 'material':
      loadScript('/dist/form-for.material-templates.js');
      loadScript('/node_modules/angular-animate/angular-animate.js');
      loadScript('/node_modules/angular-material/angular-material.js');
      loadStylesheet('/node_modules/angular-material/angular-material.css');

      dependencies.push('ngMaterial');
      dependencies.push('formFor.materialTemplates');
      break;
    case 'default':
    default:
      loadScript('/dist/form-for.default-templates.js');
      loadStylesheet('/dist/form-for.css');

      dependencies.push('formFor.defaultTemplates');
      break;
  }
}
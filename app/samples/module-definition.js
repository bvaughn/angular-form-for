// formFor directives and services only; no templates
angular.module('myAngularApp', ['formFor']);

// formFor and Bootstrap-friendly HTML templates
angular.module('myAngularApp', ['formFor', 'formFor.bootstrapTemplates']);

// formFor and it's default HTML templates (requiring formFor stylesheets)
angular.module('myAngularApp', ['formFor', 'formFor.defaultTemplates']);

// formFor directives and services only; no templates
angular.module('myAngularApp', ['formFor']);

// formFor and Bootstrap-friendly HTML templates
angular.module('myAngularApp', ['formFor', 'formFor.bootstrapTemplates']);

// formFor and default HTML templates
angular.module('myAngularApp', ['formFor', 'formFor.defaultTemplates']);

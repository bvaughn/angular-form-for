// formFor directives and services only; no templates
angular.module('myAngularApp', ['formFor']);

// formFor and Bootstrap-friendly HTML templates
angular.module('myAngularApp', ['formFor', 'formFor.bootstrapTemplates']);

// formFor and Angular "Material Design" templates
angular.module('myAngularApp', ['formFor', 'formFor.materialTemplates']);

// formFor and its default HTML templates (requiring formFor stylesheets)
angular.module('myAngularApp', ['formFor', 'formFor.defaultTemplates']);

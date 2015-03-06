/// <reference path="../definitions/angular.d.ts" />

angular.module('formFor', [])
  .service('FormForConfiguration', () => new FormForConfiguration())
  .service('FieldHelper', (FormForConfiguration) => new FieldHelper(FormForConfiguration))
  .service('ModelValidator',
    ($interpolate, $parse, $q, FormForConfiguration) =>
      new ModelValidator($interpolate, $parse, $q, FormForConfiguration));
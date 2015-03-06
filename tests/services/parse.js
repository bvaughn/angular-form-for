describe('$parse', function() {
  'use strict';

  beforeEach(module('formFor'));

  var $parse;

  beforeEach(inject(function ($injector) {
    $parse = $injector.get('$parse');
  }));

  describe('StringUtil', function() {
    it('should gracefully handle null and empty strings', function() {
      var data = {};

      $parse('names[0]').assign(data, 'value');

      expect(data.names[0]).toEqual('value');
    });
  });
});

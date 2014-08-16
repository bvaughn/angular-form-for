describe('qDecorator', function() {
  'use strict';

  beforeEach(module('formFor'));

  var StringUtil;

  beforeEach(inject(function ($injector) {
    StringUtil = $injector.get('StringUtil');
  }));

  describe('StringUtil', function() {
    it('should gracefully handle null and empty strings', function() {
      expect(StringUtil.humanize(null)).toEqual('');
      expect(StringUtil.humanize(undefined)).toEqual('');
      expect(StringUtil.humanize('')).toEqual('');
    });

    it('should convert snake-case variables to humanized strings', function() {
      expect(StringUtil.humanize('snake_case')).toEqual('Snake Case');
      expect(StringUtil.humanize('snake_case_too')).toEqual('Snake Case Too');
    });

    it('should convert camel-case variables to humanized strings', function() {
      expect(StringUtil.humanize('camelCase')).toEqual('Camel Case');
      expect(StringUtil.humanize('camelCaseToo')).toEqual('Camel Case Too');
    });

    it('should not convert already-humanized strings', function() {
      expect(StringUtil.humanize('Word')).toEqual('Word');
      expect(StringUtil.humanize('Humanized String')).toEqual('Humanized String');
    });
  });
});

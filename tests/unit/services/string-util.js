describe('StringUtil', function() {
  'use strict';

  beforeEach(module('formFor'));

  describe('StringUtil', function() {
    it('should gracefully handle null and empty strings', function() {
      expect(formFor.StringUtil.humanize(null)).toEqual('');
      expect(formFor.StringUtil.humanize(undefined)).toEqual('');
      expect(formFor.StringUtil.humanize('')).toEqual('');
    });

    it('should convert snake-case variables to humanized strings', function() {
      expect(formFor.StringUtil.humanize('snake_case')).toEqual('Snake Case');
      expect(formFor.StringUtil.humanize('snake_case_too')).toEqual('Snake Case Too');
    });

    it('should convert camel-case variables to humanized strings', function() {
      expect(formFor.StringUtil.humanize('camelCase')).toEqual('Camel Case');
      expect(formFor.StringUtil.humanize('camelCaseToo')).toEqual('Camel Case Too');
    });

    it('should not convert already-humanized strings', function() {
      expect(formFor.StringUtil.humanize('Word')).toEqual('Word');
      expect(formFor.StringUtil.humanize('Humanized String')).toEqual('Humanized String');
    });
  });
});

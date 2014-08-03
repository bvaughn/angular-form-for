describe('NestedObjectHelper', function() {
  'use strict';

  beforeEach(module('formFor'));

  var NestedObjectHelper;

  beforeEach(inject(function ($injector) {
    NestedObjectHelper = $injector.get('NestedObjectHelper');
  }));

  describe('flattenAttribute', function() {
    it('should strip dot notation syntax from a string containing it', function() {
      expect(NestedObjectHelper.flattenAttribute('foo.bar.baz')).not.toMatch(/\./);
    });

    it('should not correct a string without dot notation', function() {
      expect(NestedObjectHelper.flattenAttribute('foo')).toMatch('foo');
    });
  });

  describe('flattenObjectKeys', function() {
    it('should iterate over all of the keys in a shallow object', function() {
      var keys = NestedObjectHelper.flattenObjectKeys({
        foo: 1,
        bar: 'two',
        baz: true
      });

      expect(keys).toContain('foo');
      expect(keys).toContain('bar');
      expect(keys).toContain('baz');
    });

    it('should iterate over all of the keys in a deep object', function() {
      var keys = NestedObjectHelper.flattenObjectKeys({
        foo: 1,
        deep: {
          bar: 'two',
          deeper: {
            baz: true
          }
        }
      });

      expect(keys).toContain('foo');
      expect(keys).toContain('deep.bar');
      expect(keys).toContain('deep.deeper.baz');
    });
  });

  describe('readAttribute', function() {
    var object = {
      foo: 123,
      bar: {
        baz: 456
      }
    };

    it('should read shallow attributes', function() {
      expect(NestedObjectHelper.readAttribute(object, 'foo')).toBe(123);
    });

    it('should read deep attributes using dot notation', function() {
      expect(NestedObjectHelper.readAttribute(object, 'bar.baz')).toBe(456);
    });

    it('should handle attributes that are missing', function() {
      expect(NestedObjectHelper.readAttribute(object, 'fake')).toBeFalsy();
    });
  });

  describe('writeAttribute', function() {
    var object = {
      foo: 123,
      bar: {
        baz: 456
      }
    };

    it('should write shallow attributes', function() {
      NestedObjectHelper.writeAttribute(object, 'foo', 'new value');

      expect(object.foo).toMatch('new value');
    });

    it('should write deep attributes using dot notation', function() {
      NestedObjectHelper.writeAttribute(object, 'bar.baz', 'woohoo');

      expect(object.bar.baz).toMatch('woohoo');
    });

    it('should handle attributes that are missing', function() {
      NestedObjectHelper.writeAttribute(object, 'nonexistent', 'brand new');

      expect(object.nonexistent).toMatch('brand new');
    });
  });

});

describe('NestedObjectHelper', function() {
  'use strict';

  beforeEach(module('formFor'));

  var nestedObjectHelper;

  beforeEach(inject(function ($injector) {
    var $parse = $injector.get('$parse');

    nestedObjectHelper = new formFor.NestedObjectHelper($parse);
  }));

  describe('flattenAttribute', function() {
    it('should strip dot notation syntax from a string containing it', function() {
      expect(nestedObjectHelper.flattenAttribute('foo.bar.baz')).not.toMatch(/\./);
    });

    it('should not adjust a string without dot notation', function() {
      expect(nestedObjectHelper.flattenAttribute('foo')).toMatch('foo');
    });

    it('should handle array notation', function() {
      expect(nestedObjectHelper.flattenAttribute('foo[1].bar')).toMatch('foo___1___bar');
    });
  });

  describe('flattenObjectKeys', function() {
    it('should iterate over all of the keys in a shallow object', function() {
      var keys = nestedObjectHelper.flattenObjectKeys({
        foo: 1,
        bar: 'two',
        baz: true
      });

      expect(keys).toContain('foo');
      expect(keys).toContain('bar');
      expect(keys).toContain('baz');
    });

    it('should iterate over all of the keys in a deep object', function() {
      var keys = nestedObjectHelper.flattenObjectKeys({
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

    it('should iterate over items in an array', function() {
      var keys = nestedObjectHelper.flattenObjectKeys({
        foo: [
          'string',
          {
            bar: true,
            baz: 'yes'
          }
        ]
      });

      expect(keys).toContain('foo[0]');
      expect(keys).toContain('foo[1]');
      expect(keys).toContain('foo[1].bar');
      expect(keys).toContain('foo[1].baz');
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
      expect(nestedObjectHelper.readAttribute(object, 'foo')).toBe(123);
    });

    it('should read deep attributes using dot notation', function() {
      expect(nestedObjectHelper.readAttribute(object, 'bar.baz')).toBe(456);
    });

    it('should handle attributes that are missing', function() {
      expect(nestedObjectHelper.readAttribute(object, 'fake')).toBeFalsy();
    });

    it('should handle array notation when array is empty or non-existent', function() {
      object = {
        empty: []
      };

      expect(nestedObjectHelper.readAttribute(object, 'empty[0]')).toBeFalsy();
      expect(nestedObjectHelper.readAttribute(object, 'nonexistent[0]')).toBeFalsy();
    });

    it('should handle array notation by reading values from an array at the specified index', function() {
      object = {
        array: ['one']
      };

      expect(nestedObjectHelper.readAttribute(object, 'array[0]')).toMatch('one');
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
      nestedObjectHelper.writeAttribute(object, 'foo', 'new value');

      expect(object.foo).toMatch('new value');
    });

    it('should write deep attributes using dot notation', function() {
      nestedObjectHelper.writeAttribute(object, 'bar.baz', 'woohoo');

      expect(object.bar.baz).toMatch('woohoo');
    });

    it('should handle attributes that are missing', function() {
      nestedObjectHelper.writeAttribute(object, 'nonexistent', 'brand new');

      expect(object.nonexistent).toMatch('brand new');
    });

    it('should handle array notation by creating arrays that do not yet exist', function() {
      nestedObjectHelper.writeAttribute(object, 'collection[0]', 'first item');

      expect(object.collection).toBeTruthy();
      expect(object.collection[0]).toMatch('first item');
    });

    it('should handle array notation by creating indexes that do not yet exist', function() {
      object.collection = ['one'];

      nestedObjectHelper.writeAttribute(object, 'collection[1]', 'two');

      expect(object.collection).toBeTruthy();
      expect(object.collection[0]).toMatch('one');
      expect(object.collection[1]).toMatch('two');
    });

    it('should handle array notation with nested objects for indexes that do not yet exist', function() {
      object.collection = [];

      nestedObjectHelper.writeAttribute(object, 'collection[0].number', 'one');

      expect(object.collection).toBeTruthy();
      expect(object.collection[0].number).toMatch('one');
    });

    it('should handle array notation by writing values to an array at the specified index', function() {
      object.collection = ['old'];

      nestedObjectHelper.writeAttribute(object, 'collection[0]', 'new');

      expect(object.collection).toBeTruthy();
      expect(object.collection[0]).toMatch('new');
    });

    it('should handle array notation with nested objects for indexes that already exist', function() {
      object.collection = [{
        foo: 'FOO',
        bar: 'BAR'
      }];

      nestedObjectHelper.writeAttribute(object, 'collection[0].bar', 'RAB');
      nestedObjectHelper.writeAttribute(object, 'collection[0].baz', 'BAZ');

      expect(object.collection).toBeTruthy();
      expect(object.collection[0].foo).toMatch('FOO');
      expect(object.collection[0].bar).toMatch('RAB');
      expect(object.collection[0].baz).toMatch('BAZ');
    });
  });
});

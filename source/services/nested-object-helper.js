/**
 * Helper utility to simplify working with nested objects.
 */
angular.module('formFor').service('NestedObjectHelper', function($parse) {
  var sanitizeAttribute = function(attribute) {
    return attribute.replace('[]', '');
  }

  return {

    flattenAttribute: function(attribute) {
      return sanitizeAttribute(attribute).replace(/\./g, '___');
    },

    /**
     * Crawls an object and returns a flattened set of all attributes using dot notation.
     * This converts an Object like: {foo: {bar: true}, baz: true}
     * Into an Array like ['foo', 'foo.bar', 'baz']
     */
    flattenObjectKeys: function(object) {
      var keys = [];
      var queue = [{
        object: object,
        prefix: null
      }];

      while (true) {
        if (queue.length === 0) {
          break;
        }

        var data = queue.pop();
        var prefix = data.prefix ? data.prefix + '.' : '';

        if (typeof data.object === 'object') {
          for (var prop in data.object) {
            var path = prefix + prop;

            keys.push(path);

            queue.push({
              object: data.object[prop],
              prefix: path
            });
          }
        }
      }

      return keys;
    },

    /**
     * Returns the value defined by the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     *
     * @param object Object
     * @param attribute Attribute (or dot-notation path)
     */
    readAttribute: function(object, attribute) {
      return $parse(sanitizeAttribute(attribute))(object);
    },

    /**
     * Writes the specified value to the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     *
     * @param object Object
     * @param attribute Attribute (or dot-notation path)
     * @param value Value to be written
     */
    writeAttribute: function(object, attribute, value) {
      $parse(sanitizeAttribute(attribute)).assign(object, value);
    }
  };
});

/**
 * @ngdoc Services
 * @name NestedObjectHelper
 * @description
 * Helper utility to simplify working with nested objects.
 */
angular.module('formFor').service('NestedObjectHelper', function($parse) {

  return {

    // For Angular 1.2.21 and below, $parse does not handle array brackets gracefully.
    // Essentially we need to create Arrays that don't exist yet or objects within array indices that don't yet exist.
    // @see https://github.com/angular/angular.js/issues/2845
    $createEmptyArrays: function(object, attribute) {
      var startOfArray = 0;

      while (true) {
        startOfArray = attribute.indexOf('[', startOfArray);

        if (startOfArray < 0) {
          break;
        }

        var arrayAttribute = attribute.substr(0, startOfArray);
        var possibleArray = this.readAttribute(object, arrayAttribute);

        // Create the Array if it doesn't yet exist
        if (!possibleArray) {
          possibleArray = [];

          this.writeAttribute(object, arrayAttribute, possibleArray);
        }

        // Create an empty Object in the Array if the user is about to write to one (and one does not yet exist)
        var match = attribute.substr(startOfArray).match(/([0-9]+)\]\./);

        if (match) {
          var index = parseInt(match[1]);

          if (!possibleArray[index]) {
            possibleArray[index] = {};
          }
        }

        // Increment and keep scanning
        startOfArray++;
      }
    },

    flattenAttribute: function(attribute) {
      attribute = attribute.replace(/\[([^\]]+)\]\.{0,1}/g, '___$1___');
      attribute = attribute.replace(/\./g, '___');

      return attribute;
    },

    /**
     * Crawls an object and returns a flattened set of all attributes using dot notation.
     * This converts an Object like: {foo: {bar: true}, baz: true}
     * Into an Array like ['foo', 'foo.bar', 'baz']
     * @memberof NestedObjectHelper
     * @param {Object} object Object to be flattened
     * @returns {Array} Array of flattened keys (perhaps containing dot notation)
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
     * @memberof NestedObjectHelper
     * @param {Object} object Object ot be read
     * @param {String} attribute Attribute (or dot-notation path) to read
     * @returns {Object} Value defined at the specified key
     */
    readAttribute: function(object, attribute) {
      return $parse(attribute)(object);
    },

    /**
     * Writes the specified value to the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     * @memberof NestedObjectHelper
     * @param {Object} object Object ot be updated
     * @param {String} attribute Attribute (or dot-notation path) to update
     * @param {Object} value Value to be written
     */
    writeAttribute: function(object, attribute, value) {
      this.$createEmptyArrays(object, attribute);

      $parse(attribute).assign(object, value);
    }
  };
});

/**
 * Helper utility to simplify working with nested objects.
 */
angular.module('formFor').service('NestedObjectHelper', function($parse) {
  return {

    flattenFieldName: function(fieldName) {
      return fieldName.replace(/\./g, '___');
    },

    /**
     * Crawls an object and returns a flattened set of all attributes using dot notation.
     * This converts an Object like: {foo: {bar: true}, baz: true}
     * Into an Array like ['foo', 'foo.bar', 'baz']
     */
    flattenObjectKeys: function(object) {
      var internalCrawler = function(object, path, array) {
        array = array || [];

        var prefix = path ? path + '.' : '';

        _.forIn(object,
          function(value, relativeKey) {
            var fullKey = prefix + relativeKey;

            array.push(fullKey);

            internalCrawler(value, fullKey, array);
          });

        return array;
      };

      return internalCrawler(object);
    },

    /**
     * Returns the value defined by the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     *
     * @param object Object
     * @param attribute Attribute (or dot-notation path)
     */
    readAttribute: function(object, attribute) {
      return $parse(attribute)(object);
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
      $parse(attribute).assign(object, value);
    }
  };
});

/// <reference path="../../definitions/angular.d.ts" />

module formFor {

  /**
   * Helper utility to simplify working with nested objects.
   *
   * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
   */
  export class NestedObjectHelper {

    private $parse_:ng.IParseService;

    /**
     * Constructor.
     *
     * @param $parse Injector-supplied $parse service
     */
    constructor($parse:ng.IParseService) {
      this.$parse_ = $parse;
    }

    /**
     * Converts a field name (which may contain dots or array indices) into a string that can be used to key an object.
     * e.g. a field name like 'items[0].name' would be converted into 'items___0______name'
     *
     * @param fieldName Attribute (or dot-notation path) to read
     * @returns Modified field name safe to use as an object key
     */
    public flattenAttribute(fieldName:string):string {
      return fieldName.replace(/\[([^\]]+)\]\.{0,1}/g, '___$1___').replace(/\./g, '___');
    }

    /**
     * Crawls an object and returns a flattened set of all attributes using dot notation.
     * This converts an Object like: {foo: {bar: true}, baz: true} into an Array like ['foo', 'foo.bar', 'baz'].
     *
     * @param object Object to be flattened
     * @returns Array of flattened keys (perhaps containing dot notation)
     */
    public flattenObjectKeys(object:any):Array<string> {
      var keys:Array<string> = [];
      var queue:Array<any> = [{
        object: object,
        prefix: null
      }];

      while (true) {
        if (queue.length === 0) {
          break;
        }

        var data:any = queue.pop();
        var objectIsArray = Array.isArray(data.object);
        var prefix:string = data.prefix ? data.prefix + ( objectIsArray ? '[' : '.' ) : '';
        var suffix:string = objectIsArray ? ']' : '';

        if (typeof data.object === 'object') {
          for (var prop in data.object) {
            var path:string = prefix + prop + suffix;
            var value:any = data.object[prop];

            keys.push(path);

            queue.push({
              object: value,
              prefix: path
            });
          }
        }
      }

      return keys;
    }

    /**
     * Returns the value defined by the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     *
     * @param object Object ot be read
     * @param fieldName Attribute (or dot-notation path) to read
     * @returns Value defined at the specified key
     */
    public readAttribute(object:any, fieldName:string):any {
      return this.$parse_(fieldName)(object);
    }

    /**
     * Writes the specified value to the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     *
     * @param object Object ot be updated
     * @param fieldName Attribute (or dot-notation path) to update
     * @param value Value to be written
     */
    public writeAttribute(object:any, fieldName:string, value:any):void {
      this.initializeArraysAndObjectsForParse_(object, fieldName);
      this.$parse_(fieldName).assign(object, value);
    }

    // Helper methods ////////////////////////////////////////////////////////////////////////////////////////////////////

    // For Angular 1.2.21 and below, $parse does not handle array brackets gracefully.
    // Essentially we need to create Arrays that don't exist yet or objects within array indices that don't yet exist.
    // @see https://github.com/angular/angular.js/issues/2845
    private initializeArraysAndObjectsForParse_(object:any, attribute:string):void {
      var startOfArray:number = 0;

      while (true) {
        startOfArray = attribute.indexOf('[', startOfArray);

        if (startOfArray < 0) {
          break;
        }

        var arrayAttribute:string = attribute.substr(0, startOfArray);
        var possibleArray:any = this.readAttribute(object, arrayAttribute);

        // Create the Array if it doesn't yet exist
        if (!possibleArray) {
          possibleArray = [];

          this.writeAttribute(object, arrayAttribute, possibleArray);
        }

        // Create an empty Object in the Array if the user is about to write to one (and one does not yet exist)
        var match:Array<any> = attribute.substr(startOfArray).match(/([0-9]+)\]\./);

        if (match) {
          var targetIndex:number = parseInt(match[1]);

          if (!possibleArray[targetIndex]) {
            possibleArray[targetIndex] = {};
          }
        }

        // Increment and keep scanning
        startOfArray++;
      }
    }
  }
}
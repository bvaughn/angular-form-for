$scope.validationRules = {
  things: {
    // The :collections key designates this field as a collection
    collection: {

      // :min and :max validation rules apply to the size of the collection
      min: 2,
      max: 4,

      // :fields maps to individual items within the collection
      fields: {
        name: {
          required: true
        }
      }
    }
  }
};

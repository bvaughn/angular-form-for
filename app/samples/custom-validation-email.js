email: {
  required: true,
  pattern: /\w+@\w+\.\w+/,
  custom: function(value) {
    var deferred = $q.defer();

    // Use $http to do custom validation and then reject or resolve the promise.
    // If validation fails, you can pass a custom error message to the rejected promise.

    return deferred.promise;
  }
}

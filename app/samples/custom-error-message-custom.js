email: {
  custom: function(value) {
    // You could pass a custom error message to the rejected promise like..
    return $q.reject('This email address has already been taken');
  }
}

email: {
  custom: function(value) {
    // You could pass a custom error message to the rejected promise like..
    return $q.defer('This email address has already been taken');
  }
}

password2: {
  custom: function(value, model) {
    return model.password1 === model.password2;
  }
}

email: {
  required: true,
  pattern: {
    rule: /\w+@\w+\.\w+/,
    message: 'Invalid email format'
  }
}

/**
 * @ngdoc Services
 * @name FormForConfiguration
 * @description
 * This service can be used to configure default behavior for all instances of formFor within a project.
 * Note that it is a service accessible to during the run loop and not a provider accessible during config.
 */
angular.module('formFor').service('FormForConfiguration',
  function() {
    return {

      autoGenerateLabels: false,
      defaultDebounceDuration: 500,
      defaultSubmitComplete: angular.noop,
      defaultSubmitError: angular.noop,
      defaultValidationFailed: angular.noop,
      requiredLabel: null,
      validationFailedForCustomMessage: 'Failed custom validation',
      validationFailedForPatternMessage: 'Invalid format',
      validationFailedForMaxCollectionSizeMessage: 'Must be fewer than {{num}} items',
      validationFailedForMaxLengthMessage: 'Must be fewer than {{num}} characters',
      validationFailedForMinCollectionSizeMessage: 'Must at least {{num}} items',
      validationFailedForMinLengthMessage: 'Must be at least {{num}} characters',
      validationFailedForRequiredMessage: 'Required field',
      validationFailedForEmailTypeMessage: 'Invalid email format',
      validationFailedForIntegerTypeMessage: 'Must be an integer',
      validationFailedForNegativeTypeMessage: 'Must be negative',
      validationFailedForNonNegativeTypeMessage: 'Must be non-negative',
      validationFailedForNumericTypeMessage: 'Must be numeric',
      validationFailedForPositiveTypeMessage: 'Must be positive',

      /**
       * Use this method to disable auto-generated labels for formFor input fields.
       * @memberof FormForConfiguration
       */
      disableAutoLabels: function() {
        this.autoGenerateLabels = false;
      },

      /**
       * Use this method to enable auto-generated labels for formFor input fields.
       * Labels will be generated based on attribute-name for fields without a label attribute present.
       * Radio fields are an exception to this rule.
       * Their names are generated from their values.
       * @memberof FormForConfiguration
       */
      enableAutoLabels: function() {
        this.autoGenerateLabels = true;
      },

      /**
       * Sets the default debounce interval for all textField inputs.
       * This setting can be overridden on a per-input basis (see textField).
       * @memberof FormForConfiguration
       * @param {int} duration Debounce duration (in ms).
       * Defaults to 500ms.
       * To disable debounce (update only on blur) pass false.
       */
      setDefaultDebounceDuration: function(value) {
        this.defaultDebounceDuration = value;
      },

      /**
       * Sets the default submit-complete behavior for all formFor directives.
       * This setting can be overridden on a per-form basis (see formFor).
       * @memberof FormForConfiguration
       * @param {Function} method Default handler function accepting a data parameter representing the server-response returned by the submitted form.
       * This function should accept a single parameter, the response data from the form-submit method.
       */
      setDefaultSubmitComplete: function(value) {
        this.defaultSubmitComplete = value;
      },

      /**
       * Sets the default submit-error behavior for all formFor directives.
       * This setting can be overridden on a per-form basis (see formFor).
       * @memberof FormForConfiguration
       * @param {Function} method Default handler function accepting an error parameter representing the data passed to the rejected submit promise.
       * This function should accept a single parameter, the error returned by the form-submit method.
       */
      setDefaultSubmitError: function(value) {
        this.defaultSubmitError = value;
      },

      /**
       * Sets the default validation-failed behavior for all formFor directives.
       * This setting can be overridden on a per-form basis (see formFor).
       * @memberof FormForConfiguration
       * @param {Function} method Default function invoked when local form validation fails.
       */
      setDefaultValidationFailed: function(value) {
        this.defaultValidationFailed = value;
      },

      /**
       * Sets a default label to be displayed beside each text and select input for required attributes only.
       * @memberof FormForConfiguration
       * @param {String} value Message to be displayed next to the field label (ex. "*", "required")
       */
      setRequiredLabel: function(value) {
        this.requiredLabel = value;
      },

      /**
       * Override the default error message for failed custom validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForCustomMessage: function(value) {
        this.validationFailedForCustomMessage = value;
      },

      /**
       * Override the default error message for failed max collection size validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForMaxCollectionSizeMessage: function(value) {
        this.validationFailedForMaxCollectionSizeMessage = value;
      },

      /**
       * Override the default error message for failed maxlength validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForMaxLengthMessage: function(value) {
        this.validationFailedForMaxLengthMessage = value;
      },

      /**
       * Override the default error message for failed min collection size validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForMinCollectionSizeMessage: function(value) {
        this.validationFailedForMaxCollectionSizeMessage = value;
      },

      /**
       * Override the default error message for failed minlength validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForMinLengthMessage: function(value) {
        this.validationFailedForMinLengthMessage = value;
      },

      /**
       * Override the default error message for failed pattern validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForPatternMessage: function(value) {
        this.validationFailedForPatternMessage = value;
      },

      /**
       * Override the default error message for failed required validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForRequiredMessage: function(value) {
        this.validationFailedForRequiredMessage = value;
      },

      /**
       * Override the default error message for failed type = 'email' validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForEmailTypeMessage: function(value) {
        this.validationFailedForEmailTypeMessage = value;
      },

      /**
       * Override the default error message for failed type = 'integer' validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForIntegerTypeMessage: function(value) {
        this.validationFailedForIntegerTypeMessage = value;
      },

      /**
       * Override the default error message for failed type = 'negative' validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForNegativeTypeMessage: function(value) {
        this.validationFailedForNegativeTypeMessage = value;
      },

      /**
       * Override the default error message for failed type = 'nonNegative' validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForNonNegativeTypeMessage: function(value) {
        this.validationFailedForNonNegativeTypeMessage = value;
      },

      /**
       * Override the default error message for failed type = 'numeric' validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForNumericTypeMessage: function(value) {
        this.validationFailedForNumericTypeMessage = value;
      },

      /**
       * Override the default error message for failed type = 'positive' validations.
       * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
       * @memberof FormForConfiguration
       * @param {String} value Custom error message string
       */
      setValidationFailedForPositiveTypeMessage: function(value) {
        this.validationFailedForPositiveTypeMessage = value;
      }
    };
  });

angular.module('formForDocumentation').controller('FormMetadataDemoController',
  function(FormForConfiguration, flashr) {
    FormForConfiguration.enableAutoLabels();

    this.formData = {
      validateOn: 'manual'
    };
    this.formController = {};

    this.options = [
      {label: 'Option One', value: 1},
      {label: 'Option Two', value: 2},
      {label: 'Option Three', value: 3}
    ];

    this.disableButton = false;
    this.disableCheckbox = false;
    this.disablePassword = false;
    this.disablePlainText = false;
    this.disableRadio = false;
    this.disableSelect = false;

    this.validationRules = {
      plainText: {
        required: true,
        minlength: 3
      },
      password: {
        required: true
      },
      checkSomething: {
        required: true
      },
      gender: {
        required: true
      },
      selectSomething: {
        required: true
      }
    };

    this.validateOptions = [
      {value: '', label: 'default (no setting)'},
      {value: 'change', label: 'on-change'},
      {value: 'manual', label: 'manual'},
      {value: 'submit', label: 'on-submit'}
    ];

    this.setFieldError = function() {
      var error = window.prompt('Enter a custom validation error message:', '');

      this.formController.setFieldError('plainText', error);
    };

    this.onFocus = function() {
      this.focused = true;
    };

    this.onBlur = function() {
      this.focused = false;
    };

    this.manuallyTriggerValidations = function(showErrors) {
      this.formController.validateForm(showErrors).then(
        function() {
          flashr.now.success('Your form is valid');
        },
        function() {
          flashr.now.error('Your form is invalid');
        });
    };

    this.toggleAutoTrim = function() {
      this.autoTrimIsEnabled = !this.autoTrimIsEnabled;

      if (this.autoTrimIsEnabled) {
        FormForConfiguration.enableAutoTrimValues(); 
      } else {
        FormForConfiguration.disableAutoTrimValues(); 
      }
    };

    this.submit = function(data) {
      flashr.now.info('Your form has been submitted');
    };
  });


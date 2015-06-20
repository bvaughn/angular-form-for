angular.module('formForDocumentation').controller('DynamicIconsDemoController',
  function(FormForConfiguration, flashr) {
    FormForConfiguration.enableAutoLabels();

    this.bindableAfterIcon = 'fa fa-arrow-circle-o-left';
    this.bindableBeforeIcon = 'fa fa-arrow-circle-o-right';

    this.formController = {};
    this.formData = {};

    this.validationRules = {
      email: {
        required: true,
        pattern: /\w+@\w+\.\w+/
      },
      password: {
        required: true,
        pattern: {
          rule: /[0-9]/,
          message: 'Your password must contain at least 1 number'
        }
      }
    };

    this.submit = function(data) {
      flashr.now.info('Your form has been submitted');
    };
  });

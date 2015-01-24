angular.module('formForDocumentation').controller('FormMetadataDemoController',
  function($scope, FormForConfiguration, flashr) {
    FormForConfiguration.enableAutoLabels();

    $scope.formData = {
      validateOn: 'manual'
    };
    $scope.formController = {};

    $scope.options = [
      {label: 'Option One', value: 1},
      {label: 'Option Two', value: 2},
      {label: 'Option Three', value: 3}
    ];

    $scope.disableButton = false;
    $scope.disableCheckbox = false;
    $scope.disablePassword = false;
    $scope.disablePlainText = false;
    $scope.disableRadio = false;
    $scope.disableSelect = false;

    $scope.validationRules = {
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

    $scope.setFieldError = function() {
      var error = window.prompt('Enter a custom validation error message:', '');

      $scope.formController.setFieldError('plainText', error);
    };

    $scope.onFocus = function() {
      $scope.focused = true;
    };

    $scope.onBlur = function() {
      $scope.focused = false;
    };

    $scope.manuallyTriggerValidations = function(showErrors) {
      $scope.formController.validateForm(showErrors).then(
        function() {
          flashr.now.success('Your form is valid');
        },
        function() {
          flashr.now.error('Your form is invalid');
        });
    };

    $scope.submit = function(data) {
      flashr.now.info('Your form has been submitted');
    };
  });


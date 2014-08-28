angular.module('formForDocumentation').controller('FormMetadataDemoController',
  function($scope, FormForConfiguration, flashr) {
    FormForConfiguration.enableAutoLabels();

    $scope.formData = {};
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
        required: true
      },
      password: {
        required: true
      }
    };

    $scope.manuallyTriggerValidations = function() {
      $scope.formController.validateForm().then(
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


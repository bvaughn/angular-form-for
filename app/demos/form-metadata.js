angular.module('formForDocumentation').controller('FormMetadataDemoController',
  function($scope, FormForConfiguration, flashr) {
    FormForConfiguration.enableAutoLabels();

    $scope.formData = {};
    $scope.formController = {};

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

    $scope.submit = function(data) {
      flashr.now.info('This is just a demo form! ;)');
    };
  });


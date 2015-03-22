angular.module('yourModule').controller('YourController',
  function($scope) {
    // Create a placeholder for formFor to fill in with controller methods:
    $scope.formController = {};

    // You can then [asynchronously] use these methods like so:
    $scope.formController.resetErrors();
  });

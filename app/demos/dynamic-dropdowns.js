angular.module('formForDocumentation').controller('DynamicDropdownsDemoController',
  function($scope, $timeout) {
    $scope.formData = {
      preselectedLocalOption: 'en'
    };

    $scope.localOptions = [
      {value: 'ar', label: 'Arabic'},
      {value: 'zh', label: 'Chinese'},
      {value: 'nl', label: 'Dutch'},
      {value: 'en', label: 'English'},
      {value: 'fi', label: 'Finnish'},
      {value: 'fr', label: 'French'},
      {value: 'de', label: 'German'},
      {value: 'el', label: 'Greek'},
      {value: 'iw', label: 'Hebrew'},
      {value: 'ga', label: 'Irish'},
      {value: 'it', label: 'Italian'},
      {value: 'ja', label: 'Japanese'},
      {value: 'ko', label: 'Korean'},
      {value: 'mt', label: 'Maltese'},
      {value: 'pl', label: 'Polish'},
      {value: 'ru', label: 'Russian'},
      {value: 'sk', label: 'Slovak'},
      {value: 'es', label: 'Spanish'},
      {value: 'sv', label: 'Swedish'},
      {value: 'th', label: 'Thai'},
      {value: 'uk', label: 'Ukrainian'},
      {value: 'vi', label: 'Vietnamese'}
    ];

    $scope.$watch('filterText', function(value) {
      $scope.remoteOptions = null;

      // Simulate delay to load a remote list
      $timeout(function() {
        var filter = $scope.filterText || '';
        var max = Math.round(Math.random() * 20) + 1;

        $scope.remoteOptions = [];

        for (var i = 1; i <= max; i++) {
          $scope.remoteOptions.push({value: i, label: 'Fake result #' + i + ' for "' + filter + '"'});
        }
      }, 1000);
    });
  });

angular.module('formForDocumentation').controller('TypeAheadDemoController',
  function($scope, $timeout) {
    this.formData = {
      preselectedLocale: 'es',
      remotelyFilteredLocale: undefined,
      unspecifiedLocale: undefined
    };

    this.localeOptions = [
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

    $scope.$watch('ctrl.bindableFilterText', function(filterText) {
      this.remoteLocaleOptions = null;

      var latency = 1000 + 2000 * Math.random();

      // This demo doesn't actually load data remotely.
      // It simulates the latency of a remotely-loaded list though.
      // It also simulates simple filtering.
      $timeout(function() {
        this.remoteLocaleOptions = this.localeOptions.filter(
          function(localeOption) {
            return localeOption.label.indexOf(filterText) >= 0;
          });
        console.log('Filtered options ['+filterText+']',this.remoteLocaleOptions);
      }.bind(this), latency);
    }.bind(this));
  });

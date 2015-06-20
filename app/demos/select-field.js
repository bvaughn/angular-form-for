angular.module('formForDocumentation').controller('SelectFieldDemoController',
  function() {
    this.formData = {
      preselectedLocale: 'es',
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
  });

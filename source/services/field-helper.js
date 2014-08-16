angular.module('formFor').service('FieldHelper',
  function(FormForConfiguration, StringUtil) {
    this.getLabel = function($attributes, valueToHumanize) {
      if ($attributes.hasOwnProperty('label')) {
        return $attributes.label;
      }

      if (FormForConfiguration.autoGenerateLabels) {
        return StringUtil.humanize(valueToHumanize);
      }
    }
  });

/**
 * @ngdoc Services
 * @name FieldHelper
 * @description
 * Various helper methods for functionality shared between formFor field directives.
 */
angular.module('formFor').service('FieldHelper',
  function(FormForConfiguration, StringUtil) {

    /**
     * Determines the field's label based on its current attributes and the FormForConfiguration configuration settings.
     * @memberof FieldHelper
     * @param {Hash} $attributes Directive link $attributes
     * @param {Object} valueToHumanize Default value (if no override specified on $attributes)
     * @returns {String} Label to display (or null if no label)
     */
    this.getLabel = function($attributes, valueToHumanize) {
      if ($attributes.hasOwnProperty('label')) {
        return $attributes.label;
      }

      if (FormForConfiguration.autoGenerateLabels) {
        return StringUtil.humanize(valueToHumanize);
      }
    }
  });

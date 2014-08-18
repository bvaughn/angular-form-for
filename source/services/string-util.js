/**
 * @ngdoc Services
 * @name StringUtil
 * @description
 * Utility for working with strings.
 */
angular.module('formFor').service('StringUtil', function() {

  /**
   * Converts text in common variable formats to humanized form.
   * @memberof StringUtil
   * @param {String} text Name of variable to be humanized (ex. myVariable, my_variable)
   * @returns {String} Humanized string (ex. 'My Variable')
   */
  this.humanize = function(text) {
    if (!text) {
      return '';
    }

    text = text.replace(/[A-Z]/g, function(match) {
      return ' ' + match;
    });

    text = text.replace(/_([a-z])/g, function(match, $1) {
      return ' ' + $1.toUpperCase();
    });

    text = text.replace(/\s+/g, ' ');
    text = text.trim();
    text = text.charAt(0).toUpperCase() + text.slice(1);

    return text;
  };
});

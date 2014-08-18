angular.module('formForDocumentation').directive('prism',
  function($compile, $http) {
    return {
      restrict: 'EA',
      link: function($scope, $element, $attributes) {
        var parser = $attributes.hasOwnProperty('parser') ? $attributes['parser'] : 'markup';

        var highlight = function(text) {
          var html = Prism.highlight(text, Prism.languages[parser]);

          $element.html('<pre class="language-' + parser + '"><code>' + html + '</code></pre>');
        };

        var showError = function() {
          $element.html('<p class="alert alert-danger"><i class="fa fa-times"></i> The specified template could not be loaded.</p>');
        };

        if ($attributes.source) {
          $element.html('<i class="fa fa-spin fa-spinner"></i> Loading...');

          $http({method: 'GET', url: $attributes.source}).
            success(
              function(data) {
                if (data) {
                  highlight(data);
                } else {
                  showError();
                }
              }).
            error(showError);
        } else {
          highlight($element.html());
        }
      }
    };
});

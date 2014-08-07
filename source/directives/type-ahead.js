/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#textfield
 */
angular.module('formFor').directive('typeAheadField',
  function($log, $filter, $timeout, FormForConfiguration) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/type-ahead-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        filter: '=?',
        help: '@?',
        label: '@?',
        options: '=',
        placeholder: '@?'
      },
      link: function($scope, $element, $attributes, formForController) {
        if (!$scope.attribute) {
          $log.error('Missing required field "attribute"');

          return;
        }

        if ($attributes.hasOwnProperty('autofocus')) {
          $timeout(function() {
            $element.find('input').focus();
          });
        }

        $scope.debounce = $attributes.debounce || FormForConfiguration.defaultDebounceDuration;
        $scope.labelAttribute = $attributes.labelAttribute || 'label';
        $scope.valueAttribute = $attributes.valueAttribute || 'value';

        // Typeahead doesn't handle null values very well so we need to guard against that.
        // See https://github.com/angular-ui/bootstrap/pull/2361
        $scope.filteredOptions = $scope.options || [];

        // Watch filter text changes and notify external listener in case data is loaded remotely.
        $scope.changeHandler = function() {
          $scope.filter = $element.find('input').val();
        };

        var updateFilteredOptions = function() {
          var array = $scope.options || [];

          var expression = {};
          expression[$scope.labelAttribute] = $scope.filter;

          $scope.filteredOptions = $filter('filter')(array, expression);
        };

        $scope.$watch('filter', updateFilteredOptions);
        $scope.$watch('options', updateFilteredOptions);

        // Type-ahead directive doesn't support "option[valueAttribute] as option[labelAttribute]" syntax,
        // So we have to massage the data into the correct format for our parent formFor.
        $scope.$watch('model.selectedOption', function(option) {
          $scope.model.bindable = option && option[$scope.valueAttribute];
        });

        $scope.model = formForController.registerFormField($scope, $scope.attribute);
      }
    };
  });

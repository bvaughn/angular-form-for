/**
 * For documentation please refer to the project wiki:
 * https://github.com/bvaughn/angular-form-for/wiki/API-Reference#selectfield
 */
angular.module('formFor').directive('selectField',
  function($document, $log, $timeout) {
    return {
      require: '^formFor',
      restrict: 'EA',
      templateUrl: 'form-for/templates/select-field.html',
      scope: {
        attribute: '@',
        disable: '@',
        filter: '=?',
        filterDebounce: '@?',
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

        $scope.allowBlank = $attributes.hasOwnProperty('allowBlank');
        $scope.enableFiltering = $attributes.hasOwnProperty('enableFiltering');

        $scope.labelAttribute = $attributes.labelAttribute || 'label';
        $scope.valueAttribute = $attributes.valueAttribute || 'value';

        $scope.model = formForController.registerFormField($scope, $scope.attribute);

        // TODO Track scroll position and viewport height and expand upward if needed

        /*****************************************************************************************
         * The following code pertains to filtering visible options.
         *****************************************************************************************/

        var sanitize = function(value) {
          return value && value.toLowerCase();
        };

        if ($scope.enableFiltering) {
          $scope.$watch('filter', function(value) {
            if (!value) {
              $scope.filteredOptions = $scope.options;
            } else {
              var filter = sanitize($scope.filter);

              $scope.filteredOptions = _.filter($scope.options,
                function(option) {
                  return sanitize(option[$scope.labelAttribute]).indexOf(filter) >= 0;
                });
            }
          });
        };

        /*****************************************************************************************
         * The following code deals with toggling/collapsing the drop-down and selecting values.
         *****************************************************************************************/

        $scope.$watch('model.bindable', function(value) {
          var option = _.find($scope.options,
            function(option) {
              return value === option[$scope.valueAttribute];
            });

          $scope.selectedOption = option;
          $scope.selectedOptionLabel = option && option[$scope.labelAttribute];
        });

        var oneClick = function(target, handler) {
          $timeout(function() { // Delay to avoid processing the same click event that trigger the toggle-open
            target.one('click', handler);
          }, 1);
        };

        var removeClickWatch = function() {
          $document.off('click', clickWatcher);
          $element.off('click', clickWatcher);
        };

        var addClickToOpen = function() {
          oneClick($element.find('.select-field-toggle-button'), clickToOpen);
        };

        $scope.selectOption = function(option) {
          $scope.model.bindable = option && option[$scope.valueAttribute];
          $scope.isOpen = false;

          removeClickWatch();

          addClickToOpen();
        };

        var clickWatcher = function(event) {
          $scope.isOpen = false;
          $scope.$apply();

          removeClickWatch();

          addClickToOpen();
        };

        var scroller = $element.find('.list-group-container');
        var list = $element.find('.list-group');

        var clickToOpen = function() {
          if (!$scope.options || $scope.disable || $scope.disabledByForm) {
            addClickToOpen();

            return;
          }

          $scope.isOpen = !$scope.isOpen;

          if ($scope.isOpen) {
            oneClick($document, clickWatcher);
            oneClick($element, clickWatcher);

            var value = $scope.model.bindable;

            $timeout(function() {
              var listItem =
                _.find(list.find('.list-group-item'),
                  function(listItem) {
                    var option = $(listItem).scope().option;

                    return option && option[$scope.valueAttribute] === value;
                  });

              if (listItem) {
                scroller.scrollTop(
                  $(listItem).offset().top - $(listItem).parent().offset().top);
              }
            }.bind(this), 1);
          }
        };

        addClickToOpen();

        $scope.$on('$destroy', function() {
          removeClickWatch();
        });
      }
    };
  });

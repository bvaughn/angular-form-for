angular.module('formForDocumentation').controller('CollectionsDemoController',
  function($scope, flashr) {
    $scope.formData = {
      hobbies: [
        {
          name: 'Creating forms',
          frequency: 'daily',
          paid: false,
          recommend: true
        }
      ]
    };

    $scope.hobbyFrequencyOptions = [
      {label: 'Daily', value: 'daily'},
      {label: 'Weekly', value: 'weekly'},
      {label: 'Monthly', value: 'monthly'}
    ];

    $scope.validationRules = {
      name: {
        required: true
      },
      hobbies: {
        collection: {
          min: {
            rule: 2,
            message: 'Come on, speak up. Tell us at least two things you enjoy doing'
          },
          max: {
            rule: 4,
            message: 'Do not be greedy. Four hobbies are probably enough!'
          },
          fields: {
            name: {
              required: true
            },
            frequency: {
              required: true
            }
          }
        }
      }
    };

    $scope.addHobby = function() {
      $scope.formData.hobbies.push({});
    };
    $scope.removeHobby = function(hobby) {
      $scope.formData.hobbies.splice(
        $scope.formData.hobbies.indexOf(hobby), 1);
    };

    $scope.submit = function(data) {
      flashr.now.info('Your form has been submitted');
    };
  });

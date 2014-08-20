angular.module('formForDocumentation').controller('CollectionsDemoController',
  function($scope, flashr) {
    $scope.formData = {
      hobbies: [
        {
          name: 'Creating forms',
          description: 'This sure is a silly example hobby.'
        }
      ]
    };

    $scope.hobbyFrequencyOptions = [
      {label: 'Once', value: 1},
      {label: 'Twice', value: 2},
      {label: 'A million', value: 1000000}
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
      console.log(data);
      flashr.now.info("This is just a demo. You aren't supposed to actually save anything! ;)");
    };
  });

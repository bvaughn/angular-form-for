angular.module('formForDocumentation').controller('CollectionsDemoController',
  function(flashr) {
    this.formData = {
      hobbies: [
        {
          name: 'Creating forms',
          frequency: 'daily',
          paid: false,
          recommend: true
        }
      ]
    };

    this.hobbyFrequencyOptions = [
      {label: 'Daily', value: 'daily'},
      {label: 'Weekly', value: 'weekly'},
      {label: 'Monthly', value: 'monthly'}
    ];

    this.validationRules = {
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

    this.hobbyOptions = [
      {value: true, label: 'Yes'},
      {value: false, label: 'I wish'}
    ];

    this.addHobby = function() {
      this.formData.hobbies.push({});
    };
    this.removeHobby = function(hobby) {
      this.formData.hobbies.splice(
        this.formData.hobbies.indexOf(hobby), 1);
    };

    this.submit = function(data) {
      flashr.now.info('Your form has been submitted');
    };
  });

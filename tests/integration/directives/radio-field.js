'use strict';

var testHelper = require('../test-helper');

// Interface between tests (below) and the appropriate formFor Radio directive template
var Facade = function(identifier) {
  testHelper.goToPage('http://localhost:8000/examples/radio-field.html?template=' + identifier);

  var fieldName;

  this.setFieldName = function(value) {
    fieldName = value;
  };

  this.getRadio = function() {
    return element(by.css('[attribute=' + fieldName + ']'));
  };

  switch (identifier) {
    case 'bootstrap':
      this.getInputs = function() {
        return element.all(by.css('[attribute=' + fieldName + '] [ng-repeat] input'));
      };
      this.getLabels = function() {
        return element.all(by.css('[attribute=' + fieldName + '] [ng-repeat] label'));
      };
      this.getErrorText = function() {
        return element(by.css('[attribute=' + fieldName + '] field-error p'));
      };
      this.getGroupLabel = function() {
        return element(by.css('[attribute=' + fieldName + '] label [ng-bind-html]'));
      };
      this.getHoverable = function() {
        return element(by.css('[attribute=' + fieldName + '] label [popover]'));
      };
      this.getTooltip = function() {
        return element(by.css('[attribute=' + fieldName + '] label [popover-popup]'));
      };
      break;
    case 'default':
      this.getInputs = function() {
        return element.all(by.css('[attribute=' + fieldName + '] [ng-repeat] input'));
      };
      this.getLabels = function() {
        return element.all(by.css('[attribute=' + fieldName + '] [ng-repeat]'));
      };
      this.getErrorText = function() {
        return element(by.css('[attribute=' + fieldName + '] field-error p'));
      };
      this.getGroupLabel = function() {
        return element(by.css('[attribute=' + fieldName + '] label [ng-bind-html]'));
      };
      this.getHoverable = function() {
        return element(by.css('[attribute=' + fieldName + '] label .form-for-tooltip'));
      };
      this.getTooltip = function() {
        return element(by.css('[attribute=' + fieldName + '] label .form-for-tooltip-popover'));
      };
      break;
    case 'material':
      browser.ignoreSynchronization = true;

      this.getInputs = function() {
        return element.all(by.css('[attribute=' + fieldName + '] md-radio-group md-radio-button'));
      };
      this.getLabels = function() {
        return element.all(by.css('[attribute=' + fieldName + '] md-radio-group md-radio-button'));
      };
      this.getErrorText = function() {
        return element(by.css('[attribute=' + fieldName + '] field-error div'));
      };
      this.getGroupLabel = function() {
        return element(by.css('[attribute=' + fieldName + '] md-radio-group label'));
      };
      this.getHoverable = function() {
        return element(by.css('[attribute=' + fieldName + '] md-radio-group label'));
      };
      this.getTooltip = function() {
        return element(by.css('md-tooltip'));
      };
      break;
  }
};

// Test each of our templates
[
  'bootstrap',
  'default',
  'material'
].forEach(function(template) {
  describe(template, function() {
    var radio, groupLabel, femaleInput, femaleLabel, maleInput, maleLabel, facade, hoverable, tooltip;

    beforeEach(function() {
      facade = new Facade(template);

      browser.driver.manage().window().setSize(1600, 1000);
    });

    describe('preselected', function() {
      beforeEach(function() {
        facade.setFieldName('preselected');

        radio = facade.getRadio();
        groupLabel = facade.getGroupLabel();
        femaleLabel = facade.getLabels().get(0);
        maleLabel = facade.getLabels().get(1);
      });

      it('should show the correct label', function () {
        expect(groupLabel.getText()).toBe('Preselected radio');
      });

      it('should not show an error', function() {
        testHelper.assertIsNotDisplayed(facade.getErrorText());
      });

      it('should show the correct labels', function() {
        expect(femaleLabel.getText()).toBe('Female');
        expect(maleLabel.getText()).toBe('Male');
      });

      it('should preselect the correct initial value', function() {
        expect(femaleLabel.evaluate('model.bindable')).toBe('f');
        expect(maleLabel.evaluate('model.bindable')).toBe('f');
      });

      it('should update the model on click', function() {
        maleLabel.click();

        expect(radio.evaluate('formData.preselected')).toBe('m');

        femaleLabel.click();

        expect(radio.evaluate('formData.preselected')).toBe('f');
      });
    });

    describe('help', function() {
      beforeEach(function() {
        facade.setFieldName('help');

        hoverable = facade.getHoverable();
        tooltip = facade.getTooltip();
      });

      it('should not show help text by default', function() {
        if (template === 'material') return; // Material template doesn't expose a help tooltip

        testHelper.assertIsNotDisplayed(facade.getTooltip());
      });

      it('should show help text on hover', function() {
        if (template === 'material') return; // Material template doesn't expose a help tooltip

        testHelper.doMouseOver(facade.getHoverable());
        testHelper.assertIsDisplayed(facade.getTooltip());
      });
    });

    describe('disabled', function() {
      beforeEach(function() {
        facade.setFieldName('disabled');

        radio = facade.getRadio();
        groupLabel = facade.getGroupLabel();
        femaleInput = facade.getInputs().get(0);
        femaleLabel = facade.getLabels().get(0);
        maleInput = facade.getInputs().get(1);
        maleLabel = facade.getLabels().get(1);
      });

      it('should show the correct label', function () {
        expect(groupLabel.getText()).toBe('Disabled radio');
      });

      it('should be disabled based on html attributes', function () {
        expect(femaleInput.getAttribute('disabled')).toBe('true');
        expect(maleInput.getAttribute('disabled')).toBe('true');
      });

      it('should not update the model on click', function () {
        expect(radio.evaluate('model.bindable')).toBeFalsy();

        femaleInput.click().then(
          function() {},
          function() {}
        );
        maleInput.click().then(
          function() {},
          function() {}
        );

        expect(radio.evaluate('model.bindable')).toBeFalsy();
      });
    });

    describe('invalid', function() {
      it('should show an error', function () {
        facade.setFieldName('invalid');

        testHelper.assertIsDisplayed(facade.getErrorText(), 500);
      });
    });
  });
});
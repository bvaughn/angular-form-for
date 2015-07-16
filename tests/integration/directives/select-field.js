'use strict';

var testHelper = require('../test-helper');

// Interface between tests (below) and the appropriate formFor Select directive template
var Facade = function(identifier) {
  testHelper.goToPage('http://localhost:8000/examples/select-field.html?template=' + identifier);

  browser.driver.sleep(500); // Give bindings time to fire

  var fieldName;

  this.setFieldName = function(value) {
    fieldName = value;
  };

  this.assertFormDataValue = function(expectedValue) {
    testHelper.assertFormDataValue(fieldName, expectedValue);
  }

  this.assertOptionsCount = function(expectedCount) {
    this.getOptions().then(function(options) {
      expect(options.length).toBe(expectedCount);
    });
  };

  this.selectOption = function(text) {
    this.getSelect().click();
    this.getOptionByText(text).click();
  };

  switch (identifier) {
    case 'bootstrap':
      this.getSelect = function() {
        return element(by.css('[attribute=' + fieldName + '] select'));
      };
      this.getOptionByText = function(text) {
        return element(by.cssContainingText('[attribute=' + fieldName + '] select option', text));
      };
      this.getSelectedOption = function() {
        return element(by.css('[attribute=' + fieldName + '] select option:checked'));
      };
      this.getSelectedOptions = function() {
        return element.all(by.css('[attribute=' + fieldName + '] select option:checked'));
      };
      this.getOptions = function() {
        return element.all(by.css('[attribute=' + fieldName + '] select option'));
      };
      this.getLabel = function() {
        return element(by.css('[attribute=' + fieldName + '] label span[ng-bind-html]'));
      };
      this.getErrorText = function() {
        return element(by.css('[attribute=' + fieldName + '] field-error p'));
      };
      this.getHoverable = function() {
        return element(by.css('[attribute=' + fieldName + '] label [popover]'));
      };
      this.getTooltip = function() {
        return element(by.css('[attribute=' + fieldName + '] label [popover-popup]'));
      };
      break;
    case 'default':
      this.getSelect = function() {
        return element(by.css('[attribute=' + fieldName + '] select'));
      };
      this.getOptionByText = function(text) {
        return element(by.cssContainingText('[attribute=' + fieldName + '] select option', text));
      };
      this.getSelectedOption = function() {
        return element(by.css('[attribute=' + fieldName + '] select option:checked'));
      };
      this.getSelectedOptions = function() {
        return element.all(by.css('[attribute=' + fieldName + '] select option:checked'));
      };
      this.getOptions = function() {
        return element.all(by.css('[attribute=' + fieldName + '] select option'));
      };
      this.getLabel = function() {
        return element(by.css('[attribute=' + fieldName + '] label span[ng-bind-html]'));
      };
      this.getErrorText = function() {
        return element(by.css('[attribute=' + fieldName + '] field-error p'));
      };
      this.getHoverable = function() {
        return element(by.css('[attribute=' + fieldName + '] label .form-for-tooltip-icon'));
      };
      this.getTooltip = function() {
        return element(by.css('[attribute=' + fieldName + '] label .form-for-tooltip-popover'));
      };
      break;
    case 'material':
      browser.ignoreSynchronization = true;

      this.getSelect = function() {
        return element.all(by.css('[attribute=' + fieldName + '] md-select'));
      };
      this.getOptionByText = function(text) {
        this.getSelect().click();  // Open the select
        browser.driver.sleep(500); // Wait for the renderings to take effect
        return element(by.cssContainingText('md-select-menu md-option', text));
      };
      this.getSelectedOption = function() {
        this.getSelect().click();  // Open the select
        browser.driver.sleep(500); // Wait for the renderings to take effect

        return element(by.css('md-select-menu md-option[selected]'));
      };
      this.getSelectedOptions = function() {
        this.getSelect().click();  // Open the select
        browser.driver.sleep(500); // Wait for the renderings to take effect

        return element.all(by.css('md-select-menu md-option[selected]'));
      };
      this.getOptions = function() {
        return element.all(by.css('md-select-menu md-option'));
      };
      this.getLabel = function() {
        return element(by.css('[attribute=' + fieldName + '] label'));
      };
      this.getErrorText = function() {
        return element(by.css('[attribute=' + fieldName + '] field-error'));
      };
      this.getHoverable = function() {
        return element(by.css('[attribute=' + fieldName + '] md-radio-group label'));
      };
      this.getTooltip = function() {
        return null; // No help tooltip for Material skin
      };
      break;
  }
};

// Test each of our templates
[
  'bootstrap',
  'default',
  //'material'
].forEach(function(template) {
  describe(template, function() {
    var select, hoverable, label, femaleOption, maleOption, unspecifiedOption, selectedOption, facade, tooltip;

    var setNameAndGetVariables = function(fieldName) {
      facade.setFieldName(fieldName);

      select = facade.getSelect();
      label = facade.getLabel();

      if (template === 'material') select.click();

      maleOption = facade.getOptionByText('Male');
      femaleOption = facade.getOptionByText('Female');
      unspecifiedOption = facade.getOptionByText('Unspecified');
      selectedOption = facade.getSelectedOption();
    };

    beforeEach(function() {
      facade = new Facade(template);

      browser.driver.manage().window().setSize(1600, 1000);
    });

    describe('preselected', function() {
      beforeEach(setNameAndGetVariables.bind(this, 'preselected'));

      it('should show the correct label', function () {
        expect(label.getText()).toBe('Preselected select field with help');
      });

      it('should not show an error', function() {
        facade.getErrorText().isDisplayed().then(
          function() {
            throw Error('Element should not be displayed');
          },
          function() {}
        );
      });

      it('should show the correct option labels', function() {
        expect(maleOption.getText()).toBe('Male');
        expect(femaleOption.getText()).toBe('Female');
        expect(unspecifiedOption.getText()).toBe('Unspecified');
      });

      it('should preselect the correct initial value', function() {
        expect(selectedOption.getText()).toBe('Male');
      });

      it('should update the model on click', function() {
        facade.selectOption('Female');
        facade.assertFormDataValue('f');
        facade.selectOption('Male');
        facade.assertFormDataValue('m');
      });

      describe('help text', function() {
        beforeEach(function() {
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
    });

    describe('disabled', function() {
      beforeEach(function() {
        setNameAndGetVariables('disabled');
      });

      it('should be disabled based on html attributes', function () {
        expect(select.getAttribute('disabled')).toBe('true');
      });

      it('should not allow an option to be selected', function () {
        testHelper.assertElementIsNotClickable(select);
      });
    });

    describe('invalid', function() {
      beforeEach(function() {
        setNameAndGetVariables('invalid');
      });

      it('should contain the proper number of options', function () {
        facade.assertOptionsCount(4); // 1 blank, 3 valid
        facade.selectOption('Female');
        facade.assertOptionsCount(3); // blank disappears once valid selected
      });

      it('should show an error', function () {
        testHelper.assertIsDisplayed(facade.getErrorText());
      });

      it('should show hide the error once a valid option is selected', function () {
        facade.selectOption('Female');

        testHelper.assertIsNotDisplayed(facade.getErrorText());
      });
    });

    describe('optional', function() {
      beforeEach(function() {
        setNameAndGetVariables('optional');
      });

      it('should contain the proper number of options', function () {
        facade.assertOptionsCount(4); // 1 blank, 3 valid
        facade.selectOption('Female');
        facade.assertOptionsCount(4); // blank option should stay around
      });

      it('should not select a default option', function () {
        facade.selectOption('Select'); // Placeholder
      });
    });

    describe('multiselect', function() {
      var selectedOptions;

      beforeEach(function() {
        setNameAndGetVariables('multiselect');

        selectedOptions = facade.getSelectedOptions();
      });

      it('should preselect the correct initial values', function() {
        selectedOptions.then(function(options) {
          expect(options.length).toBe(2); // Male, Female
        });
        testHelper.getFormDataValue('multiselect').then(function(values) {
          expect(values.length).toBe(2);
          expect(values).toContain('f');
          expect(values).toContain('m');
        });
      });

      it('should unselect a value on click', function() {
        femaleOption.click();
        selectedOptions.then(function(options) {
          expect(options.length).toBe(1); // Male
        });
        testHelper.getFormDataValue('multiselect').then(function(values) {
          expect(values.length).toBe(1);
          expect(values).toContain('m');
        });
      });

      it('should select an additional value on click', function() {
        unspecifiedOption.click();
        selectedOptions.then(function(options) {
          expect(options.length).toBe(3); // Male, Female, Unspecified
        });
        testHelper.getFormDataValue('multiselect').then(function(values) {
          expect(values.length).toBe(3);
          expect(values).toContain('f');
          expect(values).toContain('m');
          expect(values).toContain('u');
        });
      });
    });
  });
});
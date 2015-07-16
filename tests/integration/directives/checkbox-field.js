'use strict';

var testHelper = require('../test-helper');

// TODO Test field-errors

// Interface between tests (below) and the appropriate formFor Checkbox directive template
var Facade = function(identifier) {
  testHelper.goToPage('http://localhost:8000/examples/checkbox-field.html?template=' + identifier);

  var fieldName;

  this.setFieldName = function(value) {
    fieldName = value;
  };

  this.getCheckbox = function() {
    return element(by.css('[attribute=' + fieldName + ']'));
  };

  switch (identifier) {
    case 'bootstrap':
      this.getClickable = function() {
        return element(by.css('[attribute=' + fieldName + '] input'));
      };
      this.getErrorText = function() {
        return element(by.css('[attribute=' + fieldName + '] field-error p'));
      };
      this.getHoverable = function() {
        return element(by.css('[attribute=' + fieldName + '] [popover]'));
      };
      this.getTooltip = function() {
        return element(by.css('[attribute=' + fieldName + '] [popover-popup]'));
      };
      break;
    case 'default':
      this.getClickable = function() {
        return element(by.css('[attribute=' + fieldName + '] label'));
      };
      this.getErrorText = function() {
        return element(by.css('[attribute=' + fieldName + '] field-error p'));
      };
      this.getHoverable = function() {
        return element(by.css('[attribute=' + fieldName + '] .form-for-tooltip-icon'));
      };
      this.getTooltip = function() {
        return element(by.css('[attribute=' + fieldName + '] .form-for-tooltip-popover'));
      };
      break;
    case 'material':
      browser.ignoreSynchronization = true;

      this.getClickable = function() {
        return element(by.css('[attribute=' + fieldName + '] md-checkbox'));
      };
      this.getErrorText = function() {
        return element(by.css('[attribute=' + fieldName + '] field-error div'));
      };
      this.getHoverable = function() {
        return element(by.css('[attribute=' + fieldName + '] label'));
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
    var checkbox, clickable, facade, hoverable, tooltip;

    beforeEach(function() {
      facade = new Facade(template);

      browser.driver.manage().window().setSize(1600, 1000);
    });

    describe('enabled', function() {
      beforeEach(function() {
        facade.setFieldName('enabled');

        checkbox = facade.getCheckbox();
        clickable = facade.getClickable();
      });

      it('should show the correct label', function () {
        expect(checkbox.getText()).toBe('Checkbox checkbox');
      });

      it('should not show an error', function() {
        testHelper.assertIsNotDisplayed(facade.getErrorText());
      });

      it('should update the model on click', function () {
        expect(clickable.evaluate('model.bindable')).toBeFalsy();

        clickable.click();

        expect(clickable.evaluate('model.bindable')).toBeTruthy();
      });
    });

    describe('preselected', function() {
      beforeEach(function() {
        facade.setFieldName('preselected');

        checkbox = facade.getCheckbox();
        clickable = facade.getClickable();
      });

      it('should show the correct label', function () {
        expect(checkbox.getText()).toBe('Preselected checkbox');
      });

      it('should update the model on click', function() {
        expect(clickable.evaluate('model.bindable')).toBeTruthy();

        clickable.click();

        expect(clickable.evaluate('model.bindable')).toBeFalsy();
      });
    });

    describe('help', function() {
      beforeEach(function() {
        facade.setFieldName('help');
      });

      it('should not show help text by default', function() {
        if (template === 'material') return; // Material template doesn't expose a help tooltip

        testHelper.assertIsNotDisplayed(facade.getTooltip());
      });

      it('should show help text on hover', function() {
        if (template === 'material') return; // Material templates don't have help icons

        testHelper.doMouseOver(facade.getHoverable());
        testHelper.assertIsDisplayed(facade.getTooltip());
      });
    });

    describe('disabled', function() {
      beforeEach(function() {
        facade.setFieldName('disabled');

        checkbox = facade.getCheckbox();
        clickable = facade.getClickable();
        hoverable = facade.getHoverable();
        tooltip = facade.getTooltip();
      });

      it('should show the correct label', function () {
        expect(checkbox.getText()).toBe('Disabled checkbox');
      });

      it('should be disabled based on html attributes', function () {
        expect(checkbox.getAttribute('disable')).toBe('true');
      });

      it('should not update the model on click', function () {
        expect(clickable.evaluate('model.bindable')).toBeFalsy();

        clickable.click();

        expect(clickable.evaluate('model.bindable')).toBeFalsy();
      });
    });

    describe('invalid', function() {
      it('should show an error', function () {
        facade.setFieldName('invalid');

        testHelper.assertIsDisplayed(facade.getErrorText());
      });
    });
  });
});
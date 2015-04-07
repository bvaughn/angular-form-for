'use strict';

// Interface between tests (below) and the appropriate formFor Checkbox directive template
var Facade = function(identifier) {
  browser.driver.get('http://localhost:8081/examples/checkbox-field.html?template=' + identifier);
  browser.driver.wait(browser.driver.isElementPresent(by.id('form')), 5000);

  this.getCheckbox = function(fieldName) {
    return element(by.css('[attribute=' + fieldName + ']'));
  };

  switch (identifier) {
    case 'bootstrap':
      this.getClickable = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] input'));
      };
      this.getHoverable = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] [popover]'));
      };
      this.getTooltip = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] [popover-popup]'));
      };
      break;
    case 'default':
      this.getClickable = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] label'));
      };
      this.getHoverable = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] .form-for-tooltip-icon'));
      };
      this.getTooltip = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] .form-for-tooltip-popover'));
      };
      break;
    case 'material':
      browser.ignoreSynchronization = true;
      this.getClickable = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] md-checkbox'));
      };
      this.getHoverable = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] label'));
      };
      this.getTooltip = function(fieldName) {
        return element(by.css('md-tooltip'));
      };
      break;
  }
};

// Test each of our templates
['bootstrap', 'default', 'material'].forEach(function(template) {
  describe(template, function() {
    var checkbox, clickable, facade, hoverable, tooltip;

    beforeEach(function() {
      facade = new Facade(template);
    });

    describe('enabled', function() {
      beforeEach(function() {
        checkbox = facade.getCheckbox('enabled');
        clickable = facade.getClickable('enabled');
      });

      it('should show the correct label', function () {
        expect(checkbox.getText()).toBe('Checkbox checkbox');
      });

      it('should update the model on click', function () {
        expect(clickable.evaluate('model.bindable')).toBeFalsy();

        clickable.click();

        expect(clickable.evaluate('model.bindable')).toBeTruthy();
      });
    });

    describe('preselected', function() {
      beforeEach(function() {
        checkbox = facade.getCheckbox('preselected');
        clickable = facade.getClickable('preselected');
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

    // TODO No element found using locator
    describe('help', function() {
      xit('show not show help text by default', function() {
        var tooltip = facade.getTooltip('help');

        expect(tooltip.isPresent() && tooltip.isDisplayed()).toBeFalsy();
      });

      xit('should show help text on hover', function() {
        browser.actions().mouseMove(facade.getHoverable('help')).perform();

        var tooltip = facade.getTooltip('help');

        expect(tooltip.isPresent() && tooltip.isDisplayed()).toBeTruthy();
      });
    });

    describe('disabled', function() {
      beforeEach(function() {
        checkbox = facade.getCheckbox('disabled');
        clickable = facade.getClickable('disabled');
        hoverable = facade.getHoverable('disabled');
        tooltip = facade.getTooltip('disabled');
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
  });
});
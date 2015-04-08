'use strict';

// Interface between tests (below) and the appropriate formFor Radio directive template
var Facade = function(identifier) {
  browser.driver.get('http://localhost:8081/examples/radio-field.html?template=' + identifier);
  browser.driver.wait(browser.driver.isElementPresent(by.id('form')), 5000);

  this.getRadio = function(fieldName) {
    return element(by.css('[attribute=' + fieldName + ']'));
  };

  switch (identifier) {
    case 'bootstrap':
      this.getClickables = function(fieldName) {
        return element.all(by.css('[attribute=' + fieldName + '] [ng-repeat] input'));
      };
      this.getErrorText = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] field-error p'));
      };
      this.getGroupLabel = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] label [ng-bind-html]'));
      };
      this.getHoverable = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] label [popover]'));
      };
      this.getTooltip = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] label [popover-popup]'));
      };
      break;
    case 'default':
      this.getClickables = function(fieldName) {
        return element.all(by.css('[attribute=' + fieldName + '] [ng-repeat] input'));
      };
      this.getErrorText = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] field-error p'));
      };
      this.getGroupLabel = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] label [ng-bind-html]'));
      };
      this.getHoverable = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] label .form-for-tooltip'));
      };
      this.getTooltip = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] label .form-for-tooltip-popover'));
      };
      break;
    case 'material':
      browser.ignoreSynchronization = true;

      this.getClickables = function(fieldName) {
        return element.all(by.css('[attribute=' + fieldName + '] md-radio-group md-radio-button'));
      };
      this.getErrorText = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] field-error div'));
      };
      this.getGroupLabel = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] md-radio-group label'));
      };
      this.getHoverable = function(fieldName) {
        return element(by.css('[attribute=' + fieldName + '] md-radio-group label'));
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
    var radio, groupLabel, femaleClickable, maleClickable, facade, hoverable, tooltip;

    beforeEach(function() {
      facade = new Facade(template);
    });

    describe('preselected', function() {
      beforeEach(function() {
        radio = facade.getRadio('preselected');
        groupLabel = facade.getGroupLabel('preselected');
        femaleClickable = facade.getClickables('preselected').get(0);
        maleClickable = facade.getClickables('preselected').get(1);
      });

      it('should show the correct label', function () {
        expect(groupLabel.getText()).toBe('Preselected radio');
      });

      it('should not show an error', function() {
        facade.getErrorText('preselected').isDisplayed().then(
          function() {
            throw Error('Element should not be displayed');
          },
          function() {}
        );
      });

      // TODO
      xit('should update the model on click', function() {
        expect(radio.evaluate('model.bindable')).toBe('f');

        maleClickable.click();

        expect(radio.evaluate('model.bindable')).toBe('m');

        femaleClickable.click();

        expect(radio.evaluate('model.bindable')).toBe('f');
      });
    });

    // TODO No element found using locator
    describe('help', function() {
      beforeEach(function() {
        hoverable = facade.getHoverable('help');
        tooltip = facade.getTooltip('help');
      });

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
        radio = facade.getRadio('disabled');
        groupLabel = facade.getGroupLabel('disabled');
        femaleClickable = facade.getClickables('disabled').get(0);
        maleClickable = facade.getClickables('disabled').get(1);
      });

      it('should show the correct label', function () {
        expect(groupLabel.getText()).toBe('Disabled radio');
      });

      it('should be disabled based on html attributes', function () {
        expect(femaleClickable.getAttribute('disabled')).toBe('true');
        expect(maleClickable.getAttribute('disabled')).toBe('true');
      });

      // TODO
      xit('should not update the model on click', function () {
        expect(radio.evaluate('model.bindable')).toBeFalsy();

        femaleClickable.click();
        maleClickable.click();

        expect(radio.evaluate('model.bindable')).toBeFalsy();
      });
    });

     describe('invalid', function() {
       it('should show an error', function () {
         var errorText = facade.getErrorText('invalid');

         browser.wait(function () {
           return errorText.isPresent() && errorText.isDisplayed();
         }, 1000);
       });
     });
  });
});
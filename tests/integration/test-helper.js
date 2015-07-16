exports.assertElementIsClickable = function(element, opt_timeout) {
  var promise = protractor.ExpectedConditions.elementToBeClickable(element);

  return browser.wait(promise, opt_timeout || 100);
};

exports.assertElementIsNotClickable = function(element, opt_timeout) {
  return exports.assertElementIsClickable(element, opt_timeout).then(
    function() {
      throw Error('Element should not be clickable');
    },
    function() {
      // An element that is not clickable is what we want
    });
};

exports.assertFormDataValue = function(fieldName, expectedValue) {
  expect(exports.getFormDataValue(fieldName)).toBe(expectedValue);
};

exports.assertIsDisplayed = function(element, opt_timeout) {
  browser.wait(function () {
    return element.isPresent() &&
           element.isDisplayed();
  }, opt_timeout || 100);
};

exports.assertIsNotDisplayed = function(element) {
  return element.isDisplayed().then(
    function(isDisplayed) {
      if (isDisplayed) {
        throw Error('Element should not be displayed');
      }
    },
    function() {
      // An element not present in the DOM is not displayed (which is okay)
    });
};

exports.doMouseOver = function(element) {
  browser.actions().mouseMove(element).perform();
};

exports.getFormDataValue = function(fieldName) {
  return element(by.css('form')).evaluate('formData.' + fieldName);
};

exports.goToPage = function(url) {
  browser.driver.get(url);
  browser.driver.wait(browser.driver.isElementPresent(by.id('form')), 5000);
};
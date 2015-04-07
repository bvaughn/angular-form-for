'use strict';

module.exports = function(config) {
  config.set({
    autoWatch: true,
    basePath: '',
    frameworks: ['jasmine'],
    preprocessors: {
      'templates/**/*.html': 'ng-html2js'
    },
    // See https://github.com/karma-runner/karma-ng-html2js-preprocessor
    ngHtml2JsPreprocessor: {
    },
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/jasmine-object-matchers/dist/jasmine-object-matchers.js',
      'node_modules/jasmine-promise-matchers/dist/jasmine-promise-matchers.js',
      'dist/form-for.js',
      'tests/unit/**/*.js',
      'templates/**/*.html'
    ],
    exclude: [],
    port: 9999,
    browsers: [
      'PhantomJS'
    ],
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ],
    singleRun: false,
    colors: true,
    logLevel: config.LOG_INFO
  });
};

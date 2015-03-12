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
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/jasmine-object-matchers/dist/jasmine-object-matchers.js',
      'bower_components/jasmine-promise-matchers/dist/jasmine-promise-matchers.js',
      'dist/form-for.js',
      'tests/**/*.js',
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

var config = {
  allScriptsTimeout: 11000,

  capabilities: {
    browserName: 'chrome',
    shardTestFiles: true,
    maxInstances: 2
  },

  specs: [
    'tests/integration/**/*.js'
  ],

  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:8000/examples/',

  framework: 'jasmine',
  rootElement: 'body',

  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
    defaultTimeoutInterval: 30000
  }
};

if (process.env.TRAVIS_BUILD_NUMBER) {
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.capabilities = {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Tests'
  };
}

exports.config = config;
const jestConfig = require('./jest.config');

module.exports = {
  ...jestConfig,
  coverageReporters: [
    'text',
    'text-summary',
    'text-lcov',
    'lcov',
  ],
};

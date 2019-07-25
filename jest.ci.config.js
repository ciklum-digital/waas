module.exports = {
  ...require('./jest.config'),
  coverageReporters: [
    'text',
    'text-summary',
    'text-lcov',
    'lcov',
  ],
};

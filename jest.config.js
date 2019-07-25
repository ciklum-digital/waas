module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: [
    'text-summary',
  ],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    '**/*.ts',
    '!**/dist/**',
    '!**/playground/**',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/playground/',
  ],
  testMatch: [
    '**/src/**/*.spec.ts',
  ],
};

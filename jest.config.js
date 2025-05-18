module.exports = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  testMatch: ['**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70
    }
  },
  testTimeout: 10000
};
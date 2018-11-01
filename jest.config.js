// Hack: Don't reject self-signed certificates for
// the GitHub enterprise server to work.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

module.exports = {
  setupFiles: ['<rootDir>/test/unit/setup'],
  setupTestFrameworkScriptFile: '<rootDir>/test/unit/matchers',
  testMatch: ['**/(*.)unit.js'],
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: require('./aliases.config').jest,
  snapshotSerializers: ['jest-serializer-vue'],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: ['src/**/*.{js,vue}', '!**/node_modules/**'],
  globals: {
    'vue-jest': {
      // Disable CSS compilation until it's more stable
      experimentalCSSCompile: false
    }
  }
}

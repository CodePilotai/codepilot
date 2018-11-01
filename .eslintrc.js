module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:vue/recommended',
    'prettier',
    'prettier/standard'
  ],
  globals: {
    __static: true
  },
  // Rules lists:
  // - https://eslint.org/docs/rules/
  // - https://github.com/vuejs/eslint-plugin-vue#bulb-rules
  rules: {
    // requires that only const and let are allowed
    'no-var': 'error',
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // HACK: Turning this off until false positives are fixed
    'vue/valid-v-on': 'off'
  },
  overrides: [
    {
      files: ['src/**/*'],
      rules: {
        'no-console':
          process.env.NODE_ENV === 'production'
            ? ['error', { allow: ['warn', 'error'] }]
            : 'off'
      }
    },
    {
      files: ['**/*.unit.js'],
      parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
      },
      env: { jest: true },
      globals: {
        mount: false,
        shallowMount: false,
        createComponentMocks: false,
        createModuleStore: false,
        createSearchRunner: false,
        testConstants: false
      }
    }
  ]
}

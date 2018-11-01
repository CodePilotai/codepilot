module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recess-order',
    'stylelint-config-css-modules'
  ],
  plugins: ['stylelint-scss'],
  // Rule lists:
  // - https://stylelint.io/user-guide/rules/
  // - https://github.com/kristerkari/stylelint-scss#list-of-rules
  rules: {
    // Prevents conflict with prettier's line wrapping
    'declaration-colon-newline-after': null,
    'selector-class-pattern': /(^[a-z-]+$)/,
    'selector-id-pattern': /(^[a-z-]+$)/,
    'selector-max-universal': 1,
    // ===
    // SCSS
    // ===
    'scss/dollar-variable-colon-space-after': 'always',
    'scss/dollar-variable-colon-space-before': 'never',
    'scss/dollar-variable-no-missing-interpolation': true,
    'scss/dollar-variable-pattern': /^[a-z-]+$/,
    'scss/double-slash-comment-whitespace-inside': 'always',
    'scss/operator-no-newline-before': true,
    'scss/operator-no-unspaced': true,
    'scss/selector-no-redundant-nesting-selector': true,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          '/mixin/',
          '/include/',
          '/function/',
          '/if/',
          '/return/',
          '/tailwind/'
        ]
      }
    ]
  }
}

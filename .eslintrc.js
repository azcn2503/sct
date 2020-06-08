module.exports = {
  extends: 'erb/typescript',
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',

    // SCT rules below
    '@typescript-eslint/no-unused-vars': 'off', // Due to prop spreading, and React being required in context for React components.
    'react/jsx-props-no-spreading': 'off', // React JSX spreading is incredibly useful, why disable it?
    'no-console': 'off', // Console grouping is useful for plugins
    'no-eval': 'off', // Eval is required by plugins
    'react/jsx-one-expression-per-line': 'off', // Prettier,
    'react/destructuring-assignment': 'off', // Redux actions often have the same name as props, requiring prop name juggling if this rule is active,
    'import/no-named-as-default': 'off'
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./configs/webpack.config.eslint.js')
      }
    }
  }
};

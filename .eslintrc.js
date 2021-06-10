module.exports = {
  extends: ['@titelmedia/eslint-config-es6', 'plugin:react/recommended', 'prettier'],
  plugins: ['prettier', 'react-hooks'],
  parser: 'babel-eslint',
  env: {
    node: true,
    browser: true,
  },
  globals: {},
  rules: {
    'prettier/prettier': 'error',
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        extensions: ['.js', '.jsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
};

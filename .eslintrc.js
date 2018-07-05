module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never'
    }],
    'vue/attributes-order': [
      'error',
      {
        order: [
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'BINDING',
          'DEFINITION',
          'OTHER_ATTR',
          'CONTENT',
          'EVENTS',
        ],
      },
    ],
    'vue/name-property-casing': ['error', 'kebab-case'],
    'vue/attribute-hyphenation': 'off',
    'vue/html-closing-bracket-newline': ['error', { multiline: 'always' }],
    'vue/html-closing-bracket-spacing': ['error'],
  },
  globals: {},
  settings: {
    'import/resolver': {
      webpack: 'webpack.config.js',
    },
  },
};


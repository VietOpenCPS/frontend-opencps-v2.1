// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    "comma-dangle": "off",
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-extra-semi': 2,
    'quotes': 'off',
    'semi': 'off',
    'space-before-function-paren': 'off',
    'operator-linebreak': 'off',
    'one-var-declaration-per-line': 'off',
    'no-trailing-spaces': 'off',
    'linebreak-style': 'off',
    'newline-per-chained-call': 'off',
    'nonblock-statement-body-position': 'off',
    'computed-property-spacing': 'off'
  },
  "comma-dangle": ["error", {
    "arrays": "never",
    "objects": "never",
    "imports": "never",
    "exports": "never",
    "functions": "never"
  }],
  "no-extra-semi": ["error", "never"]
}

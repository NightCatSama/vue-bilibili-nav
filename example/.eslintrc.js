module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    'semi': 0,
    'arrow-parens': 0,
    'space-before-function-paren': 0,
    'no-alert': 0,
    'indent': ['error', 'tab'],
    'brace-style': ['error', 'stroustrup'],
    'no-extend-native': 0,
    'quotes': [2, 'single'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}

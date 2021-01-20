/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  env: {
    jest: true,
    browser: true
  },
  extends: [
    'standard-with-typescript',
    'standard-react',
    'plugin:testing-library/react',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
    'prettier/react',
    'prettier/standard'
  ],
  plugins: [
    'typescript-sort-keys',
    'prettier',
    'testing-library',
    'react-hooks',
    'simple-import-sort',
    'sort-destructure-keys',
    'tsdoc'
  ],
  rules: {
    'sort-imports': 'off',
    'import/order': 'off',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [['^\\u0000', '^@?\\w', '^[^.]', '^\\.']]
      }
    ]
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'tsdoc/syntax': 'warn',
        'typescript-sort-keys/interface': 'error',
        'typescript-sort-keys/string-enum': 'error'
      }
    },
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        'react/prop-types': 'off',
        'sort-destructure-keys/sort-destructure-keys': [
          'error',
          { caseSensitive: false }
        ]
      }
    }
  ]
}

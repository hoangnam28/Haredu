module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  ignorePatterns: ['*.spec.ts', 'e2e', '*.po.ts'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-empty-function': 0,
    '@angular-eslint/no-empty-lifecycle-method': 'off',
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': [2],
    'no-else-return': [2],
    'no-compare-neg-zero': [2],
    eqeqeq: [2],
    'no-multi-spaces': 'error',
    'max-depth': [2, 3],
    'max-lines-per-function': [2, 50],
    'no-empty': [2],
    'array-bracket-spacing': [2],
    'block-spacing': [2],
  },
};

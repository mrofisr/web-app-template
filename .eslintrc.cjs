module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'standard-with-typescript',
    'prettier',
  ],
  ignorePatterns: [
    'dist',
    'build',
    '.eslintrc.cjs',
    'vite.config.ts',
    'node_modules',
    'test-setup.ts',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'jsx-quotes': ['error', 'prefer-single'],
    'no-console': ['error', { allow: ['error', 'warn', 'info'] }], // no console.log(), but allow console.error/warn()
    'comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/no-misused-promises': [ 'error', { checksVoidReturn: false }],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
  },
}

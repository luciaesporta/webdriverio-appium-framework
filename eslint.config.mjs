import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import wdioPlugin from 'eslint-plugin-wdio';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'allure-results/**',
      'allure-report/**',
      'reports/**',
      'apps/**',
      '*.log',
      'eslint.config.mjs',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...wdioPlugin.configs['flat/recommended'],
    files: ['test/**/*.ts', 'config/**/*.ts'],
  },
  {
    files: ['test/**/*.ts', 'config/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
  prettier,
);

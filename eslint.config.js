import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ),
  ),
  {
    files: ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
    ignores: ['**/dist'],
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      'unused-imports': unusedImports,
      'react-refresh': reactRefresh,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tsParser,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': false,
          'ts-nocheck': false,
          'ts-check': false,
          minimumDescriptionLength: 0,
        },
      ],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-loss-of-precision': 'warn',
      'no-template-curly-in-string': 'error',
      'max-len': [
        'error',
        {
          code: 80,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreUrls: true,
        },
      ],
      'no-console': 'warn',
      'no-empty': 'off',
      'prefer-const': 'error',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/assets/icons',
              message:
                'Direct import from @/assets/icons is not allowed. Use the <Icon /> component from @/components/icon instead.',
            },
          ],
          patterns: [
            {
              group: ['@/assets/icons/*.svg'],
              message:
                'Direct import of SVG icons is not allowed. Use the <Icon /> component from @/components/icon instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/assets/icons',
              message:
                'Direct import from @/assets/icons is not allowed. Use the <Icon /> component from @/components/icon instead.',
            },
            {
              name: '@/components',
              message:
                'Import from @/components index is not allowed within components. Use direct imports like @/components/button instead to prevent circular dependencies.',
            },
          ],
          patterns: [
            {
              group: ['@/assets/icons/*.svg'],
              message:
                'Direct import of SVG icons is not allowed. Use the <Icon /> component from @/components/icon instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/icon/index.tsx', 'src/assets/icons/index.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
];

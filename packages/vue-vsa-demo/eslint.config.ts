import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
// @ts-expect-error - plugin-import doesn't have types for flat config yet
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    ignores: ['dist', 'coverage', '.dependency-cruiser.cjs'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      // ENFORCE VERTICAL SLICE BOUNDARIES
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              // Slices cannot import from other slices' internals
              target: './src/modules/auth',
              from: './src/modules/!(auth|shared)',
              message: 'Cross-slice coupling detected. Use Public APIs or the Event Bus.',
            },
            {
              // Shared cannot import from business modules
              target: './src/shared',
              from: './src/modules',
              message: "Shared utilities must remain 'pure' and context-blind.",
            },
            {
              // Force use of the Public API gatekeeper
              target: './src/modules',
              from: './src/modules/**/!(index|*.public).ts',
              message: 'Private internal import detected. Use the .public.ts file.',
            },
          ],
        },
      ],
    },
  },
);

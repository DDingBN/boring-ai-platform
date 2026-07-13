import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['**/build/**', '**/dist/**', '**/node_modules/**', '**/.turbo/**']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [js.configs.recommended, tseslint.configs.recommended],
    },
    {
        files: ['apps/server/**/*.ts', 'packages/**/*.ts'],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        files: ['apps/web/**/*.{ts,tsx}'],
        extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
        languageOptions: {
            globals: globals.browser,
        },
    },
]);

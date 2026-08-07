import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['**/build/**', '**/dist/**', '**/node_modules/**', '**/.turbo/**']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [js.configs.recommended, tseslint.configs.recommended],
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        extends: [js.configs.recommended],
    },
    {
        files: ['apps/server/**/*.ts', 'packages/**/*.ts'],
        languageOptions: {
            globals: globals.node,
        },
    },
    ...vue.configs['flat/essential'],
    {
        files: ['apps/web/**/*.{js,vue}'],
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            'vue/multi-word-component-names': 'off',
        },
    },
    {
        files: ['apps/web/vite.config.js'],
        languageOptions: {
            globals: globals.node,
        },
    },
]);

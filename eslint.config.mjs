import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import vue from 'eslint-plugin-vue';
import globals from 'globals';

export default defineConfig([
    globalIgnores(['**/build/**', '**/dist/**', '**/node_modules/**', '**/.turbo/**']),
    {
        files: ['**/*.{js,mjs,cjs}'],
        extends: [js.configs.recommended],
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

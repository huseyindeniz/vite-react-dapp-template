// presets
import mantine from 'eslint-config-mantine';
import eslint from '@eslint/js';
/*
import reacthooks from 'eslint-plugin-react-hooks';
import a11y from "eslint-plugin-jsx-a11y";
import storybook from 'eslint-plugin-storybook';
*/

// plugins
import eslintpluginimport from "eslint-plugin-import";
import reactrefresh from "eslint-plugin-react-refresh";
import { defineConfig } from 'eslint/config';

export default defineConfig(
    eslint.configs.recommended,
    mantine,
    // reacthooks.configs.recommended,
    // a11y.configs.recommended,
    // storybook.configs.recommended,
    {
        ignores: ['dist', 'build', 'node_modules', '.storybook', 'dev', '**/*.{mjs,cjs,js,d.ts,d.mts}'],
    },
    {
        files: ['src/**/*'],
        languageOptions: {
            globals: {
                browser: true,
                es2020: true,
            },
            parserOptions: {
                parser: "@typescript-eslint/parser",
                sourceType: "module",
                tsconfigRootDir: import.meta.dirname,
                project: "./tsconfig.json"
            }
        },

        plugins: {
            "react-refresh": reactrefresh,
            "import": eslintpluginimport
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            'no-unused-vars': "off",
            "@typescript-eslint/no-unused-vars": "warn",
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
            "import/order": [
                "warn",
                {
                    "newlines-between": "always",
                    "groups": [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index"
                    ],
                    "pathGroups": [
                        {
                            "pattern": "react",
                            "group": "builtin",
                            "position": "before"
                        },
                        {
                            "pattern": "@/**",
                            "group": "parent",
                            "position": "before"
                        },
                        {
                            "pattern": "**/*.stories.ts?",
                            "group": "external",
                            "position": "before"
                        },
                        {
                            "pattern": "**/*.test.ts?",
                            "group": "external",
                            "position": "before"
                        }
                    ],
                    "pathGroupsExcludedImportTypes": [
                        "builtin"
                    ],
                    "alphabetize": {
                        "order": "asc",
                        "caseInsensitive": true
                    }
                }
            ]
        },
    },
    {
        files: ['*.config.ts', '*.config.js', '*.config.mjs'],
        languageOptions: {
            globals: {
                node: true,
                es2020: true,
            },
            parserOptions: {
                parser: "@typescript-eslint/parser",
                sourceType: "module",
                tsconfigRootDir: import.meta.dirname,
                project: "./tsconfig.node.json"
            }
        },
        plugins: {
            "import": eslintpluginimport
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            'no-unused-vars': "off",
            "@typescript-eslint/no-unused-vars": "warn",
        },
    }
)
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import jestPlugin from "eslint-plugin-jest";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import storybookPlugin from "eslint-plugin-storybook";
import importPlugin from "eslint-plugin-import";
import { includeIgnoreFile } from "@eslint/compat";
import prettierConfig from "eslint-config-prettier";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import nodePlugin from "eslint-plugin-n";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextPlugin from "@next/eslint-plugin-next";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
  includeIgnoreFile(gitignorePath),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      react: reactPlugin,
      "jsx-a11y": jsxA11yPlugin,
      prettier: prettierPlugin,
      "@typescript-eslint": typescriptPlugin,
      storybook: storybookPlugin,
      import: importPlugin,
      next: nextPlugin,
      "react-hooks": reactHooksPlugin,
      "@stylistic/ts": stylisticTs,
      n: nodePlugin,
    },
    rules: {
      ...jsxA11yPlugin.flatConfigs.strict.rules,
      ...typescriptPlugin.configs["eslint-recommended"].rules,
      "react/prop-types": 0,
      "react/react-in-jsx-scope": 0,

      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          trailingComma: "es5",
          singleQuote: false,
        },
      ],

      "jsx-a11y/anchor-is-valid": [
        0,
        {
          components: ["Link"],
          specialLink: ["hrefLeft", "hrefRight"],
          aspects: ["noHref", "invalidHref", "preferButton"],
        },
      ],
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        {
          tags: [],
          roles: ["tabpanel"],
          allowExpressionValues: true,
        },
      ],

      "n/exports-style": ["error", "module.exports"],

      "@stylistic/ts/linebreak-style": [0, "error", "windows"],
      "@stylistic/ts/quotes": ["error", "double"],
      "@stylistic/ts/semi": ["error", "always"],

      "no-unneeded-ternary": 1,
      "no-implied-eval": 1,
      "require-await": "error",

      "@typescript-eslint/explicit-module-boundary-types": [1],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-implied-eval": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "enumMember",
          format: ["PascalCase"],
        },
      ],

      "import/order": [
        "error",
        {
          named: true,
          groups: [
            ["builtin", "external"],
            ["internal", "parent", "sibling", "index"],
          ],
          "newlines-between": "always-and-inside-groups",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
            orderImportKind: "asc",
          },
          pathGroups: [
            {
              pattern: "react",
              group: "builtin",
              position: "before",
            },
            {
              pattern:
                "{animations,components,context,fonts,hooks,i18n,layouts,pages,public,scripts,styles,types,utils}/**",
              group: "internal",
            },
            {
              pattern:
                "{animations,components,context,fonts,hooks,i18n,layouts,pages,public,scripts,styles,types,utils}",
              group: "internal",
            },
          ],
          distinctGroup: true,
          pathGroupsExcludedImportTypes: ["react"],
        },
      ],

      "sort-imports": [
        "error",
        {
          ignoreDeclarationSort: true,
          ignoreCase: true,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    ignores: [],
  },
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    ...testingLibraryPlugin.configs["flat/react"],
    plugins: {
      ...testingLibraryPlugin.configs["flat/react"].plugins,
      "testing-library": testingLibraryPlugin,
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs["flat/all"].rules,
      ...testingLibraryPlugin.configs["flat/react"].rules,
      "jest/prefer-importing-jest-globals": 0,
    },
  },
  {
    name: "react-hooks/recommended",
    plugins: { "react-hooks": reactHooksPlugin },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    name: "@next/next",
    plugins: { "@next/next": nextPlugin },
    rules: nextPlugin.configs.recommended.rules,
  },
  prettierConfig,
];

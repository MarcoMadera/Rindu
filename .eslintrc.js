module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier",
    "next",
    "plugin:@typescript-eslint/recommended",
    "plugin:storybook/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "jsx-a11y", "prettier", "@typescript-eslint"],
  rules: {
    "react/prop-types": 0,
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        trailingComma: "es5",
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
    "linebreak-style": 0,
    "global-require": 0,
    "eslint linebreak-style": [0, "error", "windows"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "no-unneeded-ternary": 1,
    "react/react-in-jsx-scope": 0,
    "no-implied-eval": "off",
    "require-await": "off",
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ["*.ts", "*.tsx"],
      rules: {
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
            groups: [
              ["builtin", "external"],
              ["internal", "parent", "sibling", "index"],
            ],
            "newlines-between": "always",
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
            ],
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
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react", "plugin:jest/all"],
      plugins: ["testing-library", "jest"],
    },
  ],
};

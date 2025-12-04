import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import nextPlugin from "@next/eslint-plugin-next";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

const typeAwareConfigs = [
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
].map((config) => ({
  ...config,
  files: config.files ?? ["**/*.{ts,tsx}"],
  languageOptions: {
    ...config.languageOptions,
    parserOptions: {
      ...(config.languageOptions?.parserOptions ?? {}),
      project: "./tsconfig.json",
      tsconfigRootDir: import.meta.dirname,
    },
  },
}));

const nextConfig = [
  {
    ignores: [".next/**", "dist/**", "node_modules/**", "**/next-env.d.ts"],
  },
  js.configs.recommended,
  ...typeAwareConfigs,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      "@typescript-eslint/no-inferrable-types": ["error", { ignoreParameters: true }],
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    plugins: {
      "@next/next": nextPlugin,
      import: importPlugin,
    },
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...nextPlugin.configs.recommended.rules,
      // Disable prop-types since we're using TypeScript
      "react/prop-types": "off",
      // Disable unused React imports for modern JSX transform
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "^React$",
        },
      ],
      // Disable some accessibility rules that conflict with component props
      "jsx-a11y/aria-role": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [
            { pattern: "@components/**", group: "internal" },
            { pattern: "@horizon/**", group: "internal" },
            { pattern: "@actions/**", group: "internal" },
            { pattern: "@data/**", group: "internal" },
            { pattern: "@services/**", group: "internal" },
            { pattern: "@utils/**", group: "internal" },
            { pattern: "@styles/**", group: "internal" },
            { pattern: "@/**", group: "internal" },
            { pattern: "~/**", group: "internal" },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          distinctGroup: false,
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
          alwaysTryTypes: true,
        },
      },
    },
  },
  eslintConfigPrettier,
];

export { nextConfig };
export default nextConfig;

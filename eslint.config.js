import globals from "globals";
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import jest from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
  eslintPluginUnicorn.configs.recommended,
  jest.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      jsdoc,
    },
    rules: {
      "jsdoc/require-description": "error",
      "jsdoc/check-values": "error",
      "unicorn/no-asterisk-prefix-in-documentation-comments": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-split-limit": "off",
      "unicorn/prefer-ternary": "off",
      "unicorn/template-indent": "off",
      "unicorn/prevent-abbreviations": ["error"],
    },
  },
  {
    ignores: ["coverage/*"],
  },
];

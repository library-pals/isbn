import globals from "globals";
import js from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default [
  js.configs.recommended,
  jsdoc.configs["flat/recommended"],
  eslintPluginUnicorn.configs["flat/recommended"],
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
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          allowList: {
            isbndb: true,
            IsbnDb: true,
            resolveIsbnDb: true,
            mockResponseIsbnDb: true,
          },
        },
      ],
    },
  },
  {
    ignores: ["coverage/*"],
  },
];

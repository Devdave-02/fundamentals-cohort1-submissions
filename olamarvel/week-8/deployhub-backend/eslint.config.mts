// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "dist/",
      "coverage/",
      "public/",
      "node_modules/",
      "**/__tests__/**",
      "**/*.test.*",
      "**/*.spec.*"
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.node,
    },
    plugins: { js },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
  },

  {
    files: ["**/__tests__/**/*", "**/*.test.*", "**/*.spec.*"],
    languageOptions: {
      globals: {
        ...globals.node,
        jest: true,
      },
    },
    rules: {
      "no-unused-expressions": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

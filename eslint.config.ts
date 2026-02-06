import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
// @ts-ignore - plugin-import doesn't have types for flat config yet
import importPlugin from "eslint-plugin-import";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // ENFORCE VERTICAL SLICE BOUNDARIES
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              // Slices cannot import from other slices' internals
              target: "./src/modules/auth",
              from: "./src/modules/!(auth|shared)",
              message: "Cross-slice coupling detected. Use Public APIs or the Event Bus.",
            },
            {
              // Shared cannot import from business modules
              target: "./src/shared",
              from: "./src/modules",
              message: "Shared utilities must remain 'pure' and context-blind.",
            },
            {
              // Force use of the Public API gatekeeper
              target: "./src/modules",
              from: "./src/modules/**/!(index|*.public).ts",
              message: "Private internal import detected. Use the .public.ts file.",
            },
          ],
        },
      ],
    },
  },
);
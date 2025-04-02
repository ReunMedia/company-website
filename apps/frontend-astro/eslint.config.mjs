// @ts-check

/**
 * Reun Media typescript-eslint configuration
 *
 * @author Reun Media <company@reun.eu>
 * @copyright 2024 Reun Media
 *
 * @see https://github.com/ReunMedia/project-templates
 *
 * @version 1.3.1
 */

import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default tseslint.config(
  // ESLint
  eslint.configs.recommended,
  // typescript-eslint
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  // Astro
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    rules: {
      // Using `export type Props = Pick<...>;` doesn't work with Astro, so we
      // need to allow `export interface Props extends Pick<...> {}` instaed.
      "@typescript-eslint/no-empty-object-type": [
        "error",
        {
          allowInterfaces: "always",
        },
      ],
    },
  },
  // Vue
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: { parserOptions: { parser: "@typescript-eslint/parser" } },
  },
  // Prettier
  eslintConfigPrettier,
  // Custom rules
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // Respect .gitignore
  includeIgnoreFile(gitignorePath),
);

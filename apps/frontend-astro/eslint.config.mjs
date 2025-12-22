// eslint.config.mjs
// @ts-check
import { defineConfig } from "eslint/config";
import createReunMediaConfig from "@reunmedia/eslint-config";

export default defineConfig(await createReunMediaConfig(import.meta.url));

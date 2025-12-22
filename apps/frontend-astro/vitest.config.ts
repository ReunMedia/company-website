/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig(
  {},
  {
    // Force consistent trailing slash behaviour for test environment
    trailingSlash: "always",
  },
);

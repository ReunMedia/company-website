import type { AstroUserConfig } from "astro";
import astroConfig from "../config.ts";

const trailingSlash: AstroUserConfig["trailingSlash"] =
  astroConfig.trailingSlash;

/**
 * Normalizes trailing slash according to Astro's `trailingSlash` configuration.
 */
export function normalizeTrailingSlash(path: string): string {
  if (trailingSlash === "always" && !path.endsWith("/")) {
    path += "/";
  } else if (trailingSlash === "never" && path.endsWith("/")) {
    path = path.substring(0, path.length - 1);
  }
  return path;
}

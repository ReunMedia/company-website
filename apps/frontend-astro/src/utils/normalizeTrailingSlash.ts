import type { AstroUserConfig } from "astro";
import astroConfig from "../config.ts";

const trailingSlash: AstroUserConfig["trailingSlash"] =
  astroConfig.trailingSlash;

/**
 * Normalizes trailing slash according to Astro's `trailingSlash` configuration.
 */
export function normalizeTrailingSlash(path: string): string {
  // If path is an absolute URL instead of relative path, normalization should
  // only apply to current Astro site.
  if (URL.canParse(path) && !path.startsWith(astroConfig.site)) {
    return path;
  }

  if (trailingSlash === "always" && !path.endsWith("/")) {
    path += "/";
  } else if (trailingSlash === "never" && path.endsWith("/")) {
    path = path.substring(0, path.length - 1);
  }
  return path;
}

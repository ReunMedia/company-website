import { trailingSlash, site } from "astro:config/client";

/**
 * Normalizes trailing slash according to Astro's `trailingSlash` configuration.
 */
export function normalizeTrailingSlash(path: string): string {
  // If path is an absolute URL instead of relative path, normalization should
  // only apply to current Astro site.
  if (URL.canParse(path) && !path.startsWith(site ?? "")) {
    return path;
  }

  if (trailingSlash === "always" && !path.endsWith("/")) {
    path += "/";
  } else if (trailingSlash === "never" && path.endsWith("/")) {
    path = path.substring(0, path.length - 1);
  }
  return path;
}

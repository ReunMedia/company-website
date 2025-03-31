import { assert, describe, test } from "vitest";
import { normalizeTrailingSlash } from "../../src/utils/normalizeTrailingSlash";
import astroConfig from "../../astro.config.ts";

describe("Trailing slash normalization", () => {
  test("Relative paths", () => {
    assert(normalizeTrailingSlash("/en/privacy").endsWith("/"));
    assert(normalizeTrailingSlash("/en/privacy/").endsWith("/"));
  });
  test("Absolute URLs for current site", () => {
    assert(
      normalizeTrailingSlash(astroConfig.site + "/en/privacy").endsWith("/"),
    );
    assert(
      normalizeTrailingSlash(astroConfig.site + "/en/privacy/").endsWith("/"),
    );
  });
  test("Absolute URLs for external sites", () => {
    assert(
      normalizeTrailingSlash("https://example.com/test").endsWith("/") ===
        false,
    );
    assert(normalizeTrailingSlash("https://example.com/test/").endsWith("/"));
  });
  test("mailto:, tel: etc.", () => {
    assert(
      normalizeTrailingSlash("mailto:admin@example.com").endsWith("/") ===
        false,
    );
    assert(normalizeTrailingSlash("mailto:admin@example.com/").endsWith("/"));
    assert(normalizeTrailingSlash("tel:+000123456789").endsWith("/") === false);
    assert(normalizeTrailingSlash("tel:+000123456789/").endsWith("/"));
  });
});

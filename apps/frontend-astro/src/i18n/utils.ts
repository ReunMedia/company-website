import type { AstroConfig } from "astro";
import { languages } from "./i18n";

type Locale = Exclude<AstroConfig["i18n"], undefined>["locales"][0];
type NormalizedLocale = Exclude<Locale, string> & {
  /**
   * Language name.
   */
  name: string;
};
/**
 * Normalizes a string or object locale to an object locale.
 */
export function normalizeLocale(locale: Locale): NormalizedLocale {
  const { codes, path } =
    typeof locale !== "string"
      ? locale
      : { codes: [locale] as [string, ...string[]], path: locale };
  const name = languages[path as keyof typeof languages] ?? path;
  return { codes, path, name };
}

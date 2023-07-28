/**
 * Alternative URL path for a page in different locale.
 */
export interface LocalizedPath {
  /**
   * Locale ISO code. E.g. `en-US`)
   */
  code: string;
  /**
   * Locale path. E.g. `en`)
   */
  path: string;
  /**
   * Localized slug. E.g. `news`
   */
  slug: string;
}

import type { IntRange } from "type-fest";

/**
 * Returns an absolute URL to Directus asset based on asset ID.
 *
 * @param assetID Directus asset ID
 * @param options
 * @returns Directus asset URL with specified transformations
 */
export function directusAssetUrl(
  assetID: string,
  {
    filename = "",
    quality = 80,
    format = "auto",
  }: {
    /**
     * Optional filename (https://directus.io/docs/guides/files/access#seo)
     */
    filename?: string;
    /**
     * Compression quality. Default `80`.
     */
    quality?: IntRange<0, 101>;
    /**
     * Image format (default `auto`) (https://directus.io/docs/guides/files/transform#custom-transformations)
     *
     * Use `auto` for `svg`.
     */
    format?: "auto" | "jpg" | "png" | "webp" | "tiff" | "avif";
  } = {},
): string {
  if (assetID === "") return "";
  let url = `${import.meta.env.PUBLIC_DIRECTUS_URL}/assets/${assetID}`;
  url += filename ? `/${filename}` : "";
  url += `?format=${format}`;
  url += `&quality=${quality}`;
  return url;
}

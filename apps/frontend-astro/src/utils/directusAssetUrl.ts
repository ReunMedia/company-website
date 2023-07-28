/**
 * Returns an absolute URL to Directus asset based on asset ID.
 *
 * @param assetID Directus asset ID
 * @param filename Optional filename (https://directus.io/docs/guides/files/access#seo)
 * @param format Image format (default `auto`) (https://directus.io/docs/guides/files/transform#custom-transformations)
 * @returns
 */
export function directusAssetUrl(
  assetID: string,
  filename?: string,
  format = "auto",
): string {
  if (assetID === "") return "";
  let url = `${import.meta.env.PUBLIC_DIRECTUS_URL}/assets/${assetID}`;
  url += filename ? `/${filename}` : "";
  url += `?format=${format}`;
  return url;
}

/**
 * A very naive regex chain to extract CSS color variables into JS object.
 *
 * This is used because Vite can't yet import native CSS modules.
 *
 * @todo Remove once Vite supports native CSS modules
 * @see https://github.com/vitejs/vite/issues/17700
 * @see https://github.com/vitejs/vite/discussions/18534
 * @see https://css-tricks.com/css-modules-the-native-ones/
 *
 */
export function cssColorsToJs(cssString: string): Record<string, string> {
  let str = cssString;
  // Extract everything between `{}`
  str = str.replace(/.*{(.*)}/ms, "$1");
  // Remove comments
  str = str.replace(/\/\*.*?\*\//gms, "");
  // Change CSS declarations to object properties
  str = str.replace(/^\s*(.*?):\s*(.*);/gm, '"$1": "$2",');
  // Remove trailing comma and any whitespace
  str = str.replace(/,\s*$/, "");
  // Parse string as JSON
  return JSON.parse(`{${str}}`);
}

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

  // Remove line breaks
  str = str.replace(/[\n\r]/g, "");
  // Extract everything between `{}`
  str = str.replace(/.*{(.*)}/, "$1");
  // Remove comments
  str = str.replace(/\/\*.*?\*\//g, "");
  // Change CSS declarations to object properties
  // This regex contains some additional handling for CSS processed by Vite
  str = str.replace(/\s*(.*?):\s*(.*?)(?:;|$)/g, '"$1": "$2",');
  // Remove trailing comma and trailing whitespace
  str = str.replace(/,\s*$/, "");

  // Parse string as JSON
  try {
    return JSON.parse(`{${str}}`);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error("Error when parsing CSS colors to JSON");
    }
    throw e;
  }
}

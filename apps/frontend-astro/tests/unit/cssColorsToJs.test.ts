import { it, describe } from "vitest";
import { expect } from "vitest";
import { cssColorsToJs } from "../../src/utils/cssColorsToJs";
import { readFile } from "fs/promises";
import { resolve } from "path";

describe("cssColorsToJs", () => {
  it("should create a valid JS object from CSS colors file", async () => {
    // I don't know why I couldn't import it, so i use `readFile` instead.
    //
    // FIXME - Importing raw CSS file is different from what Vite returns with
    // `?inline` after processing. The difference is manually tested and
    // supported in `cssColorsToJs`, but won't be caught by this test.
    const cssFile = (
      await readFile(
        resolve(import.meta.dirname, "./../../src/styles/colors.css"),
      )
    ).toString();
    const colors = cssColorsToJs(cssFile);
    expect(colors["--color-sky-500"]).toBe("#24a5ff");
    expect(colors["--color-night-600"]).toBe("#08121a");
  });
});

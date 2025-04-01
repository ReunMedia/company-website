import { describe, expect, test } from "vitest";
import { markdownToHtml } from "../../src/utils/markdownToHtml.ts";

describe("Process headings", () => {
  test("Normalize headings", async () => {
    const md = `
# Heading 1a
## Heading 2a
## Heading 2b
### Heading 3
# Heading 1b
`;

    let result = await markdownToHtml(md);

    expect(result).toContain("Heading 1a</h1>");
    expect(result).toContain("Heading 2a</h2>");
    expect(result).toContain("Heading 2b</h2>");
    expect(result).toContain("Heading 3</h3>");
    expect(result).toContain("Heading 1b</h1>");

    result = await markdownToHtml(md, true, 2);

    expect(result).toContain("Heading 1a</h2>");
    expect(result).toContain("Heading 2a</h3>");
    expect(result).toContain("Heading 2b</h3>");
    expect(result).toContain("Heading 3</h4>");
    expect(result).toContain("Heading 1b</h2>");

    result = await markdownToHtml(md, true, 3);

    expect(result).toContain("Heading 1a</h3>");
    expect(result).toContain("Heading 2a</h4>");
    expect(result).toContain("Heading 2b</h4>");
    expect(result).toContain("Heading 3</h5>");
    expect(result).toContain("Heading 1b</h3>");
  });
});

import rehypeRaw from "rehype-raw";
import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import remarkSmartypants from "remark-smartypants";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype, {
  type Options as RemarkRehypeOptions,
} from "remark-rehype";
import rehypeHeadingsNormalize from "rehype-headings-normalize";
import { unified } from "unified";
import { sanitizeHtml } from "./sanitizeHtml";

const rootProcessor = unified()
  .use(remarkParse) // Base Markdown parser
  // Astro includes `remark-gfm` and `remark-smartypants` by default so we
  // include them to mimick that.
  .use(remarkGfm)
  .use(remarkSmartypants)
  .use(remarkRehype, { allowDangerousHtml: true } satisfies RemarkRehypeOptions)
  .use(rehypeSlug) // Add IDs to headings
  .use(rehypeRaw)
  // Code block syntax highlight
  .use(rehypeShiki, {
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    colorReplacements: {
      "github-light": {
        "#fff": "var(--color-theme-background-highlight)",
      },
      "github-dark": {
        "#24292e": "var(--color-theme-background-card)",
      },
    },
  } satisfies RehypeShikiOptions)
  .use(rehypeStringify);
/**
 * Converts markdown to sanitized HTML.
 *
 * @param markdown Markdown content
 * @param sanitize Sanitize HTML using sanitize-html
 * @returns HTML content
 */
export async function markdownToHtml(
  markdown: string,
  sanitize = true,
  minimumHeadingLevel = 1,
): Promise<string> {
  // Create a new unfrozen processor so we can dynamically add plugins.
  const processor = rootProcessor();

  // Dynamically add heading normalization plugin
  processor.use(rehypeHeadingsNormalize, { minimumLevel: minimumHeadingLevel });

  const unsafeHtml = String(await processor.process(markdown));

  // We use `sanitize-html` instead of `rehype-sanitize` because it allows us to
  // use `iframe`s more easily. Allowing `iframe` in `rehype-sanitize` works,
  // but only allows the `iframe` tag itself and none of its content. Allowing
  // content would probably need way more complex rules.
  const sanitizedHtml = sanitize ? sanitizeHtml(unsafeHtml) : unsafeHtml;
  return sanitizedHtml;
}

import { html } from "@reunmedia/astro-og-images";
import bgImage from "../assets/og-image-bg-01.jpg?url&inline";
import logomarkSvg from "../assets/reun-logomark-01.svg?url&inline";
import logomarkSvgMeta from "../assets/reun-logomark-01.svg";
import colorsCss from "../styles/colors.css?inline";
import { cssColorsToJs } from "../utils/cssColorsToJs";
import type { Compiler } from "@reunmedia/astro-og-images";

interface Options {
  title: string;
  description: string;
}

const colors = cssColorsToJs(colorsCss);

export default function getTemplate({
  title,
  description,
}: Options): ReturnType<typeof html>;
export default function getTemplate<T>(
  { title, description }: Options,
  compiler: Compiler<T>,
): T;
export default function getTemplate<T>(
  { title, description }: Options,
  compiler?: Compiler<T>,
) {
  return (compiler || html)/* html */ `
    <div
      style=${{
        position: "relative",
        backgroundColor: colors["--color-clouds-500"],
        width: "100%",
        height: "100%",
        display: "flex",
        fontSize: 16,
        overflow: "hidden",
        padding: "4.5em",
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div
        style=${{
          display: "flex",
          position: "relative",
          width: "100%",
          flexDirection: "column",
        }}
        >
        <div
        style=${{
          display: "flex",
          flex: 1,
          width: "100%",
          gap: "4em",
        }}
        >
          <h2
            style=${{
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: "4.5em",
              margin: 0,
              color: colors["--color-sky-500"],
              flex: 1,
              display: "flex",
              alignItems: "center",
              lineHeight: "1em",
              wordBreak: "break-word",
            }}
          >
            ${title}
          </h2>
            <img
              width=${logomarkSvgMeta.width / 2}
              height=${logomarkSvgMeta.height / 2}
              style=${{ objectFit: "contain" }}
              src=${logomarkSvg}
            />

        </div>
        <div style=${{ display: "flex", flex: 1, alignItems: "center" }}>
          <p
            style=${{
              margin: 0,
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: "2.5em",
              flex: 1,
              color: colors["--color-slate-900"],
              wordBreak: "break-word",
            }}
          >
            ${description}
          </p>
        </div>
      </div>
    </div>
  `;
}

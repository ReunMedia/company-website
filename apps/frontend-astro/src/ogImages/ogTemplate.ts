import { html } from "@reunmedia/astro-og-images";
import bgImage from "../assets/og-image-bg-01.jpg?url&inline";
import bgImageMeta from "../assets/og-image-bg-01.jpg";
import logomarkSvg from "../assets/reun-logomark-01.svg?url&inline";
import logomarkSvgMeta from "../assets/reun-logomark-01.svg";
import colorsCss from "../styles/colors.css?inline";
import { cssColorsToJs } from "../utils/cssColorsToJs";

interface Options {
  title: string;
  description: string;
}

const colors = cssColorsToJs(colorsCss);

export default function getTemplate({ title, description }: Options) {
  return html`
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
      <img
        width=${bgImageMeta.width}
        height=${bgImageMeta.height}
        style=${{
          position: "absolute",
          /*
            You must specify position here to make html preview and satori
            consistent. use 0 for both values and translate to move. using
            percentages in position is inconsistent between html and rendered
            satori image.
          */
          left: 0,
          top: 0,
          // transform: "translate(57%, -43%)",
          display: "none",
        }}
        src=${bgImage}
      />

      <div
        style=${{
          display: "flex",
          position: "relative",
          width: "100%",
          gap: "4.5em",
        }}
      >
        <div
          style=${{
            display: "flex",
            flex: 1,
            width: "100%",
            flexDirection: "column",
          }}
        >
          <h2
            style=${{
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: "5em",
              margin: 0,
              color: colors["--color-sky-500"],
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            ${title}
          </h2>
          <p
            style=${{
              margin: 0,
              fontFamily: "Inter",
              fontWeight: 500,
              fontSize: "3em",
              flex: 1,
              color: colors["--color-slate-900"],
            }}
          >
            ${description}
          </p>
        </div>
        <div style=${{ display: "flex" }}>
          <img
            width=${logomarkSvgMeta.width}
            height=${logomarkSvgMeta.height}
            style=${{ height: "50%", objectFit: "contain" }}
            src=${logomarkSvg}
          />
        </div>
      </div>
    </div>
  `;
}

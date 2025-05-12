import type { AstroIntegration } from "astro";

const createPlugin = (): AstroIntegration => {
  return {
    name: "ogimages",
    hooks: {
      "astro:config:setup": ({ logger, command, injectRoute }) => {
        if (command === "dev") {
          logger.debug(
            "Running in dev server. Injecting OG HTML preview route at `/og-preview/`.",
          );
          injectRoute({
            pattern: "/dev/og-preview/",
            entrypoint: "./src/pages/_dev/og-preview.astro",
          });
        }
      },
    },
  };
};

export default createPlugin;

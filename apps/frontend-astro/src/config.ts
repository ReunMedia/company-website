import type { AstroUserConfig } from "astro";

// !!!!!!!!!!!!!!!!!!!!
// !! IMPORTANT NOTE !!
// !!!!!!!!!!!!!!!!!!!!
//
// Avoid defining sensitive data in this configuration as it is imported in the
// application code. Use env variables or `astro.config.ts` instead.

type Config = AstroUserConfig & {
  i18n: {
    locales: {
      /**
       * Human-readable name of this locale.
       *
       * This is a custom property ignored by Astro
       */
      name: string;
    }[];
  };
};

// https://astro.build/config
export default {
  site: "https://reun.eu",
  i18n: {
    locales: [
      {
        path: "en",
        // Prioritize ISO code, since that's what is used in Directus. Using
        // `Astro.currentLocale` will return `en-US`
        codes: ["en-US", "en"],
        name: "English",
      },
      {
        path: "fi",
        codes: ["fi-FI", "fi"],
        name: "Suomi",
      },
    ],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
      // Use custom redirect in `index.astro`
      redirectToDefaultLocale: false,
    },
  },
  trailingSlash: "always",
} satisfies Config;

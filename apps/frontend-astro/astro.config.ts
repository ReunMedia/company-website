import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import vue from "@astrojs/vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import ogImages from "@reunmedia/astro-og-images";
import appIntegration from "./src/integrations/appIntegration";
import { readFile } from "fs/promises";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: env.PUBLIC_ASTRO_SITE || "https://reun.eu",
  i18n: {
    locales: [
      {
        path: "en",
        // Prioritize ISO code, since that's what is used in Directus. Using
        // `Astro.currentLocale` will return `en-US`
        codes: ["en-US", "en"],
      },
      {
        path: "fi",
        codes: ["fi-FI", "fi"],
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
  vite: {
    plugins: [
      tailwindcss(),
      VueI18nPlugin({
        ssr: true,
      }),
    ],
  },
  integrations: [
    icon(),
    vue({
      appEntrypoint: "/src/pages/_app",
    }),
    ogImages({
      fonts: [
        {
          name: "Inter",
          weight: 500,
          // Unfortunately we need to have a fixed-width version as an
          // additional dependency because Satori doesn't support variable fonts
          data: await readFile(
            "./node_modules/@fontsource/inter/files/inter-latin-500-normal.woff",
          ),
        },
        {
          name: "Poppins",
          data: await readFile(
            "./node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff",
          ),
        },
      ],
    }),
    appIntegration(),
  ],
});

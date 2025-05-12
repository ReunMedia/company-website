import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import vue from "@astrojs/vue";
import config from "./src/config";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import ogImages from "@reunmedia/astro-og-images";
import appIntegration from "./src/integrations/appIntegration";
import { readFile } from "fs/promises";

// NOTE - `src/config.ts` is used to configure settings that need to be
// referenced in the code because `astro.config.ts` cannot be imported.

// https://astro.build/config
export default defineConfig({
  site: config.site,
  i18n: config.i18n,
  trailingSlash: config.trailingSlash,
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

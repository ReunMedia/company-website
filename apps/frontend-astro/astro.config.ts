import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import vue from "@astrojs/vue";
import config from "./src/config";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

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
  ],
});

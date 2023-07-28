/**
 * Vue app entrypoint.
 *
 * @see https://docs.astro.build/en/guides/integrations-guide/vue/#appentrypoint
 */

import type { App } from "vue";
import { createI18n } from "vue-i18n";
import urql from "@urql/vue";
import { client } from "../graphql/urql";

export default (app: App) => {
  // https://vue-i18n.intlify.dev/guide/installation.html
  // https://vue-i18n.intlify.dev/guide/advanced/composition.html
  const i18n = createI18n({
    legacy: false,
  });
  app.use(i18n);
  app.use(urql, client);
};

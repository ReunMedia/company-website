// See `.env.example` for more information on ENV variables.

interface ImportMetaEnv {
  readonly PUBLIC_DIRECTUS_URL: string;
  readonly PUBLIC_ASTRO_SITE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

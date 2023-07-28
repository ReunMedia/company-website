import type { CodegenConfig } from "@graphql-codegen/cli";
import "dotenv/config";

const config: CodegenConfig = {
  // In development we fetch introspected schema from Directus container. This
  // schema is saved to `./src/graphql/schema.graphql` by `schema-ast` plugin
  // and stored to Git. In production (detected by `NODE_ENV` set in
  // `Dockerfile`) we use local schema instead because GraphQL introspection is
  // disabled in production.
  schema:
    process.env.NODE_ENV === "production"
      ? "./src/graphql/schema.graphql"
      : `${process.env.PUBLIC_DIRECTUS_URL}/graphql`,
  documents: [
    "src/components/**/*.{astro,ts,vue}",
    "src/composables/**/*.ts",
    "src/layouts/**/*.astro",
    "src/pages/**/*.astro",
  ],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/graphql/schema.graphql": {
      plugins: ["schema-ast"],
    },
    "./src/graphql/generated/": {
      preset: "client",
      config: {
        useTypeImports: true,
        scalars: {
          JSON: "../../types/graphql-scalars#JSON",
        },
      },
      plugins: [],
    },
  },
};

export default config;

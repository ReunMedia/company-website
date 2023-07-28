import codegenConfig from "./apps/frontend-astro/codegen";

const toArray = <T>(x: T): T[] => (x instanceof Array ? x : [x]);

export default {
  projects: {
    "frontend-astro": {
      schema: "apps/frontend-astro/src/graphql/schema.graphql",
      // Fetch documents from GraphQL codegen config.
      documents: toArray(codegenConfig.documents).map(
        (x) => `./apps/frontend-astro/${x}`
      ),
    },
  },
};

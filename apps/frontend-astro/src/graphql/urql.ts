import { Client, /*cacheExchange,*/ fetchExchange } from "@urql/core";

export const client = new Client({
  url: `${import.meta.env.PUBLIC_DIRECTUS_URL}/graphql`,
  // Cache is disabled because GraphQL queries are run during build and should
  // return fresh data.
  exchanges: [/*cacheExchange,*/ fetchExchange],
});

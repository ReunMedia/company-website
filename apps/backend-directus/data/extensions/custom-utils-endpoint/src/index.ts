import { defineEndpoint } from "@directus/extensions-sdk";

export default defineEndpoint((router) => {
  router.get("/time", (_req, res) => res.send(Date.now().toString()));
});

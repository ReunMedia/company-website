module.exports = {
  directusUrl: "http://0.0.0.0:8055",
  directusToken: process.env.ADMIN_TOKEN,
  // Don't include specs, since we use GraphQL introspection and the backend
  // needs to be up anyway for the frontend to build.
  specs: false,
};

module.exports = {
  directusUrl: "http://0.0.0.0:8055",
  // directusToken: "my-directus-token",
  directusEmail: "admin@example.com",
  directusPassword: "admin123",
  // Don't include specs, since we use GraphQL introspection and the backend
  // needs to be up anyway for the frontend to build.
  specs: false,
};

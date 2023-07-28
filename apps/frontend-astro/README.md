# Reun Media Company Website Frontend

## Development

> [!NOTE]
>
> Backend Directus container must be running during frontend development. See
> [apps/backend-directus/README](../backend-directus/README.md) for more.

Install dependencies:

```sh
pnpm install
```

Frontend uses GraphQL Codegen for GraphQL. It is recommended to run it in watch
mode during development. You can start both GraphQL Codegen and Astro dev server
with following command:

```sh
pnpm codegen:watch & pnpm dev
```

## Building and deployment

Deploy `apps/frontend-nuxt/docker-compose.yaml` to Coolify (or another
service supporting Docker Compose).

### Testing production build

There's a separate `docker-compose.test.yaml` that can be used to test
production build locally.

> [!NOTE]
>
> Make sure you set up local `.env` file before testing.

```sh
docker compose -f docker-compose.yaml -f docker-compose.test.yaml --env-file .env up -d --build
```

> [!TIP]
>
> We're using `docker-compose.yaml` instead of just `Dockerfile` so that we can
> define `ENV` variables that are automatically shown in Coolify UI as well as
> include a separate `docker-compose.test.yaml` that can be used to test the
> image locally.

## Additional info

### Packages used

Most of the packages used are self-explanatory, but here's a list of some that
might not be so obvious.

| Package                      | Usage                                         |
| ---------------------------- | --------------------------------------------- |
| `@braintree/sanitize-url`    | Footer dynamic link href sanitization         |
| `@eslint/compat`             | Adding `.gitignore` to `eslint.config`        |
| `@iconify-json/simple-icons` | Footer dynamic social media icons             |
| `@parcel/watcher`            | Required by GraphQL Codegen CLI watch mode    |
| `@vee-validate/zod`          | `zod` is used instead of `yup` to match Astro |
| `concurrently`               | Running `lint` scripts concurrently           |
| `esbuild`                    | Processing `scripts/setInitialTheme.ts`       |
| `pupa`                       | Footer dynamic link templating                |

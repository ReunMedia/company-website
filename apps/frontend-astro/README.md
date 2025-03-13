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

Setup frontend `.env` file:

```sh
cp .env.example .env
```

Start dev server:

```sh
pnpm dev
```

This starts both GraphQL Codegen and Astro dev server. Alternatively, you may
start them manually:

```sh
pnpm build:scripts
pnpm codegen:watch
pnpm astro dev
```

`build:scripts` runs esbuild to build `scripts/setInitialTheme.ts` and needs to
be run manually whenever that script is changed.

## Building and deployment

This app uses Docker Compose for deployment. See
[`docker-compose.yaml`](docker-compose.yaml) for a list of environment variables
that need to be configured and deploy to Coolify or another service supporting
Docker Compose.

### Testing production build

There's a separate `docker-compose.test.yaml` that can be used to test
production build locally.

```sh
pnpm docker:test
```

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

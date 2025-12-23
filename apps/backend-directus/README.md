# Directus Backend

## Start Directus development container

```sh
pnpm dev
```

This starts container in detached mode (background). You can safely ignore
warnings about env variables not being set as `docker-compose.dev.yaml`
overrides them.

Use `admin@example.com` as email and `admin123` as password to sign in.

> [!TIP]
>
> The development compose file includes a pre-configured
> [Mailpit](https://mailpit.axllent.org/) container for testing form submission
> notification emails.

## Saving / loading Directus schema with Directus Sync

[Directus Sync](https://tractr.github.io/directus-sync/) is used for schema
management. Run the following command to save schema snapshot from a running
developemnt container:

```sh
pnpm snapshot
```

This saves the sync schema to `data/directus-config`. The schema can then be
committed to version control and it is automatically applied when the container
is started.

### Updating Directus Sync

`directus-extension-sync` is installed in `directus-extensions/package.json`.

`directus-sync` is installed in `Dockerfile`.

## Running tests

> [!NOTE]
>
> Directus instance must be running in order to run tests and some tests persist
> data to database.

```sh
pnpm test
```

## Building and deployment

This app uses Docker Compose for deployment. See
[`docker-compose.yaml`](docker-compose.yaml) for a list of environment variables
that need to be configured and deploy to Coolify or another service supporting
Docker Compose.

## Troubleshooting

### Directus cannot create (open) database in dev environment

This _might_ be due to user / permission mismatch between host and Directus
container that makes Directus unable to write to mounted volumes. Directus
container expects your `u:g` to be `1000:1000`.

**Easy solution is to not use mounted volumes** by creating
`_docker-compose.dev2.yml` (the `_` prefix ensures it is not committed) and
overriding `volumes` configuration for `backend-directus`. If you still insist
on making Directus write files inside `apps/backend-directus/data`, here are
two links to take you down the rabbit hole:

- https://github.com/directus/directus/discussions/15986
- https://jtreminio.com/blog/running-docker-containers-as-current-host-user/

Good luck!

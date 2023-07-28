# Directus backend

## Start Directus development container

```sh
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build
```

> [!NOTE]
>
> You can safely ignore warnings about env variables not being set.

## Saving / loading Directus schema

```sh
pnpm snapshot
```

This saves the sync schema to `data/directus-config`. You can alternatively run
`npx directus-sync pull` in the container. 

The schema is automatically applied when the container is started, but you can
also apply it manually by running `npx directus-sync push` in the container.

## Running tests

```sh
pnpm test
```

> [!NOTE]
>
> Directus instance must be running in order to run tests and some tests persist
> data to database.

## Building and deployment

Deploy `apps/backend-directus/docker-compose.yaml` to Coolify (or another
service supporting Docker Compose).

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

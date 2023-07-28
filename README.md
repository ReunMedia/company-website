# Reun Media Company Website

## Development

Following tools are required for development and need to be installed first:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)

Start Directus backend container:

```sh
cd apps/backend-directus
docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build
```

Install frontend dependencies:

```sh
cd apps/frontend-astro
pnpm install
```

Start frontend dev server:

```sh
pnpm codegen:watch & pnpm dev
```

See README in [backend-directus](apps/backend-directus/README.md) and
[frontend-astro](apps/frontend-astro/README.md) for more info.

## Building and deployment

The project is deployed as separate Docker Compose stacks. See the deployment
docs for
[backend-directus](apps/backend-directus/README.md#building-and-deployment) and
[frontend-astro](apps/frontend-astro/README.md#building-and-deployment)
respectively.

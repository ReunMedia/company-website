# Reun Media Company Website

## Development

Following tools are required for development and need to be installed first:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/installation)

Clone the repository:

```sh
git clone git@github.com:Reun-Media/company-website.git
cd company-website
```

Install frontend dependencies:

```sh
cd apps/frontend-astro
pnpm install
```

Setup frontend `.env` file:

```sh
cp .env.example .env
```

Start Directus backend container:

```sh
cd ../backend-directus
pnpm dev
```

Use `admin@example.com` as email and `admin123` as password to sign in to
Directus.

Start frontend dev server:

```sh
cd ../frontend-astro
pnpm dev
```

See README in [backend-directus](apps/backend-directus/README.md) and
[frontend-astro](apps/frontend-astro/README.md) for more info.

## Building and deployment

The project is deployed as separate Docker Compose stacks. See the deployment
docs for
[backend-directus](apps/backend-directus/README.md#building-and-deployment) and
[frontend-astro](apps/frontend-astro/README.md#building-and-deployment)
respectively.

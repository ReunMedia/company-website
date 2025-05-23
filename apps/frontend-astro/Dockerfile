# Node 22 is LTS at the time of writing. Using slim image to avoid probelms with
# alpine. The download is cached anyway.
FROM node:22-slim AS base

FROM base AS builder-base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"
RUN corepack enable
COPY package.json pnpm-lock.yaml /app/
WORKDIR /app

FROM builder-base AS dependencies-production
# - Use cache mount to speed up `pnpm`
#   - See: https://docs.docker.com/build/guide/mounts/
# - Use `--frozen-lockfile` to ensure consistent dependencies (CI)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM dependencies-production AS build-production
# Define ENV variables used during build
ARG PUBLIC_DIRECTUS_URL
ARG PUBLIC_ASTRO_SITE
# Copy app source files and build
COPY astro.config.ts codegen.ts tsconfig.json /app/
COPY public /app/public
COPY src /app/src
# Manually invalidate cache for build command to force fetching latest data from
# Directus even if nothing in frontend code was changed.
# See: https://docs.docker.com/build/cache/invalidation/
# See: https://github.com/moby/moby/issues/1996
ADD ${PUBLIC_DIRECTUS_URL}/custom-utils-endpoint/time build_time
RUN pnpm run build

FROM p3terx/darkhttpd:1.16 AS app
COPY --from=build-production /app/dist /app
EXPOSE 80
ENTRYPOINT [ "/darkhttpd", "/app", "--no-listing" ]

# Install Directus Sync
# See: https://tractr.github.io/directus-sync/docs/getting-started/installation#option-3-custom-docker-image
FROM node:22-alpine AS directus-extensions
RUN apk add python3 g++ make
WORKDIR /extensions
ADD directus-extensions .

# We're using `npm` instead of `pnpm` to make it easier to copy the extensions
# from `node_modules` directory.
RUN npm install

# Move all extensions the starts with directus-extension-, using find, to the
# /extensions/directus folder
RUN mkdir -p ./directus
RUN cd node_modules && find . -maxdepth 1 -type d -name "directus-extension-*" -exec mv {} ../directus \;

# Build custom extensions
FROM node:22-slim AS directus-custom-extensions
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV="production"
RUN corepack enable
WORKDIR /directus/extensions/custom-utils-endpoint
COPY data/extensions/custom-utils-endpoint/package.json \
  data/extensions/custom-utils-endpoint/pnpm-lock.yaml \
  ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY data/extensions/custom-utils-endpoint/src ./src
RUN pnpm build

FROM directus/directus:11.5.1

# Copy Directus Sync
COPY --from=directus-extensions /extensions/directus /directus/extensions
COPY directus-sync.config.cjs /directus
COPY directus-config /directus/directus-config

# Install Directus Sync CLI. This makes it so that when we run `npx
# directus-sync`, the package already exists. We need to use `pnpm` to install
# it, because that's what's apparently used in the Directus container.
#
# In the entrypoint we use `npx` instead of `pnpm dlx` to avoid downlading the
# package again.
RUN cd /directus && pnpm install directus-sync@3.2.3

# Copy custom extensions
COPY --from=directus-custom-extensions \
  /directus/extensions/custom-utils-endpoint/package.json \
  /directus/extensions/custom-utils-endpoint/
COPY --from=directus-custom-extensions \
  /directus/extensions/custom-utils-endpoint/dist \
  /directus/extensions/custom-utils-endpoint/dist/

# Use custom entrypoint that runs Directus Sync after Directus has started
COPY --chmod=755 docker/entrypoint.sh /directus/docker/entrypoint.sh
ENTRYPOINT [ "/directus/docker/entrypoint.sh" ]

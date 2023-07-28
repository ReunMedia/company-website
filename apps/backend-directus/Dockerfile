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

FROM directus/directus:11.5.1

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

# Use custom entrypoint that runs Directus Sync after Directus has started
COPY --chmod=755 docker/entrypoint.sh /directus/docker/entrypoint.sh
ENTRYPOINT [ "/directus/docker/entrypoint.sh" ]

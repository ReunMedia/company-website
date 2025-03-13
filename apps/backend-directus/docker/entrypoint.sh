#!/bin/sh

# Custom Directus Docker entrypoint that runs Directus Sync for schema migration
# and data seeding.

directusSync() {
  echo "Waiting for Directus to start..."
  # 2>&1 suppresses repeated error when the server is not yet up
  until [ "$(wget -qO- http://0.0.0.0:8055/server/health 2>&1)" = '{"status":"ok"}' ]
  do
    sleep 1
  done

  echo "Directus is up"
  cd /directus || exit

  # Even though `directus-sync` is installed with `pnpm` in `Dockerfile`, we use
  # `npx` instead of `pnpm dlx` to avoid downloading the package again.
  echo "Running Directus Sync"
  npx directus-sync push

  echo "Applying seed data"
  npx directus-sync seed push
}

# Start in the background
directusSync &

# Run original command
# https://hub.docker.com/layers/directus/directus/10.8.3/images/sha256-caa9882cab15b283c16e5342a28f2ec33d4e00885e9206c107a592ce44d3b715
: && node cli.js bootstrap && pm2-runtime start ecosystem.config.cjs;

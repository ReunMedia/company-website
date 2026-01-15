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

## Data backup / restore

### Backup

```sh
./tools/backup-data.sh backup john@example.com container-id /directus/database /directus/uploads
```

### Restore

```sh
./tools/backup-data.sh restore john@example.com container-id backup-archive.tar.gz
```

## Troubleshooting

### Directus cannot create (open) database in dev environment

This is be due to user / permission mismatch between host and Directus container
that makes Directus unable to write to mounted volumes.

Here's how to fix this:

1. Temporarily allow container to write database file

```sh
chmod 777 data/database/
```

2. Run `pnpm dev` and wait for container to start
3. Check the user ID of `data/database/data.db` file created by container. It's
   most likely `100999`.

```sh
stat -c '%u' data/database/data.db
```

4. Create ACL rules that grant both host and container access to files inside
   data directory. Replace `100999` with the user ID of the container user.

```sh
sudo setfacl -Rm u:$(id -u):rw,u:100999:rwx data/
sudo setfacl -Rdm u:$(id -u):rw,u:100999:rwx data/
```

5. Revert temporary permissions set in step 1

```sh
sudo chmod 775 data/database/
```

6. Restart the container with `pnpm dev`

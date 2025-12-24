#!/bin/bash

whos=$(basename "$0")

_help() {
  cat <<EOF
Usage: $whos command [options] [arguments]

Commands:
  backup <ssh-connection> <container-id> <file...>
    Downloads files or directories from a remote container.

  restore <ssh-connection> <container-id> <backup-archive>
    Restores a backup archive to a remote container.

Examples:
  backup-data.sh backup john@example.com eebc94948f13 /data/uploads /data/database.sqlite
  backup-data.sh restore john@example.com eebc94948f13 eebc94948f13_2025-12-24_14-52-16.tar.gz

Notes:
  Use 'hostname' inside container to get ID of the container
EOF
  exit
}

_backup() {
  # Arguments
  SSH_CONNECTION=$1
  CONTAINER_ID=$2
  FILES_TO_BACKUP=("${@:3}")

  # Validate arguments
  if [ "$#" -lt 3 ]; then
    echo "You must pass SSH connection, container ID and file arguments"
    exit 2
  fi

  ARCHIVE_FILENAME="${CONTAINER_ID}_$(date +%F_%H-%M-%S).tar.gz"
  ARCHIVE_FULL_PATH="/tmp/${ARCHIVE_FILENAME}"

  REMOTE_COMMANDS=$(
    base64 -w0 <<EOF
    echo "Creating backup archive inside container"
    sudo docker exec ${CONTAINER_ID} sh -c " \
      tar -czvf /tmp/${ARCHIVE_FILENAME} ${FILES_TO_BACKUP[@]}
    "

    echo "Copying backup archive from container to host"
    sudo docker cp '${CONTAINER_ID}:${ARCHIVE_FULL_PATH}' ${ARCHIVE_FULL_PATH}
    sudo chown \${USER}:\${USER} ${ARCHIVE_FULL_PATH}

    echo "Removing backup archive from container"
    sudo docker exec ${CONTAINER_ID} sh -c " \
      rm ${ARCHIVE_FULL_PATH}
    "
EOF
  )

  # Run commands on remote
  ssh -t "${SSH_CONNECTION}" "echo ${REMOTE_COMMANDS} | base64 -d | bash"

  echo "Downloading backup archive from remote host to local machine"
  scp "${SSH_CONNECTION}:${ARCHIVE_FULL_PATH}" "${ARCHIVE_FILENAME}"

  echo "Removing backup archive from remote host"
  ssh -t "${SSH_CONNECTION}" "rm ${ARCHIVE_FULL_PATH}"
}

_restore() {
  SSH_CONNECTION=$1
  CONTAINER_ID=$2
  BACKUP_ARCHIVE=${3}

  # Validate arguments
  if [ "$#" -lt 3 ]; then
    echo "You must pass SSH connection, container ID and backup archive arguments"
    exit 2
  fi

  if [ ! -f "$BACKUP_ARCHIVE" ]; then
    echo "Backup file ${BACKUP_ARCHIVE} not found"
    exit 2
  fi

  ARCHIVE_FILENAME=$(basename "${BACKUP_ARCHIVE}")
  ARCHIVE_FULL_PATH="/tmp/${ARCHIVE_FILENAME}"

  echo "Uploading local backup archive to remote host"
  scp "${BACKUP_ARCHIVE}" "${SSH_CONNECTION}:${ARCHIVE_FULL_PATH}"

  REMOTE_COMMANDS=$(
    base64 -w0 <<EOF
    echo "Copying backup archive from host to container"
    sudo docker cp -a ${ARCHIVE_FULL_PATH} ${CONTAINER_ID}:${ARCHIVE_FULL_PATH}

    echo "Extracting backup archive inside container"
    sudo docker exec ${CONTAINER_ID} sh -c " \
      tar -xvf ${ARCHIVE_FULL_PATH} -C / \
      && echo 'Removing backup archive from container' \
      && rm ${ARCHIVE_FULL_PATH} \
    "

    echo "Removing backup archive from remote host"
    rm ${ARCHIVE_FULL_PATH}
EOF
  )

  # Run commands on remote
  ssh -t "${SSH_CONNECTION}" "echo ${REMOTE_COMMANDS} | base64 -d | bash"
}

subcommand=$1
case $subcommand in
"" | "-h" | "--help")
  _help
  ;;
*)
  shift
  _"${subcommand}" "$@"
  if [ $? = 127 ]; then
    echo "Error: '$subcommand' is not a known subcommand." >&2
    echo "       Run '$whos --help' for a list of known subcommands." >&2
    exit 1
  fi
  ;;
esac

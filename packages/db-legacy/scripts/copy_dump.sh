#!/bin/bash

source ../.env

echo "$REMOTE_HOST"

if ! DUMP_FILE=$(ssh "$REMOTE_HOST" '$HOME/db_dump.sh'); then
  echo "Error: Failed to execute db_dump.sh on $REMOTE_HOST"
  exit 1
fi

echo "DB dump created at: ${DUMP_FILE}"
echo "Copying dump file from $REMOTE_HOST:${DUMP_FILE} to local machine..."

scp "$REMOTE_HOST:${DUMP_FILE}" "$DATA_PATH"/dump.sql

#!/bin/bash

source ../.env

echo "$REMOTE_HOST"

DUMP_FILE=$(ssh "$REMOTE_HOST" "~/db_dump.sh")

if [ $? -ne 0 ]; then
  echo "Error: Failed to execute db_dump.sh on $REMOTE_HOST"
  exit 1
fi

echo "DB dump created at: ${DUMP_FILE}"
echo "Copying dump file from $REMOTE_HOST:${DUMP_FILE} to local machine..."

scp "$REMOTE_HOST:${DUMP_FILE}" dump.sql

#!/bin/bash

source ../.env

if [[ -z "$REMOTE_HOST" || -z "$REMOTE_FILES_PATH" || -z "$COPY_TO_PATH" ]]; then
  echo "Required variables are not set: HOST, REMOTE_FILES_PATH, COPY_TO_PATH"
  exit 1
fi

rm -rf "${COPY_TO_PATH:?}/*"

echo "$REMOTE_HOST:$REMOTE_FILES_PATH => $COPY_TO_PATH"

# Find and exclude files larger than 1GB
ssh "$REMOTE_HOST" "cd \"$REMOTE_FILES_PATH\" && find . -type f -size +1G" > ignored
rsync -az --info=progress2 --max-size=1G "$REMOTE_HOST:$REMOTE_FILES_PATH/" "$COPY_TO_PATH/"

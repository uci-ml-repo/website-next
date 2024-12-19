#!/bin/bash

source ../.env

if [[ -z "$HOST" || -z "$STATIC_FILES_PATH" || -z "$COPY_TO_PATH" ]]; then
  echo "Required variables are not set: HOST, STATIC_FILES_PATH, COPY_TO_PATH"
  exit 1
fi

rm -rf "${COPY_TO_PATH:?}/*"

echo "$HOST:$STATIC_FILES_PATH => $COPY_TO_PATH"

# Find and exclude files larger than 512MB
ssh "$HOST" "find \"$STATIC_FILES_PATH\" -type f -size +512M" > ignored
rsync -az --info=progress2 --exclude-from=ignored "$HOST:$STATIC_FILES_PATH/" "$COPY_TO_PATH/"
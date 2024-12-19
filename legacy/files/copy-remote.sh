#!/bin/bash

source ../.env

if [[ -z "$HOST" || -z "$STATIC_FILES_PATH" ]]; then
  exit 1
fi

rm -rf ./static/*

echo "$HOST:$STATIC_FILES_PATH"

ssh "$HOST" "find \"$STATIC_FILES_PATH\" -type f -size +512M" > ignored
rsync -az --info=progress2 --exclude-from=ignored "$HOST:$STATIC_FILES_PATH/" ./static
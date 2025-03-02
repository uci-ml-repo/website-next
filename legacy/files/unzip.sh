#!/bin/bash
source ../.env

MAX_SIZE=104857600

find "$COPY_TO_PATH" -type f -name '*.zip' | while read -r file; do
  [ "$(stat -c%s "$file")" -lt $MAX_SIZE ] && {
    target="$(dirname "$file")/$(basename "$file" .zip)"
    mkdir -p "$target"
    unzip "$file" -d "$target"
  }
done

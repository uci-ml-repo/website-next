#!/bin/bash

source ../.env

MAX_SIZE=104857600

find "$COPY_TO_PATH" -type f -name '*.zip' | while read -r file; do
  size=$(stat -c%s "$file")
  if [ "$size" -lt "$MAX_SIZE" ]; then
    unzip "$file" -d "$(dirname "$file")"
  fi
done

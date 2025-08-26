#!/bin/bash

source ../.env

for item in "$COPY_TO_PATH"/*; do
  if [ -d "$item" ]; then
    jpg_file="$item/Thumbnails/Large.jpg"
    png_file="$item/Thumbnails/Large.png"
    if [[ -f "$jpg_file" && ! -f "$item/thumbnail.png" ]]; then
      convert "$jpg_file" "$png_file"
      cp "$png_file" "$item/thumbnail.png"
    fi
    rm -rf "$item/Thumbnails"
  fi
done

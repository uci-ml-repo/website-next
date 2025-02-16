#!/bin/bash

if ! command -v unzip > /dev/null 2>&1; then
  echo "Error: unzip is not installed."
  exit 1
fi

if ! command -v convert > /dev/null 2>&1; then
  echo "Error: imagemagick is not installed"
  exit 1
fi

source ../.env

echo "Formatting $COPY_TO_PATH"

cp -rf ./data/default "$COPY_TO_PATH"

for item in "$COPY_TO_PATH"/{public,private}/*; do
  if [ -d "$item" ]; then
    jpg_file="$item/Thumbnails/Large.jpg"
    png_file="$item/Thumbnails/Large.png"
    if [[ -f "$jpg_file" && ! -f "$item/thumbnail.png" ]]; then
      convert "$jpg_file" "$png_file"
      cp "$png_file" "$item/thumbnail.png"
    fi
    rm -rf "$item/Thumbnails"
  fi
  for zip_file in "$item"/*.zip; do
    if [ -f "$zip_file" ]; then
      folder_name=$(basename "$zip_file" .zip)
      unzip_folder="$item/$folder_name"
      if [ ! -d "$unzip_folder" ]; then
        unzip -o "$zip_file" -d "$unzip_folder"
      fi
    fi
  done
done

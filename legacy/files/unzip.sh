#!/bin/bash

source ../.env
source ../../.env

DATASETS=$(psql "$DATABASE_URL" -At -F"|" -c "SELECT id, slug FROM dataset WHERE status = 'approved' AND uncompressed_size < 100000000;") # 100 MB

while IFS="|" read -r dataset_id dataset_slug; do
  zip_file="$COPY_TO_PATH/public/$dataset_id/${dataset_slug}.zip"
  target_dir="$COPY_TO_PATH/public/$dataset_id/${dataset_slug}"

  if [ -f "$zip_file" ]; then
    echo "Unzipping $zip_file to $target_dir"
    mkdir -p "$target_dir"
    unzip -o "$zip_file" -d "$target_dir"
  else
    echo "Zip file not found: $zip_file"
  fi
done <<< "$DATASETS"

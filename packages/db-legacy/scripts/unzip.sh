#!/usr/bin/env bash

source ../.env

ROWS=$(psql "$DATABASE_URL" -F $'\t' -At -c "SELECT id, slug FROM dataset")

while IFS=$'\t' read -r dataset_id slug; do
  [[ -z "${dataset_id:-}" || -z "${slug:-}" ]] && continue

  ds_dir="${COPY_TO_PATH%/}/${dataset_id}"
  zip_path="${ds_dir}/${slug}.zip"
  dest_dir="${ds_dir}/${slug}"
  s3_dest="${S3_URI}/${dataset_id}/${slug}"

  if [[ ! -f "$zip_path" ]]; then
    echo "[$dataset_id] No zip found, skipping: ${zip_path}"
    continue
  fi

  echo "[$dataset_id] Found zip: ${zip_path}"

  # Clean any previous leftover unzipped folder (to avoid mixing versions)
  if [[ -d "$dest_dir" ]]; then
    echo "[$dataset_id] Removing pre-existing folder: ${dest_dir}"
    rm -rf -- "$dest_dir"
  fi

  echo "[$dataset_id] Unzipping to: ${dest_dir}"
  mkdir -p -- "$dest_dir"
  unzip -q -o -- "$zip_path" -d "$dest_dir"

  echo "[$dataset_id] Uploading to S3: ${s3_dest}/"
  aws s3 sync "$dest_dir/" "${s3_dest}/" --only-show-errors

  echo "[$dataset_id] Cleaning up local unzipped folder"
  rm -rf -- "$dest_dir"

  echo "[$dataset_id] Done."
  echo "----------------------------------------"
done <<< "$ROWS"

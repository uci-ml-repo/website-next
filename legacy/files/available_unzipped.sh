#!/bin/bash

source ../.env
source ../../.env

DATASETS=$(psql "$DATABASE_URL" -At -c "SELECT id, slug FROM dataset ")
UPDATE_VALUES=""

while IFS='|' read -r dataset_id dataset_slug; do
  public_unzip="$COPY_TO_PATH/public/$dataset_id/$dataset_slug"
  private_unzip="$COPY_TO_PATH/private/$dataset_id/$dataset_slug"

  if [ -d "$public_unzip" ] || [ -d "$private_unzip" ]; then
    is_unzipped=true
  else
    is_unzipped=false
  fi

  if [ -z "$UPDATE_VALUES" ]; then
    UPDATE_VALUES="($dataset_id, $is_unzipped)"
  else
    UPDATE_VALUES="$UPDATE_VALUES, ($dataset_id, $is_unzipped)"
  fi
done <<< "$DATASETS"

psql "$DATABASE_URL" -c "UPDATE dataset AS d SET unzipped = v.unzipped FROM (VALUES $UPDATE_VALUES) AS v(id, unzipped) WHERE d.id = v.id AND d.file_count IS NOT NULL AND size IS NOT NULL;"

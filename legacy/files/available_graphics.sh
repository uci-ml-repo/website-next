#!/bin/bash

source ../.env
source ../../.env

DATASET_IDS=$(psql "$DATABASE_URL" -At -c "SELECT id FROM dataset ")
UPDATE_VALUES=""

while IFS= read -r dataset_id; do
  public_thumbnail="$COPY_TO_PATH/public/$dataset_id/thumbnail.png"
  private_thumbnail="$COPY_TO_PATH/private/$dataset_id/thumbnail.png"

  if [ -f "$public_thumbnail" ] || [ -f "$private_thumbnail" ]; then
    has_graphics=true
  else
    has_graphics=false
  fi

  if [ -z "$UPDATE_VALUES" ]; then
    UPDATE_VALUES="($dataset_id, $has_graphics)"
  else
    UPDATE_VALUES="$UPDATE_VALUES, ($dataset_id, $has_graphics)"
  fi
done <<< "$DATASET_IDS"

psql "$DATABASE_URL" -c "UPDATE dataset AS d SET has_graphics = v.has_graphics FROM (VALUES $UPDATE_VALUES) AS v(id, has_graphics) WHERE d.id = v.id;"

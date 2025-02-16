#!/bin/bash

source ../.env
source ../../.env

DATASET_IDS=$(psql "$DATABASE_URL" -At -c "SELECT id FROM dataset WHERE has_graphics = false;")

while IFS= read -r dataset_id; do
  public_thumbnail="$COPY_TO_PATH/public/$dataset_id/thumbnail.png"
  private_thumbnail="$COPY_TO_PATH/private/$dataset_id/thumbnail.png"

  if [ -f "$public_thumbnail" ] || [ -f "$private_thumbnail" ]; then
    psql "$DATABASE_URL" -c "UPDATE dataset SET has_graphics = true WHERE id = '$dataset_id';"
  fi
done <<< "$DATASET_IDS"

psql --dbname="$DATABASE_URL" -c "DO \$\$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT matviewname FROM pg_matviews WHERE schemaname = 'public') LOOP
        EXECUTE 'REFRESH MATERIALIZED VIEW public.' || quote_ident(r.matviewname);
    END LOOP;
END
\$\$;"

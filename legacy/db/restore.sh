#!/bin/bash

source ../../.env

pg_restore --dbname="$DATABASE_URL" --data-only ./output/out.dump

psql --dbname="$DATABASE_URL" -c "SELECT setval('dataset_id_seq', (SELECT MAX(id) FROM dataset));"

./../files/available_unzipped.sh
./../files/available_graphics.sh

psql --dbname="$DATABASE_URL" -c "SELECT refresh_dataset_view();"

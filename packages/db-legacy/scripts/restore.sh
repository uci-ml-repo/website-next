#!/bin/bash

source ../.env

# Truncate all tables
psql --dbname="$DATABASE_URL" -c "DO \$\$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END
\$\$;"

pg_restore --dbname="$DATABASE_URL" --data-only ./output/out.dump

psql --dbname="$DATABASE_URL" -c "SELECT setval('dataset_id_seq', (SELECT MAX(id) FROM dataset));"

./../files/available_graphics.sh

psql --dbname="$DATABASE_URL" -c "SELECT refresh_dataset_view();"

#!/bin/bash

source ../../.env

psql --dbname="$DATABASE_URL" -c "DO \$\$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END
\$\$;"

pg_restore --dbname="$DATABASE_URL" --data-only ./output/out.dump

psql --dbname="$DATABASE_URL" -c "DO \$\$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT matviewname FROM pg_matviews WHERE schemaname = 'public') LOOP
        EXECUTE 'REFRESH MATERIALIZED VIEW public.' || quote_ident(r.matviewname);
    END LOOP;
END
\$\$;"

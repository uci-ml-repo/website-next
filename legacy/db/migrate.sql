--  npx prisma migrate diff --from-empty --to-schema-datasource prisma/schema.prisma --script > prisma/generated.sql

-------------------------------------------------------------------------------
-- UTILS
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION base36_encode(num bigint)
    RETURNS text AS
$$
DECLARE
    base36 CONSTANT text   := '0123456789abcdefghijklmnopqrstuvwxyz';
    encoded         text   := '';
    remainder       int;
    digit           char(1);
    value           bigint := abs(num);
BEGIN
    IF num = 0 THEN
        RETURN '0';
    END IF;

    WHILE value > 0
        LOOP
            remainder := (value % 36);
            digit := substr(base36, remainder + 1, 1);
            encoded := digit || encoded;
            value := value / 36;
        END LOOP;

    RETURN encoded;
END;
$$
    LANGUAGE plpgsql
    IMMUTABLE;

CREATE SEQUENCE IF NOT EXISTS cuid_counter_seq
    START 1
    MINVALUE 1
    MAXVALUE 999999999999999999
    CYCLE;

CREATE OR REPLACE FUNCTION generate_cuid()
    RETURNS text AS
$$
DECLARE
    "current_time" bigint;
    time_block     text;
    counter_value  bigint;
    count_block    text;
    fingerprint    text;
    random_block   text;
    result_cuid    text;
BEGIN
    "current_time" := floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint;
    time_block := base36_encode("current_time");
    counter_value := nextval('cuid_counter_seq');
    count_block := lpad(base36_encode(counter_value), 4, '0');
    fingerprint := substring(md5(inet_server_addr()::text || inet_server_port()::text) for 4);
    random_block := substring(md5(random()::text || random()::text), 1, 6);
    result_cuid := 'c'
                       || time_block
                       || count_block
                       || fingerprint
        || random_block;

    RETURN result_cuid;
END;
$$
    LANGUAGE plpgsql;


ALTER TYPE users_role RENAME TO user_role;

CREATE TYPE "approval_status" AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE "dataset_subject_area" AS ENUM ('biology', 'business', 'climate_and_environment', 'computer_science', 'education', 'engineering', 'games', 'health_and_medicine', 'law', 'physics_and_chemistry', 'social_science', 'other');

CREATE TYPE "dataset_task" AS ENUM ('classification', 'regression', 'clustering');

CREATE TYPE "dataset_characteristic" AS ENUM ('tabular', 'sequential', 'multivariate', 'time_series', 'text', 'image', 'spatiotemporal');

CREATE TYPE "dataset_feature_type" AS ENUM ('categorical', 'integer', 'real');

-- TODO
DROP TABLE edits;
DROP TABLE columns;
DROP TABLE tables;
DROP TABLE edit_actions;

DROP TABLE evals;
DROP table metrics;
DROP TABLE models;

-- DROP TABLE dataset_papers;
-- DROP TABLE native_papers;
-- DROP TABLE foreign_papers;
-- DROP TABLE papers;
DROP TABLE reviews;
DROP TABLE requests;
DROP TABLE tabular;
DROP TABLE variables;
DROP TABLE variable_info;

-------------------------------------------------------------------------------
-- auth_session -> sessions
-------------------------------------------------------------------------------
DROP TABLE auth_session;

CREATE TABLE "sessions"
(
    "session_token" TEXT         NOT NULL,
    "user_id"       TEXT         NOT NULL,
    "expires"       TIMESTAMP(3) NOT NULL,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"     TIMESTAMP(3) NOT NULL
);

-------------------------------------------------------------------------------
-- accounts, verification_tokens
-------------------------------------------------------------------------------
CREATE TABLE "accounts"
(
    "user_id"             TEXT         NOT NULL,
    "type"                TEXT         NOT NULL,
    "provider"            TEXT         NOT NULL,
    "provider_account_id" TEXT         NOT NULL,
    "refresh_token"       TEXT,
    "access_token"        TEXT,
    "expires_at"          INTEGER,
    "token_type"          TEXT,
    "scope"               TEXT,
    "id_token"            TEXT,
    "session_state"       TEXT,
    "created_at"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"          TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("provider", "provider_account_id")
);

CREATE TABLE "verification_tokens"
(
    "identifier" TEXT         NOT NULL,
    "token"      TEXT         NOT NULL,
    "expires"    TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("identifier", "token")
);

-------------------------------------------------------------------------------
-- users
-------------------------------------------------------------------------------
ALTER TABLE donated_datasets
    DROP CONSTRAINT donated_datasets_ibfk_1;
ALTER TABLE users
    ALTER COLUMN id TYPE TEXT using id::TEXT;

ALTER TABLE users
    RENAME COLUMN "user" TO email;

ALTER TABLE users
    RENAME COLUMN pass TO password;

ALTER TABLE users
    ALTER COLUMN email TYPE VARCHAR(255),
    ALTER COLUMN email SET NOT NULL,
    ADD COLUMN email_verified TIMESTAMP(3),
    ADD COLUMN image          TEXT,
    ADD COLUMN name           TEXT,
    ALTER COLUMN role TYPE user_role USING role::user_role,
    ALTER COLUMN role SET DEFAULT 'basic',
    ALTER COLUMN role SET NOT NULL,
    ALTER COLUMN password TYPE VARCHAR(255),
    ADD COLUMN created_at     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_at     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE users
SET name = trim(concat(firstname, ' ', lastname));

ALTER TABLE users
    ALTER COLUMN name SET NOT NULL;

ALTER TABLE users
    DROP COLUMN firstname,
    DROP COLUMN lastname,
    DROP COLUMN institution,
    DROP COLUMN address,
    DROP COLUMN resetpasswordexpiration,
    DROP COLUMN resetpasswordtoken,
    DROP COLUMN status,
    DROP COLUMN deletedat,
    DROP COLUMN accesstoken,
    DROP COLUMN google,
    DROP COLUMN github,
    DROP COLUMN googleid,
    DROP COLUMN githubid;

UPDATE users
SET email    = 'ucirepository@uci.edu',
    password = '$2a$10$Khz876l72GFYpQ1SbmanZezcH5Ug3lNc2kBLV7pmd/o7/ZaFrLGrG',
    name     = 'UCI ML Repository Root User',
    role     = 'librarian'
WHERE id = '1';

-------------------------------------------------------------------------------
-- datasets + donated_datasets -> datasets
-- users.id -> donated_datasets.userid
-------------------------------------------------------------------------------
CREATE TABLE "datasets"
(
    "id"                  SERIAL                 NOT NULL,
    "status"              "approval_status"      NOT NULL DEFAULT 'pending',
    "donated_at"          DATE                   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "year_created"        INTEGER                NOT NULL,
    "title"               VARCHAR(255)           NOT NULL,
    "description"         TEXT                   NOT NULL,
    "subject_area"        "dataset_subject_area" NOT NULL,
    "is_tabular"          BOOLEAN                NOT NULL,
    "instance_count"      INTEGER                NOT NULL,
    "feature_count"       INTEGER,
    "has_graphics"        BOOLEAN                NOT NULL DEFAULT false,
    "is_available_python" BOOLEAN                NOT NULL DEFAULT false,
    "view_count"          INTEGER                NOT NULL DEFAULT 0,
    "download_count"      INTEGER                NOT NULL DEFAULT 0,
    "slug"                VARCHAR(255)           NOT NULL,
    "user_id"             TEXT                   NOT NULL,
    "created_at"          TIMESTAMP(3)           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"          TIMESTAMP(3)           NOT NULL,

    "characteristics"     "dataset_characteristic"[],
    "tasks"               "dataset_task"[],
    "feature_types"       "dataset_feature_type"[],
    "subtitle"            VARCHAR(255),
    "doi"                 VARCHAR(255),
    "external_link"       VARCHAR(255),


    CONSTRAINT "datasets_pkey" PRIMARY KEY ("id")
);

INSERT INTO datasets (id,
                      status,
                      donated_at,
                      year_created,
                      title,
                      description,
                      subject_area,
                      is_tabular,
                      instance_count,
                      feature_count,
                      has_graphics,
                      is_available_python,
                      view_count,
                      download_count,
                      slug,
                      user_id,
                      updated_at,
                      characteristics,
                      tasks,
                      feature_types,
                      doi,
                      external_link)
SELECT id,
       lower(replace(status, 'FAILED', 'REJECTED'))::approval_status                       AS status,
       coalesce(datedonated, CURRENT_TIMESTAMP)                                            AS donated_at,   -- TODO populate null data
       coalesce(yearcreated, extract(YEAR FROM CURRENT_TIMESTAMP)::INTEGER)                AS year_created, -- TODO populate null data
       name                                                                                AS title,
       trim(concat(abstract, E'\n\n', dq.otherinfo, E'\n\n', dq.preprocessingdescription)) AS description,
       replace(replace(lower(area), ' ', '_'), 'physical_science',
               'physics_and_chemistry')::dataset_subject_area                              AS subject_area,
       coalesce(istabular, false)                                                          AS is_tabular,
       numinstances                                                                        AS instance_count,
       numfeatures                                                                         AS feature_count,
       coalesce(graphics, '') <> ''                                                        AS has_graphics,
       coalesce(isavailablepython, false)                                                  AS is_available_python,
       numhits                                                                             AS view_count,
       numdownloads                                                                        AS download_count,
       slug,
       userid                                                                              AS user_id,
       CURRENT_TIMESTAMP                                                                   AS updated_at,
       COALESCE(
               (SELECT array_agg(x::dataset_characteristic)
                FROM unnest(string_to_array(LOWER(dd.types), ', ')) x
                WHERE x = ANY (enum_range(NULL::dataset_characteristic)::text[])),
               '{}'
       )                                                                                   AS characteristics,

       COALESCE(
               (SELECT array_agg(x::dataset_task)
                FROM unnest(string_to_array(LOWER(dd.task), ', ')) x
                WHERE x = ANY (enum_range(NULL::dataset_task)::text[])),
               '{}'
       )                                                                                   AS tasks,

       COALESCE(
               (SELECT array_agg(x::dataset_feature_type)
                FROM unnest(string_to_array(LOWER(dd.featuretypes), ', ')) x
                WHERE x = ANY (enum_range(NULL::dataset_feature_type)::text[])),
               '{}'
       )                                                                                   AS feature_types,
       regexp_replace(trim(doi), '^https?://doi.org/', '')                                 AS doi,
       urllink                                                                             AS external_link

FROM donated_datasets dd
         INNER JOIN descriptive_questions dq on dd.id = dq.datasetid
WHERE slug NOTNULL;

ALTER TABLE "datasets"
    ADD CONSTRAINT "datasets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
UPDATE users
SET id = generate_cuid();

DROP TABLE descriptive_questions;

-------------------------------------------------------------------------------
-- creators + dataset_creators -> dataset_authors
-------------------------------------------------------------------------------
CREATE TABLE "dataset_authors"
(
    "id"          TEXT         NOT NULL,
    "dataset_id"  INTEGER      NOT NULL,
    "first_name"  VARCHAR(255) NOT NULL,
    "last_name"   VARCHAR(255) NOT NULL,
    "institution" VARCHAR(255),
    "email"       VARCHAR(255),

    CONSTRAINT "dataset_authors_pkey" PRIMARY KEY ("id")
);

INSERT INTO dataset_authors (id, dataset_id, first_name, last_name, institution, email)
SELECT generate_cuid(),
       dd.id,
       firstname,
       lastname,
       institution,
       email
FROM donated_datasets dd
         INNER JOIN dataset_creators dc on dd.id = dc.datasetid
         INNER JOIN creators c on dc.creatorid = c.id;

DROP TABLE dataset_creators;
DROP TABLE creators;

-------------------------------------------------------------------------------
-- dataset_keywords + keywords
-------------------------------------------------------------------------------

-- ALTER TABLE dataset_keywords
--     DROP CONSTRAINT dataset_keywords_ibfk_1,
--     DROP CONSTRAINT dataset_keywords_ibfk_2;
--
-- ALTER TABLE dataset_keywords
--     RENAME COLUMN datasetid TO dataset_id;
--
-- ALTER TABLE dataset_keywords
--     ADD CONSTRAINT dataset_keywords_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES datasets (id) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- ALTER TABLE dataset_keywords
--     RENAME COLUMN keywordsid TO keyword_id;
--
-- ALTER TABLE dataset_keywords
--     ALTER COLUMN keyword_id TYPE TEXT using keyword_id::TEXT;
--
-- UPDATE dataset_keywords
-- SET keyword_id = generate_cuid();
--
-- ALTER TABLE dataset_keywords
--     ADD CONSTRAINT dataset_keywords_keyword_id_fkey FOREIGN KEY (keyword_id) REFERENCES keywords (id) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- ALTER TABLE keywords
--     RENAME COLUMN keyword TO name;

-------------------------------------------------------------------------------
-- dataset_files
-------------------------------------------------------------------------------

-- DROP TABLE donated_datasets;
DROP TABLE datasets_legacy;

-------------------------------------------------------------------------------
-- dataset_creators JOIN creators -> dataset_authors
-------------------------------------------------------------------------------


-------------------------------------------------------------------------------
-- CLEANUP
-------------------------------------------------------------------------------
DROP SEQUENCE cuid_counter_seq;

DROP ROUTINE base36_encode;
DROP ROUTINE generate_cuid;
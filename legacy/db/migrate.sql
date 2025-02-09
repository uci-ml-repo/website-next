--  npx prisma migrate diff --from-empty --to-schema-datasource prisma/schema.prisma --script > prisma/generated.sql
-------------------------------------------------------------------------------
-- UTILS
-------------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS cuid_counter_seq START 1 MINVALUE 1 MAXVALUE 999999999999999999 CYCLE;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TYPE users_role
RENAME TO user_role;

CREATE TYPE "approval_status" AS ENUM('pending', 'approved', 'rejected', 'draft');

CREATE TYPE "dataset_characteristic" AS ENUM(
  'tabular',
  'sequential',
  'multivariate',
  'time_series',
  'text',
  'image',
  'spatiotemporal'
);

CREATE TYPE "dataset_subject_area" AS ENUM(
  'biology',
  'business',
  'climate_and_environment',
  'computer_science',
  'education',
  'engineering',
  'games',
  'health_and_medicine',
  'law',
  'physics_and_chemistry',
  'social_science',
  'other'
);

CREATE TYPE "dataset_task" AS ENUM('classification', 'regression', 'clustering');

CREATE TYPE "dataset_feature_role" AS ENUM('id', 'feature', 'target', 'other');

CREATE TYPE "dataset_feature_type" AS ENUM(
  'categorical',
  'integer',
  'continuous',
  'binary',
  'text',
  'date',
  'other'
);

-- TODO
DROP TABLE edits;

DROP TABLE columns;

DROP TABLE tables;

DROP TABLE edit_actions;

DROP TABLE evals;

DROP TABLE metrics;

DROP TABLE models;

DROP TABLE reviews;

DROP TABLE requests;

DROP TABLE tabular;

DROP TABLE variables;

DROP TABLE variable_info;

-------------------------------------------------------------------------------
-- auth_session -> sessions
-------------------------------------------------------------------------------
DROP TABLE auth_session;

CREATE TABLE "session" (
  "session_token" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-------------------------------------------------------------------------------
-- accounts, verification_tokens
-------------------------------------------------------------------------------
CREATE TABLE "account" (
  "user_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "provider_account_id" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "accounts_pkey" PRIMARY KEY ("provider", "provider_account_id")
);

-------------------------------------------------------------------------------
-- users
-------------------------------------------------------------------------------
ALTER TABLE donated_datasets
DROP CONSTRAINT donated_datasets_ibfk_1;

ALTER TABLE users
ALTER COLUMN id TYPE TEXT USING id::TEXT;

ALTER TABLE users
RENAME COLUMN "user" TO email;

ALTER TABLE users
RENAME COLUMN pass TO password;

ALTER TABLE users
ALTER COLUMN email TYPE VARCHAR(255),
ALTER COLUMN email
SET NOT NULL,
ADD COLUMN email_verified TIMESTAMP(3),
ADD COLUMN image TEXT,
ADD COLUMN name TEXT,
ALTER COLUMN role TYPE user_role USING role::user_role,
ALTER COLUMN role
SET DEFAULT 'basic',
ALTER COLUMN role
SET NOT NULL,
ALTER COLUMN password TYPE VARCHAR(255),
ADD COLUMN created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE users
SET
  name = trim(concat(firstname, ' ', lastname));

ALTER TABLE users
ALTER COLUMN name
SET NOT NULL;

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

ALTER TABLE users
RENAME TO "user";

-------------------------------------------------------------------------------
-- datasets + donated_datasets -> dataset
-- users.id -> donated_datasets.userid
-------------------------------------------------------------------------------
DROP SEQUENCE datasets_id_seq CASCADE;

CREATE TABLE "dataset" (
  id serial PRIMARY KEY,
  title text NOT NULL,
  year_created integer,
  subtitle text,
  doi text,
  description text,
  subject_area dataset_subject_area,
  instance_count integer,
  feature_count integer,
  has_graphics boolean DEFAULT FALSE NOT NULL,
  is_available_python boolean DEFAULT FALSE NOT NULL,
  external_link text,
  slug text NOT NULL,
  status approval_status DEFAULT 'draft'::approval_status NOT NULL,
  view_count integer DEFAULT 0 NOT NULL,
  download_count integer DEFAULT 0 NOT NULL,
  variables_description text,
  characteristics dataset_characteristic[],
  tasks dataset_task[],
  feature_types dataset_feature_type[],
  size integer,
  file_count integer,
  user_id text NOT NULL,
  donated_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);

INSERT INTO
  descriptive_questions (
    datasetid,
    purpose,
    funding,
    represent,
    datasplits,
    sensitiveinfo,
    preprocessingdescription,
    softwareavailable,
    used,
    otherinfo,
    datasetcitation
  )
SELECT
  dd.id,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL
FROM
  donated_datasets dd
  LEFT JOIN descriptive_questions dq ON dd.id = dq.datasetid
WHERE
  dq.datasetid IS NULL;

INSERT INTO
  dataset (
    id,
    status,
    donated_at,
    year_created,
    title,
    description,
    subject_area,
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
    external_link
  )
SELECT
  dd.id,
  lower(replace(status, 'FAILED', 'REJECTED'))::approval_status AS status,
  coalesce(datedonated, CURRENT_TIMESTAMP) AS donated_at, -- TODO populate null data
  coalesce(
    yearcreated,
    extract(
      YEAR
      FROM
        CURRENT_TIMESTAMP
    )::INTEGER
  ) AS year_created, -- TODO populate null data
  name AS title,
  trim(
    concat(
      abstract,
      E'\n\n',
      dq.otherinfo,
      E'\n\n',
      dq.preprocessingdescription
    )
  ) AS description,
  replace(
    replace(lower(area), ' ', '_'),
    'physical_science',
    'physics_and_chemistry'
  )::dataset_subject_area AS subject_area,
  numinstances AS instance_count,
  numfeatures AS feature_count,
  coalesce(graphics, '') <> '' AS has_graphics,
  coalesce(isavailablepython, FALSE) AS is_available_python,
  numhits AS view_count,
  numdownloads AS download_count,
  slug,
  userid::text AS user_id,
  CURRENT_TIMESTAMP AS updated_at,
  COALESCE(
    (
      SELECT
        array_agg(x::dataset_characteristic)
      FROM
        unnest(string_to_array(lower(dd.types), ', ')) x
      WHERE
        x = ANY (enum_range(NULL::dataset_characteristic)::TEXT[])
    ),
    '{}'
  ) AS characteristics,
  COALESCE(
    (
      SELECT
        array_agg(x::dataset_task)
      FROM
        unnest(string_to_array(lower(dd.task), ', ')) x
      WHERE
        x = ANY (enum_range(NULL::dataset_task)::TEXT[])
    ),
    '{}'
  ) AS tasks,
  COALESCE(
    (
      SELECT
        array_agg(x::dataset_feature_type)
      FROM
        unnest(
          string_to_array(
            lower(replace(dd.featuretypes, 'Real', 'Continuous')),
            ', '
          )
        ) x
      WHERE
        x = ANY (enum_range(NULL::dataset_feature_type)::TEXT[])
    ),
    '{}'
  ) AS feature_types,
  regexp_replace(trim(doi), '^https?://doi.org/', '') AS doi,
  urllink AS external_link
FROM
  donated_datasets dd
  INNER JOIN descriptive_questions dq ON dd.id = dq.datasetid
WHERE
  slug NOTNULL;

ALTER TABLE "dataset"
ADD CONSTRAINT "dataset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

UPDATE "user"
SET
  id = gen_random_uuid ();

ALTER TABLE dataset
DROP CONSTRAINT dataset_user_id_fkey;

ALTER TABLE "user"
ALTER COLUMN id
SET DEFAULT gen_random_uuid ();

ALTER TABLE "user"
ALTER COLUMN id TYPE uuid USING id::uuid;

ALTER TABLE dataset
ALTER COLUMN user_id type uuid USING user_id::uuid;

ALTER TABLE "dataset"
ADD CONSTRAINT "dataset_user_id_user_id_fkey" FOREIGN key ("user_id") REFERENCES "user" ("id") ON DELETE restrict ON UPDATE cascade;

DROP TABLE descriptive_questions;

-------------------------------------------------------------------------------
-- variable
-------------------------------------------------------------------------------
CREATE TABLE "variable" (
  "id" TEXT NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "role" "dataset_feature_role" NOT NULL,
  "type" "dataset_feature_type" NOT NULL,
  "description" TEXT,
  "units" VARCHAR(255),
  "missingValues" BOOLEAN NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  CONSTRAINT "dataset_variables_pkey" PRIMARY KEY ("id")
);

-------------------------------------------------------------------------------
-- creators + dataset_creators -> author
-------------------------------------------------------------------------------
CREATE TABLE "author" (
  "id" TEXT NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "institution" VARCHAR(255),
  "email" VARCHAR(255),
  CONSTRAINT "dataset_authors_pkey" PRIMARY KEY ("id")
);

INSERT INTO
  author (
    id,
    dataset_id,
    first_name,
    last_name,
    institution,
    email
  )
SELECT
  gen_random_uuid (),
  dd.id,
  firstname,
  lastname,
  institution,
  email
FROM
  donated_datasets dd
  INNER JOIN dataset_creators dc ON dd.id = dc.datasetid
  INNER JOIN creators c ON dc.creatorid = c.id;

DROP TABLE dataset_creators;

DROP TABLE creators;

-------------------------------------------------------------------------------
-- dataset_keywords + keywords
-------------------------------------------------------------------------------
ALTER TABLE dataset_keywords
DROP CONSTRAINT dataset_keywords_ibfk_1,
DROP CONSTRAINT dataset_keywords_ibfk_2;

ALTER TABLE dataset_keywords
RENAME COLUMN datasetid TO dataset_id;

ALTER TABLE dataset_keywords
ADD CONSTRAINT dataset_keywords_dataset_id_fkey FOREIGN KEY (dataset_id) REFERENCES dataset (id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE dataset_keywords
RENAME COLUMN keywordsid TO keyword_id;

ALTER TABLE dataset_keywords
ALTER COLUMN keyword_id TYPE TEXT USING keyword_id::TEXT;

ALTER TABLE keywords
ALTER COLUMN id TYPE TEXT USING id::TEXT;

ALTER TABLE dataset_keywords
ADD CONSTRAINT dataset_keywords_keyword_id_fkey FOREIGN KEY (keyword_id) REFERENCES keywords (id) ON DELETE CASCADE ON UPDATE CASCADE;

UPDATE keywords
SET
  id = gen_random_uuid (),
  keyword = lower(keyword);

ALTER TABLE keywords
ALTER COLUMN status
DROP DEFAULT,
ALTER COLUMN status TYPE approval_status USING replace(lower(status), 'accepted', 'approved')::approval_status,
ALTER COLUMN status
SET DEFAULT 'pending'::approval_status;

ALTER TABLE keywords
RENAME COLUMN keyword TO name;

-------------------------------------------------------------------------------
-- dataset_papers
-------------------------------------------------------------------------------
CREATE TABLE "dataset_papers" (
  "id" TEXT NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "authors" VARCHAR(255) [],
  "venue" VARCHAR(255) NOT NULL,
  "year" INTEGER NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  "dataset_id" INTEGER,
  "introductory_for_dataset_id" INTEGER,
  CONSTRAINT "dataset_papers_pkey" PRIMARY KEY ("id")
);

INSERT INTO
  dataset_papers (
    id,
    title,
    authors,
    venue,
    YEAR,
    url,
    dataset_id,
    introductory_for_dataset_id
  )
SELECT
  gen_random_uuid (),
  np.title,
  string_to_array(np.authors, ', '),
  np.venue,
  np.year,
  url,
  datasetid,
  dd.id
FROM
  dataset_papers_legacy dpl
  INNER JOIN native_papers np ON dpl.foreignpaperid = np.id
  INNER JOIN donated_datasets dd ON dd.intropaperid = dpl.datasetpapersid
WHERE
  dd.status = 'APPROVED';

-------------------------------------------------------------------------------
-- dataset bookmarks
-------------------------------------------------------------------------------
CREATE TABLE "dataset_bookmarks" (
  "user_id" TEXT NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  "bookmarked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "dataset_bookmarks_pkey" PRIMARY KEY ("user_id", "dataset_id")
);

-------------------------------------------------------------------------------
-- dataset materialized view
-------------------------------------------------------------------------------
CREATE MATERIALIZED VIEW dataset_view AS
SELECT
  id,
  title,
  year_created,
  subtitle,
  doi,
  description,
  subject_area,
  instance_count,
  feature_count,
  has_graphics,
  is_available_python,
  external_link,
  slug,
  status,
  view_count,
  download_count,
  variables_description,
  characteristics,
  tasks,
  feature_types,
  size,
  file_count,
  user_id,
  donated_at,
  updated_at,
  (
    SELECT
      jsonb_build_object(
        'id',
        "user".id,
        'name',
        "user".name,
        'email',
        "user".email,
        'email_verified',
        "user"."email_verified",
        'image',
        "user".image,
        'role',
        "user".role,
        'created_at',
        "user".created_at
      ) AS jsonb_build_object
    FROM
      "user"
    WHERE
      "user".id = dataset.user_id
  ) AS u
FROM
  dataset
GROUP BY
  id;

-------------------------------------------------------------------------------
-- CLEANUP
-------------------------------------------------------------------------------
DROP TABLE dataset_notes;

DROP TABLE dataset_file;

DROP TABLE file_info;

DROP TABLE donated_datasets;

DROP TABLE datasets_legacy;

DROP SEQUENCE cuid_counter_seq;

DROP SEQUENCE dataset_keywords_datasetkeywordsid_seq CASCADE;

DROP SEQUENCE dataset_papers_datasetpapersid_seq CASCADE;

DROP SEQUENCE keywords_id_seq CASCADE;

DROP SEQUENCE native_papers_id_seq CASCADE;

DROP SEQUENCE papers_id_seq CASCADE;

DROP SEQUENCE users_id_seq CASCADE;

DROP TYPE dataset_papers_type CASCADE;

DROP TYPE edits_status CASCADE;

DROP TYPE user_role CASCADE;

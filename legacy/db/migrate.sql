-------------------------------------------------------------------------------
-- UTILS
-------------------------------------------------------------------------------
CREATE SEQUENCE if NOT EXISTS cuid_counter_seq start 1 minvalue 1 maxvalue 999999999999999999 cycle;

CREATE EXTENSION if NOT EXISTS pg_trgm;

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
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT current_timestamp,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-------------------------------------------------------------------------------
-- users
-------------------------------------------------------------------------------
ALTER TABLE donated_datasets
DROP CONSTRAINT donated_datasets_ibfk_1;

ALTER TABLE users
RENAME COLUMN "user" TO email;

ALTER TABLE users
RENAME COLUMN pass TO password;

ALTER TABLE users
ALTER COLUMN email type VARCHAR(255),
ALTER COLUMN email
SET NOT NULL,
ADD COLUMN email_verified TIMESTAMP(3),
ADD COLUMN image TEXT,
ADD COLUMN name TEXT,
ALTER COLUMN role type user_role USING role::user_role,
ALTER COLUMN role
SET DEFAULT 'basic',
ALTER COLUMN role
SET NOT NULL,
ALTER COLUMN password type VARCHAR(255),
ADD COLUMN created_at TIMESTAMP(3) NOT NULL DEFAULT current_timestamp,
ADD COLUMN updated_at TIMESTAMP(3) NOT NULL DEFAULT current_timestamp;

UPDATE users
SET
  name = TRIM(CONCAT(firstname, ' ', lastname));

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
DROP COLUMN githubid,
DROP COLUMN updated_at;

ALTER TABLE users
RENAME TO "user";

ALTER TABLE "user"
ALTER COLUMN id type TEXT USING id::TEXT;

ALTER TABLE donated_datasets
ALTER COLUMN userid type TEXT USING userid::TEXT;

ALTER TABLE donated_datasets
ADD CONSTRAINT donated_datasets_ibfk_1 FOREIGN key (userid) REFERENCES "user" (id) ON UPDATE CASCADE;

ALTER TABLE "user"
ALTER COLUMN id
SET DEFAULT gen_random_uuid ();

UPDATE "user"
SET
  id = gen_random_uuid ();

ALTER TABLE donated_datasets
DROP CONSTRAINT donated_datasets_ibfk_1;

ALTER TABLE "user"
ALTER COLUMN id type uuid USING id::uuid;

ALTER TABLE donated_datasets
ALTER COLUMN userid type uuid USING userid::uuid;

ALTER TABLE donated_datasets
ADD CONSTRAINT donated_datasets_ibfk_1 FOREIGN key (userid) REFERENCES "user" (id);

-------------------------------------------------------------------------------
-- datasets + donated_datasets -> dataset
-- users.id -> donated_datasets.userid
-------------------------------------------------------------------------------
DROP SEQUENCE datasets_id_seq CASCADE;

CREATE TABLE dataset (
  id serial PRIMARY KEY,
  title TEXT NOT NULL,
  year_created INTEGER,
  subtitle TEXT,
  doi TEXT,
  description TEXT,
  subject_area dataset_subject_area,
  instance_count INTEGER,
  feature_count INTEGER,
  has_graphics BOOLEAN DEFAULT FALSE NOT NULL,
  is_available_python BOOLEAN DEFAULT FALSE NOT NULL,
  external_link TEXT,
  slug TEXT NOT NULL,
  status approval_status DEFAULT 'draft'::approval_status NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  download_count INTEGER DEFAULT 0 NOT NULL,
  variables_description TEXT,
  data_types dataset_characteristic[],
  tasks dataset_task[],
  feature_types dataset_feature_type[],
  size BIGINT,
  file_count INTEGER,
  user_id uuid NOT NULL CONSTRAINT dataset_user_id_user_id_fk REFERENCES "user",
  donated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT accepted_check CHECK (
    (status = 'draft'::approval_status)
    OR (
      (year_created IS NOT NULL)
      AND (doi IS NOT NULL)
      AND (instance_count IS NOT NULL)
      AND (description IS NOT NULL)
      AND (subject_area IS NOT NULL)
    )
  ),
  CONSTRAINT files_check CHECK (
    (
      (external_link IS NULL)
      AND (size IS NOT NULL)
      AND (file_count IS NOT NULL)
    )
    OR (
      (external_link IS NOT NULL)
      AND (external_link ~* '^https?://'::TEXT)
      AND (size IS NULL)
      AND (file_count IS NULL)
    )
  )
);

ALTER TABLE dataset owner TO postgres;

CREATE INDEX dataset_id_index ON dataset (id);

CREATE INDEX dataset_instance_count_index ON dataset (instance_count);

CREATE INDEX dataset_feature_count_index ON dataset (feature_count);

CREATE INDEX dataset_donated_at_index ON dataset (donated_at);

-- noinspection SqlResolve
CREATE INDEX dataset_ts_search_index ON dataset USING gin (
  SETWEIGHT(
    TO_TSVECTOR('simple'::regconfig, title),
    'A'::"char"
  )
);

-- noinspection SqlResolve
CREATE INDEX dataset_trgm_search_index ON dataset USING gin (title gin_trgm_ops);

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

DO $$
  DECLARE
    rec RECORD;
  BEGIN
    FOR rec IN
      SELECT dd.id,
             lower(replace(status, 'FAILED', 'REJECTED'))::approval_status AS status,
             coalesce(datedonated, CURRENT_TIMESTAMP)                      AS donated_at,   -- TODO populate null data
             coalesce(
               yearcreated,
               extract(
                 YEAR
                 FROM
                 CURRENT_TIMESTAMP
               )::INTEGER
             )                                                             AS year_created, -- TODO populate null data
             name                                                          AS title,
             trim(
               concat(
                 abstract,
                 E'\n\n',
                 dq.otherinfo,
                 E'\n\n',
                 dq.preprocessingdescription
               )
             )                                                             AS description,
             replace(
               replace(lower(area), ' ', '_'),
               'physical_science',
               'physics_and_chemistry'
             )::dataset_subject_area                                       AS subject_area,
             numinstances                                                  AS instance_count,
             numfeatures                                                   AS feature_count,
             coalesce(graphics, '') <> ''                                  AS has_graphics,
             coalesce(isavailablepython, FALSE)                            AS is_available_python,
             numhits                                                       AS view_count,
             numdownloads                                                  AS download_count,
             slug,
             userid                                                        AS user_id,
             CURRENT_TIMESTAMP                                             AS updated_at,
             COALESCE(
               (SELECT array_agg(x::dataset_characteristic)
                FROM unnest(string_to_array(lower(dd.types), ', ')) x
                WHERE x = ANY (enum_range(NULL::dataset_characteristic)::TEXT[])),
               '{}'
             )                                                             AS data_types,
             COALESCE(
               (SELECT array_agg(x::dataset_task)
                FROM unnest(string_to_array(lower(dd.task), ', ')) x
                WHERE x = ANY (enum_range(NULL::dataset_task)::TEXT[])),
               '{}'
             )                                                             AS tasks,
             COALESCE(
               (SELECT array_agg(x::dataset_feature_type)
                FROM unnest(
                       string_to_array(
                         lower(replace(dd.featuretypes, 'Real', 'Continuous')),
                         ', '
                       )
                     ) x
                WHERE x = ANY (enum_range(NULL::dataset_feature_type)::TEXT[])),
               '{}'
             )                                                             AS feature_types,
             regexp_replace(trim(doi), '^https?://doi.org/', '')           AS doi,
             urllink                                                       AS external_link,
             (SELECT count(*)
              FROM dataset_file df
                     INNER JOIN file_info fi ON fi.id = df.fileinfoid
              WHERE fi.datasetid = dd.id)                                  AS file_count,
             (SELECT compressedsize
              FROM file_info fi
              WHERE fi.datasetid = dd.id)                                  AS size
      FROM donated_datasets dd
             INNER JOIN descriptive_questions dq ON dd.id = dq.datasetid
      WHERE slug NOTNULL
      LOOP
        BEGIN
          INSERT INTO dataset (id,
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
                               data_types,
                               tasks,
                               feature_types,
                               doi,
                               external_link,
                               file_count,
                               size)
          VALUES (rec.id,
                  rec.status,
                  rec.donated_at,
                  rec.year_created,
                  rec.title,
                  rec.description,
                  rec.subject_area,
                  rec.instance_count,
                  rec.feature_count,
                  rec.has_graphics,
                  rec.is_available_python,
                  rec.view_count,
                  rec.download_count,
                  rec.slug,
                  rec.user_id,
                  rec.updated_at,
                  rec.data_types,
                  rec.tasks,
                  rec.feature_types,
                  rec.doi,
                  rec.external_link,
                  rec.file_count,
                  rec.size);
        EXCEPTION
          WHEN OTHERS THEN
            RAISE NOTICE 'Skipping record for donated dataset with id: %, status: % due to error: %', rec.id, rec.status, SQLERRM;
        END;
      END LOOP;
  END
$$;

DROP TABLE descriptive_questions;

-------------------------------------------------------------------------------
-- variable
-------------------------------------------------------------------------------
CREATE TABLE variable (
  id uuid DEFAULT gen_random_uuid () NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  role dataset_feature_role NOT NULL,
  type dataset_feature_type NOT NULL,
  missing_values BOOLEAN NOT NULL,
  units TEXT,
  dataset_id INTEGER NOT NULL CONSTRAINT variable_dataset_id_dataset_id_fk REFERENCES dataset
);

-------------------------------------------------------------------------------
-- creators + dataset_creators -> author
-------------------------------------------------------------------------------
CREATE TABLE "author" (
  "id" uuid NOT NULL,
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
-- dataset_keyword + keyword
-------------------------------------------------------------------------------
ALTER TABLE keywords
RENAME TO keyword;

ALTER TABLE keyword
RENAME COLUMN keyword TO name;

ALTER TABLE dataset_keywords
RENAME TO dataset_keyword;

ALTER TABLE dataset_keyword
RENAME COLUMN datasetid TO dataset_id;

ALTER TABLE dataset_keyword
RENAME COLUMN keywordsid TO keyword_id;

ALTER TABLE dataset_keyword
DROP CONSTRAINT idx_16445_primary;

ALTER TABLE dataset_keyword
DROP COLUMN datasetkeywordsid;

ALTER TABLE keyword
ALTER COLUMN status
DROP DEFAULT,
ALTER COLUMN status type approval_status USING REPLACE(LOWER(status), 'accepted', 'approved')::approval_status,
ALTER COLUMN status
SET DEFAULT 'pending'::approval_status;

ALTER TABLE dataset_keyword
DROP CONSTRAINT dataset_keywords_ibfk_1;

-- noinspection SqlResolve
DELETE FROM dataset_keyword
WHERE
  dataset_id NOT IN (
    SELECT
      id
    FROM
      dataset
  );

-- noinspection SqlResolve
ALTER TABLE dataset_keyword
ADD CONSTRAINT dataset_keyword_dataset_id_dataset_id_fk FOREIGN KEY (dataset_id) REFERENCES dataset (id);

ALTER TABLE dataset_keyword
DROP CONSTRAINT dataset_keywords_ibfk_2;

-- noinspection SqlResolve @ column/"keyword_id"
ALTER TABLE dataset_keyword
ALTER COLUMN keyword_id type TEXT USING keyword_id::TEXT;

ALTER TABLE keyword
ALTER COLUMN id type TEXT USING id::TEXT;

-- noinspection SqlResolve
ALTER TABLE dataset_keyword
ADD CONSTRAINT dataset_keywords_ibfk_2_tmp FOREIGN KEY (keyword_id) REFERENCES keyword (id) ON UPDATE CASCADE;

ALTER TABLE keyword
ALTER COLUMN id
SET DEFAULT gen_random_uuid ();

UPDATE keyword
SET
  id = gen_random_uuid ();

ALTER TABLE dataset_keyword
DROP CONSTRAINT dataset_keywords_ibfk_2_tmp;

ALTER TABLE keyword
ALTER COLUMN id type uuid USING id::uuid;

-- noinspection SqlResolve @ column/"keyword_id"
ALTER TABLE dataset_keyword
ALTER COLUMN keyword_id type uuid USING keyword_id::uuid;

-- noinspection SqlResolve
DELETE FROM dataset_keyword
WHERE
  ctid NOT IN (
    SELECT
      MIN(ctid)
    FROM
      dataset_keyword
    GROUP BY
      dataset_id,
      keyword_id
  );

-- noinspection SqlResolve
ALTER TABLE dataset_keyword
ADD CONSTRAINT dataset_keyword_keyword_id_dataset_id_pk PRIMARY KEY (keyword_id, dataset_id);

-- noinspection SqlResolve @ column/"keyword_id"
ALTER TABLE dataset_keyword
ADD CONSTRAINT dataset_keyword_keyword_id_keyword_id_fk FOREIGN KEY (keyword_id) REFERENCES keyword (id);

-------------------------------------------------------------------------------
-- paper
-------------------------------------------------------------------------------
CREATE TABLE paper (
  id uuid DEFAULT gen_random_uuid () NOT NULL PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT[] NOT NULL,
  venue TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  citation_count INTEGER,
  url TEXT NOT NULL,
  dataset_id INTEGER NOT NULL CONSTRAINT paper_dataset_id_dataset_id_fk REFERENCES dataset
);

INSERT INTO
  paper (
    id,
    title,
    authors,
    venue,
    "year",
    url,
    dataset_id
  )
SELECT
  gen_random_uuid (),
  np.title,
  STRING_TO_ARRAY(np.authors, ', '),
  np.venue,
  np.year,
  np.url,
  dp.datasetid
FROM
  dataset_papers dp
  INNER JOIN native_papers np ON dp.foreignpaperid = np.id
  INNER JOIN donated_datasets dd ON dd.intropaperid = dp.datasetpapersid
WHERE
  dd.status = 'APPROVED';

-------------------------------------------------------------------------------
-- dataset bookmarks
-------------------------------------------------------------------------------
CREATE TABLE "bookmark" (
  "user_id" uuid NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  "bookmarked_at" TIMESTAMP(3) NOT NULL DEFAULT current_timestamp,
  CONSTRAINT "dataset_bookmarks_pkey" PRIMARY KEY ("user_id", "dataset_id")
);

-------------------------------------------------------------------------------
-- dataset materialized view
-------------------------------------------------------------------------------
-- noinspection SqlResolve @ column/"keyword_id"
-- noinspection SqlResolve @ column/"dataset_id"
CREATE MATERIALIZED VIEW dataset_view AS
SELECT
  dataset.id,
  dataset.title,
  dataset.year_created,
  dataset.subtitle,
  dataset.doi,
  dataset.description,
  dataset.subject_area,
  dataset.instance_count,
  dataset.feature_count,
  dataset.has_graphics,
  dataset.is_available_python,
  dataset.external_link,
  dataset.slug,
  dataset.status,
  dataset.view_count,
  dataset.download_count,
  dataset.variables_description,
  dataset.data_types,
  dataset.tasks,
  dataset.feature_types,
  dataset.size,
  dataset.file_count,
  dataset.user_id,
  dataset.donated_at,
  dataset.updated_at,
  COALESCE(
    (
      SELECT
        ARRAY_AGG(keyword.name) AS array_agg
      FROM
        keyword
        JOIN dataset_keyword dataset_keyword_1 ON dataset_keyword_1.keyword_id = keyword.id
      WHERE
        dataset_keyword_1.dataset_id = dataset.id
    ),
    ARRAY[]::TEXT[]
  ) AS keywords,
  COALESCE(
    (
      SELECT
        ARRAY_AGG(
          JSONB_BUILD_OBJECT(
            'id',
            author_1.id,
            'first_name',
            author_1.first_name,
            'last_name',
            author_1.last_name,
            'email',
            author_1.email
          )
        ) AS array_agg
      FROM
        author author_1
      WHERE
        author_1.dataset_id = dataset.id
    ),
    ARRAY[]::jsonb[]
  ) AS authors,
  COALESCE(
    (
      SELECT
        ARRAY_AGG(
          JSONB_BUILD_OBJECT(
            'id',
            variable_1.id,
            'name',
            variable_1.name,
            'description',
            variable_1.description,
            'role',
            variable_1.role,
            'type',
            variable_1.type,
            'missing_values',
            variable_1.missing_values,
            'units',
            variable_1.units
          )
        ) AS array_agg
      FROM
        variable variable_1
      WHERE
        variable_1.dataset_id = dataset.id
    ),
    ARRAY[]::jsonb[]
  ) AS variables,
  COALESCE(
    (
      SELECT
        ARRAY_AGG(LOWER(variable_1.name)) AS array_agg
      FROM
        variable variable_1
      WHERE
        variable_1.dataset_id = dataset.id
    ),
    ARRAY[]::TEXT[]
  ) AS attributes,
  (
    SELECT
      JSONB_BUILD_OBJECT(
        'id',
        "user".id,
        'name',
        "user".name,
        'email',
        "user".email,
        'email_verified',
        "user".email_verified,
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
  ) AS "user",
  (
    SELECT
      JSONB_BUILD_OBJECT(
        'title',
        paper_1.title,
        'authors',
        paper_1.authors,
        'venue',
        paper_1.venue,
        'year',
        paper_1.year,
        'citation_count',
        paper_1.citation_count,
        'url',
        paper_1.url,
        'dataset_id',
        paper_1.dataset_id
      ) AS jsonb_build_object
    FROM
      paper paper_1
    WHERE
      paper_1.dataset_id = dataset.id
  ) AS introductory_paper
FROM
  dataset
  LEFT JOIN paper ON dataset.id = paper.dataset_id
  LEFT JOIN author ON dataset.id = author.dataset_id
  LEFT JOIN variable ON dataset.id = variable.dataset_id
  LEFT JOIN dataset_keyword ON dataset.id = dataset_keyword.dataset_id
GROUP BY
  dataset.id;

-------------------------------------------------------------------------------
-- accounts, email_verification_token, password_reset_token
-------------------------------------------------------------------------------
CREATE TABLE account (
  user_id uuid NOT NULL CONSTRAINT "account_user_id_user_id_fk" REFERENCES "user" ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT
);

CREATE TABLE email_verification_token (
  id uuid DEFAULT gen_random_uuid () NOT NULL PRIMARY KEY,
  "userId" uuid NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP NOT NULL
);

CREATE TABLE password_reset_token (
  token TEXT NOT NULL PRIMARY KEY,
  user_id uuid NOT NULL CONSTRAINT password_reset_token_user_id_user_id_fk REFERENCES "user",
  expires TIMESTAMP NOT NULL
);

-------------------------------------------------------------------------------
-- REFRESH MATERIALIZED VIEW
-------------------------------------------------------------------------------
REFRESH MATERIALIZED VIEW dataset_view;

-------------------------------------------------------------------------------
-- CLEANUP
-------------------------------------------------------------------------------
DROP TABLE dataset_notes;

DROP TABLE dataset_file;

DROP TABLE file_info;

DROP TABLE donated_datasets;

DROP TABLE dataset_papers CASCADE;

DROP TABLE native_papers CASCADE;

DROP TABLE foreign_papers CASCADE;

DROP TABLE datasets_legacy;

DROP SEQUENCE cuid_counter_seq;

DROP SEQUENCE papers_id_seq CASCADE;

DROP SEQUENCE users_id_seq CASCADE;

DROP SEQUENCE keywords_id_seq;

DROP TYPE dataset_papers_type CASCADE;

DROP TYPE edits_status CASCADE;

DROP TYPE requests_status CASCADE;

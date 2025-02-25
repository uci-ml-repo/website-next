-------------------------------------------------------------------------------
-- UTILS
-------------------------------------------------------------------------------
CREATE EXTENSION if NOT EXISTS pg_trgm;

ALTER TYPE users_role
RENAME TO user_role;

CREATE TYPE dataset_report_reason AS ENUM(
  'missing_files_or_data',
  'inaccurate_metadata',
  'other'
);

CREATE TYPE discussion_report_reason AS ENUM(
  'spam',
  'unprofessional',
  'inappropriate',
  'other'
);

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

-------------------------------------------------------------------------------
-- auth_session -> sessions
-------------------------------------------------------------------------------
DROP TABLE auth_session;

CREATE TABLE "session" (
  "session_token" TEXT PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
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

ALTER INDEX idx_16577_primary
RENAME TO user_pkey;

DROP INDEX idx_16577_user_unique;

ALTER TABLE "user"
ADD CONSTRAINT user_email_unique UNIQUE (email);

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

UPDATE "user"
SET
  id = '00000000-0000-0000-0000-000000000000',
  name = 'UCI Machine Learning Repository',
  role = 'admin'
WHERE
  email = 'ucirepository@gmail.com';

-- noinspection SqlResolve
UPDATE donated_datasets
SET
  userid = (
    SELECT
      id
    FROM
      "user"
    WHERE
      email = 'ucirepository@gmail.com'
  )
WHERE
  userid = (
    SELECT
      id
    FROM
      "user"
    WHERE
      email = 'dwjiang@uci.edu'
  );

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

DO $$
  DECLARE
    dataset_ids integer[] := ARRAY[387, 497];
  BEGIN
    DELETE FROM dataset_creators
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM dataset_notes
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM descriptive_questions
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM dataset_file USING file_info
    WHERE file_info.datasetid = ANY(dataset_ids)
      AND dataset_file.fileinfoid = file_info.id;

    DELETE FROM file_info
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM variable_info
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM variables
    WHERE datasetid = ANY(dataset_ids);

    DELETE FROM donated_datasets
    WHERE id = ANY(dataset_ids);
  END
$$;

-- duplicate slugs
CREATE TABLE "dataset" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" TEXT NOT NULL,
  "year_created" INTEGER,
  "subtitle" TEXT,
  "doi" TEXT,
  "description" TEXT,
  "subject_area" "dataset_subject_area",
  "instance_count" INTEGER,
  "feature_count" INTEGER,
  "has_graphics" BOOLEAN DEFAULT FALSE NOT NULL,
  "is_available_python" BOOLEAN DEFAULT FALSE NOT NULL,
  "external_link" TEXT,
  "slug" TEXT NOT NULL,
  "status" "approval_status" DEFAULT 'draft' NOT NULL,
  "view_count" INTEGER DEFAULT 0 NOT NULL,
  "download_count" INTEGER DEFAULT 0 NOT NULL,
  "data_types" "dataset_characteristic" [],
  "tasks" "dataset_task" [],
  "feature_types" "dataset_feature_type" [],
  "compressed_size" BIGINT,
  "uncompressed_size" BIGINT,
  "file_count" INTEGER,
  "user_id" uuid NOT NULL,
  "donated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "dataset_slug_unique" UNIQUE ("slug"),
  CONSTRAINT "accepted_check" CHECK (
    "dataset"."status" = 'draft'
    OR (
      "dataset"."year_created" IS NOT NULL
      AND "dataset"."doi" IS NOT NULL
      AND "dataset"."instance_count" IS NOT NULL
      AND "dataset"."description" IS NOT NULL
      AND "dataset"."subject_area" IS NOT NULL
    )
  ),
  CONSTRAINT "files_check" CHECK (
    "dataset"."status" = 'draft'
    OR (
      (
        "dataset"."external_link" IS NULL
        AND "dataset"."compressed_size" IS NOT NULL
        AND "dataset"."uncompressed_size" IS NOT NULL
        AND "dataset"."file_count" IS NOT NULL
      )
      OR (
        "dataset"."external_link" IS NOT NULL
        AND "dataset"."external_link" ~* '^https?://'
        AND "dataset"."uncompressed_size" IS NULL
        AND "dataset"."file_count" IS NULL
      )
    )
  )
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

DO $$
DECLARE rec RECORD;

BEGIN FOR rec IN
SELECT
  dd.id,
  LOWER(REPLACE(status, 'FAILED', 'rejected'))::approval_status AS status,
  COALESCE(datedonated, CURRENT_TIMESTAMP) AS donated_at, -- TODO populate null data
  COALESCE(
    yearcreated,
    EXTRACT(
      YEAR
      FROM
        CURRENT_TIMESTAMP
    )::INTEGER
  ) AS year_created, -- TODO populate null data
  name AS title,
  TRIM(
    CONCAT_WS(
      E'\n\n',
      abstract,
      dq.otherinfo,
      CASE
        WHEN dq.preprocessingdescription IS NOT NULL THEN 'Preprocessing description: ' || dq.preprocessingdescription
      END,
      CASE
        WHEN dq.sensitiveinfo IS NOT NULL THEN 'This dataset contains sensitive information: ' ||  regexp_replace(dq.sensitiveinfo, '^Yes\.?\s*', '')
      END,
      CASE
        WHEN dq.datasetcitation IS NOT NULL  THEN 'Citation information: ' || dq.datasetcitation
      END,
      CASE
        WHEN vi.classlabels IS NOT NULL THEN 'Variables Info:' || E'\n'|| vi.otherinfo
      END,
      CASE
        WHEN vi.otherinfo IS NOT NULL THEN 'Class labels:' || E'\n\n'|| vi.classlabels
      END
    )
  ) AS description,
  REPLACE(
    REPLACE(LOWER(area), ' ', '_'),
    'physical_science',
    'physics_and_chemistry'
  )::dataset_subject_area AS subject_area,
  numinstances AS instance_count,
  numfeatures AS feature_count,
  COALESCE(graphics, '') <> '' AS has_graphics,
  COALESCE(isavailablepython, FALSE) AS is_available_python,
  numhits AS view_count,
  numdownloads AS download_count,
  slug,
  userid AS user_id,
  CURRENT_TIMESTAMP AS updated_at,
  COALESCE(
    (
      SELECT
        ARRAY_AGG(x::dataset_characteristic)
      FROM
        UNNEST(STRING_TO_ARRAY(LOWER(dd.types), ', ')) x
      WHERE
        x = ANY (ENUM_RANGE(NULL::dataset_characteristic)::TEXT[])
    ),
    '{}'
  ) AS data_types,
  COALESCE(
    (
      SELECT
        ARRAY_AGG(x::dataset_task)
      FROM
        UNNEST(STRING_TO_ARRAY(LOWER(dd.task), ', ')) x
      WHERE
        x = ANY (ENUM_RANGE(NULL::dataset_task)::TEXT[])
    ),
    '{}'
  ) AS tasks,
  COALESCE(
    (
      SELECT
        ARRAY_AGG(x::dataset_feature_type)
      FROM
        UNNEST(
          STRING_TO_ARRAY(
            LOWER(REPLACE(dd.featuretypes, 'Real', 'Continuous')),
            ', '
          )
        ) x
      WHERE
        x = ANY (ENUM_RANGE(NULL::dataset_feature_type)::TEXT[])
    ),
    '{}'
  ) AS feature_types,
  REGEXP_REPLACE(TRIM(doi), '^https?://doi.org/', '') AS doi,
  urllink AS external_link,
  (
    SELECT
      COUNT(*)
    FROM
      dataset_file df
      INNER JOIN file_info fi ON fi.id = df.fileinfoid
    WHERE
      fi.datasetid = dd.id
  ) AS file_count,
  (
    SELECT
      compressedsize
    FROM
      file_info fi
    WHERE
      fi.datasetid = dd.id
  ) AS compressed_size,
  (
    SELECT
      uncompressedsize
    FROM
      file_info fi
    WHERE
      fi.datasetid = dd.id
  ) AS uncompressed_size
FROM
  donated_datasets dd
  INNER JOIN descriptive_questions dq ON dd.id = dq.datasetid
  LEFT JOIN variable_info vi ON dd.id = vi.datasetid
WHERE
  slug NOTNULL LOOP

BEGIN
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
    data_types,
    tasks,
    feature_types,
    doi,
    external_link,
    file_count,
    compressed_size,
    uncompressed_size
  )
VALUES
  (
    rec.id,
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
    CASE WHEN rec.external_link IS NOT NULL THEN NULL ELSE rec.file_count END,
    CASE WHEN rec.external_link IS NOT NULL THEN NULL ELSE rec.compressed_size END,
    CASE WHEN rec.external_link IS NOT NULL THEN NULL ELSE rec.uncompressed_size END
  );

EXCEPTION WHEN OTHERS THEN
  IF rec.status = 'approved' THEN
    RAISE NOTICE 'Skipping dataset id: %, status: %, error: %',
      rec.id, rec.status, SQLERRM;
  END IF;
END;

END LOOP;

END;
$$;

DROP TABLE descriptive_questions;

-------------------------------------------------------------------------------
-- variable
-------------------------------------------------------------------------------
CREATE TABLE variable (
  id uuid DEFAULT gen_random_uuid () NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  role dataset_feature_role NOT NULL,
  type dataset_feature_type NOT NULL,
  missing_values BOOLEAN NOT NULL,
  units TEXT,
  dataset_id INTEGER NOT NULL CONSTRAINT variable_dataset_id_dataset_id_fk REFERENCES dataset
);

INSERT INTO
  variable (
    id,
    name,
    description,
    role,
    type,
    missing_values,
    units,
    dataset_id
  )
SELECT
  gen_random_uuid (),
  TRIM(name),
  NULLIF(TRIM(variables.description), ''),
  (
    CASE
      WHEN NOT (
        LOWER(TRIM(role)) = ANY (ENUM_RANGE(NULL::dataset_feature_role)::TEXT[])
      ) THEN 'feature'
      ELSE LOWER(TRIM(role))
    END
  )::dataset_feature_role,
  (
    CASE
      WHEN NOT (
        LOWER(TRIM(type)) = ANY (ENUM_RANGE(NULL::dataset_feature_type)::TEXT[])
      ) THEN 'other'
      ELSE LOWER(TRIM(type))
    END
  )::dataset_feature_type,
  missingvalues,
  NULLIF(TRIM(units), ''),
  datasetid
FROM
  variables
  INNER JOIN dataset ON variables.datasetid = dataset.id
WHERE
  TRIM(name) != '';

DROP TABLE variables;

-------------------------------------------------------------------------------
-- creators + dataset_creators -> author
-------------------------------------------------------------------------------
CREATE TABLE "author" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid (),
  "dataset_id" INTEGER NOT NULL,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "institution" TEXT,
  "email" TEXT,
  CONSTRAINT "author_pkey" PRIMARY KEY ("id")
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

DELETE FROM author
WHERE
  author.dataset_id NOT IN (
    SELECT
      id
    FROM
      dataset
  );

ALTER TABLE "author"
ADD CONSTRAINT "author_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "dataset" ("id") ON DELETE no action ON UPDATE no action;

-------------------------------------------------------------------------------
-- dataset_keyword + keyword
-------------------------------------------------------------------------------
ALTER TABLE keywords
RENAME TO keyword;

ALTER TABLE keyword
RENAME COLUMN keyword TO name;

ALTER TABLE keyword
ADD COLUMN created_at TIMESTAMP DEFAULT NOW() NOT NULL;

DROP INDEX idx_16518_keyword;

ALTER INDEX idx_16518_primary
RENAME TO keyword_pkey;

DROP INDEX idx_16445_datasetid;

DROP INDEX idx_16445_keywordsid;

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
ADD CONSTRAINT dataset_keywords_ibfk_2_tmp FOREIGN KEY (keyword_id) REFERENCES keyword (id) ON UPDATE CASCADE ON DELETE CASCADE;

-- noinspection SqlResolve
DELETE FROM keyword
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      dataset_keyword
      INNER JOIN public.dataset d ON d.id = dataset_keyword.dataset_id
    WHERE
      dataset_keyword.keyword_id = keyword.id
      AND d.status = 'approved'
  );

UPDATE keyword
SET
  name = TRIM(name);

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
CREATE TABLE "paper" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "title" TEXT NOT NULL,
  "authors" TEXT[] NOT NULL,
  "venue" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "citation_count" INTEGER,
  "url" TEXT NOT NULL,
  "dataset_id" INTEGER NOT NULL
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
  INNER JOIN native_papers np ON dp.nativepaperid = np.id
  INNER JOIN donated_datasets dd ON dd.intropaperid = dp.datasetpapersid
WHERE
  dd.status = 'APPROVED'
  AND np.url IS NOT NULL;

DROP TABLE papers;

DELETE FROM paper
WHERE
  paper.dataset_id NOT IN (
    SELECT
      id
    FROM
      dataset
  );

ALTER TABLE "paper"
ADD CONSTRAINT "paper_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES dataset ("id") ON DELETE no action ON UPDATE no action;

-------------------------------------------------------------------------------
-- dataset bookmarks
-------------------------------------------------------------------------------
CREATE TABLE "bookmark" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "user_id" uuid NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "bookmark_user_id_dataset_id_unique" UNIQUE ("user_id", "dataset_id")
);

-------------------------------------------------------------------------------
-- dataset materialized view
-------------------------------------------------------------------------------
-- noinspection SqlResolve @ column/"keyword_id"
-- noinspection SqlResolve @ column/"dataset_id"
CREATE MATERIALIZED VIEW "public"."dataset_view" AS (
  SELECT
    "dataset"."id",
    "dataset"."title",
    "dataset"."year_created",
    "dataset"."subtitle",
    "dataset"."doi",
    "dataset"."description",
    "dataset"."subject_area",
    "dataset"."instance_count",
    "dataset"."feature_count",
    "dataset"."has_graphics",
    "dataset"."is_available_python",
    "dataset"."external_link",
    "dataset"."slug",
    "dataset"."status",
    "dataset"."view_count",
    "dataset"."download_count",
    "dataset"."data_types",
    "dataset"."tasks",
    "dataset"."feature_types",
    "dataset"."compressed_size",
    "dataset"."uncompressed_size",
    "dataset"."file_count",
    "dataset"."user_id",
    "dataset"."donated_at",
    "dataset"."updated_at",
    COALESCE(
      (
        SELECT
          ARRAY_AGG("keyword"."name"::TEXT)
        FROM
          "keyword"
          JOIN "dataset_keyword" ON "dataset_keyword"."keyword_id" = "keyword"."id"
        WHERE
          "dataset_keyword"."dataset_id" = "dataset"."id"
      ),
      ARRAY[]::TEXT[]
    ) AS "keywords",
    COALESCE(
      (
        SELECT
          ARRAY_AGG(
            JSONB_BUILD_OBJECT(
              'id',
              "author"."id",
              'firstName',
              "author"."first_name",
              'lastName',
              "author"."last_name",
              'email',
              "author"."email",
              'institution',
              "author"."institution"
            )
          )
        FROM
          "author"
        WHERE
          "author"."dataset_id" = "dataset"."id"
      ),
      ARRAY[]::JSONB[]
    ) AS "authors",
    COALESCE(
      (
        SELECT
          ARRAY_AGG(
            JSONB_BUILD_OBJECT(
              'id',
              "variable"."id",
              'name',
              "variable"."name",
              'description',
              "variable"."description",
              'role',
              "variable"."role",
              'type',
              "variable"."type",
              'missingValues',
              "variable"."missing_values",
              'units',
              "variable"."units"
            )
          )
        FROM
          "variable"
        WHERE
          "variable"."dataset_id" = "dataset"."id"
      ),
      ARRAY[]::JSONB[]
    ) AS "variables",
    COALESCE(
      (
        SELECT
          ARRAY_AGG(LOWER("variable"."name"))
        FROM
          "variable"
        WHERE
          "variable"."dataset_id" = "dataset"."id"
      ),
      ARRAY[]::TEXT[]
    ) AS "variable_names",
    (
      SELECT
        JSONB_BUILD_OBJECT(
          'id',
          "user"."id",
          'name',
          "user"."name",
          'email',
          "user"."email",
          'emailVerified',
          "user"."email_verified",
          'image',
          "user"."image",
          'role',
          "user"."role",
          'createdAt',
          "user"."created_at"
        )
      FROM
        "user"
      WHERE
        "user"."id" = "dataset"."user_id"
    ) AS "user",
    (
      SELECT
        JSONB_BUILD_OBJECT(
          'title',
          "paper"."title",
          'authors',
          "paper"."authors",
          'venue',
          "paper"."venue",
          'year',
          "paper"."year",
          'citationCount',
          "paper"."citation_count",
          'url',
          "paper"."url",
          'datasetId',
          "paper"."dataset_id"
        )
      FROM
        "paper"
      WHERE
        "paper"."dataset_id" = "dataset"."id"
    ) AS "introductory_paper"
  FROM
    "dataset"
    LEFT JOIN "paper" ON "dataset"."id" = "paper"."dataset_id"
    LEFT JOIN "author" ON "dataset"."id" = "author"."dataset_id"
    LEFT JOIN "variable" ON "dataset"."id" = "variable"."dataset_id"
    LEFT JOIN "dataset_keyword" ON "dataset"."id" = "dataset_keyword"."dataset_id"
  GROUP BY
    "dataset"."id"
)
WITH
  DATA;

CREATE UNIQUE INDEX dataset_view_id_index ON dataset_view (id);

CREATE INDEX dataset_view_view_count_index ON dataset_view (view_count);

CREATE INDEX dataset_view_donated_at_index ON dataset_view (donated_at);

CREATE INDEX dataset_view_instance_count_index ON dataset_view (instance_count);

CREATE INDEX dataset_view_feature_count_index ON dataset_view (feature_count);

CREATE INDEX dataset_view_trgm_search_index ON dataset_view USING gin (title gin_trgm_ops);

CREATE INDEX dataset_view_keywords_index ON dataset_view USING gin (keywords);

CREATE INDEX dataset_view_variable_names_index ON dataset_view USING gin (variable_names);

CREATE INDEX dataset_view_status_index ON dataset_view (status);

-------------------------------------------------------------------------------
-- discussion
-------------------------------------------------------------------------------
CREATE TABLE "dataset_report" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  "reason" "dataset_report_reason" NOT NULL,
  "details" TEXT NOT NULL,
  "user_id" uuid,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE "discussion" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "user_id" uuid NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  "upvote_count" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP
);

CREATE TABLE "discussion_comment" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "content" TEXT NOT NULL,
  "user_id" uuid NOT NULL,
  "discussion_id" uuid NOT NULL,
  "upvote_count" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP
);

CREATE TABLE "discussion_comment_report" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "comment_id" uuid NOT NULL,
  "reason" "discussion_report_reason" NOT NULL,
  "details" TEXT,
  "user_id" uuid,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE "discussion_comment_upvote" (
  "user_id" uuid NOT NULL,
  "comment_id" uuid NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "discussion_comment_upvote_user_id_comment_id_pk" PRIMARY KEY ("user_id", "comment_id")
);

CREATE TABLE "discussion_report" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "discussion_id" uuid NOT NULL,
  "reason" "discussion_report_reason" NOT NULL,
  "details" TEXT,
  "user_id" uuid,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE "discussion_upvote" (
  "user_id" uuid NOT NULL,
  "discussion_id" uuid NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "discussion_upvote_user_id_discussion_id_pk" PRIMARY KEY ("user_id", "discussion_id")
);

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

CREATE TABLE "email_verification_token" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "user_id" uuid NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL
);

ALTER TABLE "email_verification_token"
ADD CONSTRAINT "email_verification_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE cascade ON UPDATE no action;

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
-- Remaining constraints
-------------------------------------------------------------------------------
-- noinspection SqlResolve
ALTER TABLE "bookmark"
ADD CONSTRAINT "bookmark_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE no action ON UPDATE no action;

-- noinspection SqlResolve
ALTER TABLE "bookmark"
ADD CONSTRAINT "bookmark_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset" ("id") ON DELETE no action ON UPDATE no action;

-- noinspection SqlResolve
ALTER TABLE "dataset"
ADD CONSTRAINT "dataset_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE no action ON UPDATE no action;

-- noinspection SqlResolve
ALTER TABLE "dataset_report"
ADD CONSTRAINT "dataset_report_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset" ("id") ON DELETE no action ON UPDATE no action;

-- noinspection SqlResolve
ALTER TABLE "discussion_upvote"
ADD CONSTRAINT "discussion_upvote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE no action ON UPDATE no action;

-- noinspection SqlResolve
ALTER TABLE "discussion_upvote"
ADD CONSTRAINT "discussion_upvote_discussion_id_discussion_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussion" ("id") ON DELETE cascade ON UPDATE no action;

-- noinspection SqlResolve
ALTER TABLE "session"
ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE cascade ON UPDATE no action;

CREATE INDEX "discussion_trgm_search_index" ON "discussion" USING gin ("title" gin_trgm_ops);

CREATE INDEX "keyword_name_index" ON "keyword" USING btree ("name");

CREATE INDEX "keyword_status_index" ON "keyword" USING btree ("status");

-------------------------------------------------------------------------------
-- CLEANUP
-------------------------------------------------------------------------------
DROP TABLE dataset_notes;

DROP TABLE dataset_file;

DROP TABLE variable_info;

DROP TABLE file_info;

DROP TABLE donated_datasets;

DROP TABLE dataset_papers CASCADE;

DROP TABLE native_papers CASCADE;

DROP TABLE foreign_papers CASCADE;

DROP TABLE datasets_legacy;

DROP SEQUENCE users_id_seq CASCADE;

DROP SEQUENCE keywords_id_seq;

DROP TYPE dataset_papers_type CASCADE;

DROP TYPE edits_status CASCADE;

DROP TYPE requests_status CASCADE;

-- --> statement-breakpoint
-- CREATE INDEX dataset_view_text_search_index ON dataset_view USING gin (
--   SETWEIGHT(
--     TO_TSVECTOR('simple'::regconfig, title),
--     'A'::"char"
--   )
-- );
--
-- --> statement-breakpoint
-- CREATE UNIQUE INDEX dataset_view_id_index ON dataset_view (id);
--
-- --> statement-breakpoint
-- CREATE INDEX dataset_view_view_count_index ON dataset_view (view_count);
--
-- --> statement-breakpoint
-- CREATE INDEX dataset_view_donated_at_index ON dataset_view (donated_at);
--
-- --> statement-breakpoint
-- CREATE INDEX dataset_view_instance_count_index ON dataset_view (instance_count);
--
-- --> statement-breakpoint
-- CREATE INDEX dataset_view_feature_count_index ON dataset_view (feature_count);
--
-- --> statement-breakpoint
-- CREATE INDEX dataset_view_trgm_search_index ON dataset_view USING gin (title gin_trgm_ops);
--
-- --> statement-breakpoint
-- CREATE INDEX dataset_view_keywords_index ON dataset_view USING gin (keywords);
--
-- --> statement-breakpoint
-- CREATE INDEX dataset_view_variable_names_index ON dataset_view USING gin (variable_names);
--
-- --> statement-breakpoint
-- CREATE INDEX dataset_view_status_index ON dataset_view (status);

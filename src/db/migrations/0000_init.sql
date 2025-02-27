CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TYPE "public"."approval_status" AS ENUM('draft', 'pending', 'approved', 'rejected');

--> statement-breakpoint
CREATE TYPE "public"."dataset_characteristic" AS ENUM(
  'tabular',
  'sequential',
  'multivariate',
  'time_series',
  'text',
  'image',
  'spatiotemporal'
);

--> statement-breakpoint
CREATE TYPE "public"."dataset_feature_role" AS ENUM('id', 'feature', 'target', 'other');

--> statement-breakpoint
CREATE TYPE "public"."dataset_feature_type" AS ENUM(
  'categorical',
  'integer',
  'continuous',
  'binary',
  'text',
  'date',
  'other'
);

--> statement-breakpoint
CREATE TYPE "public"."dataset_report_reason" AS ENUM(
  'missing_files_or_data',
  'inaccurate_metadata',
  'other'
);

--> statement-breakpoint
CREATE TYPE "public"."dataset_subject_area" AS ENUM(
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

--> statement-breakpoint
CREATE TYPE "public"."dataset_task" AS ENUM('classification', 'regression', 'clustering');

--> statement-breakpoint
CREATE TYPE "public"."discussion_report_reason" AS ENUM(
  'spam',
  'unprofessional',
  'inappropriate',
  'other'
);

--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'librarian', 'curator', 'basic');

--> statement-breakpoint
CREATE TABLE "account" (
  "user_id" uuid NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "provider_account_id" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT
);

--> statement-breakpoint
CREATE TABLE "author" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "email" TEXT,
  "institution" TEXT,
  "dataset_id" INTEGER
);

--> statement-breakpoint
CREATE TABLE "bookmark" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "user_id" uuid NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "bookmark_user_id_dataset_id_unique" UNIQUE ("user_id", "dataset_id")
);

--> statement-breakpoint
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
  "size" BIGINT,
  "file_count" INTEGER,
  "user_id" uuid DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
  "donated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
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
        AND "dataset"."size" IS NOT NULL
        AND "dataset"."file_count" IS NOT NULL
      )
      OR (
        "dataset"."external_link" IS NOT NULL
        AND "dataset"."external_link" ~* '^https?://'
        AND "dataset"."size" IS NULL
        AND "dataset"."file_count" IS NULL
      )
    )
  ),
  CONSTRAINT "files_exist_parity" CHECK (
    (
      "dataset"."file_count" IS NULL
      AND "dataset"."size" IS NULL
    )
    OR (
      "dataset"."file_count" IS NOT NULL
      AND "dataset"."size" IS NOT NULL
    )
  )
);

--> statement-breakpoint
CREATE TABLE "dataset_keyword" (
  "keyword_id" uuid NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  CONSTRAINT "dataset_keyword_keyword_id_dataset_id_pk" PRIMARY KEY ("keyword_id", "dataset_id")
);

--> statement-breakpoint
CREATE TABLE "dataset_report" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  "reason" "dataset_report_reason" NOT NULL,
  "details" TEXT NOT NULL,
  "user_id" uuid,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

--> statement-breakpoint
CREATE TABLE "dataset_view" (
  "id" INTEGER PRIMARY KEY NOT NULL,
  "title" TEXT NOT NULL,
  "year_created" INTEGER,
  "subtitle" TEXT,
  "doi" TEXT,
  "description" TEXT,
  "subject_area" "dataset_subject_area",
  "instance_count" INTEGER,
  "feature_count" INTEGER,
  "has_graphics" BOOLEAN NOT NULL,
  "is_available_python" BOOLEAN NOT NULL,
  "external_link" TEXT,
  "slug" TEXT NOT NULL,
  "status" "approval_status" NOT NULL,
  "view_count" INTEGER NOT NULL,
  "download_count" INTEGER NOT NULL,
  "data_types" "dataset_characteristic" [],
  "tasks" "dataset_task" [],
  "feature_types" "dataset_feature_type" [],
  "size" BIGINT,
  "file_count" INTEGER,
  "user_id" uuid NOT NULL,
  "donated_at" TIMESTAMP NOT NULL,
  "keywords" TEXT[] NOT NULL,
  "authors" JSONB[] NOT NULL,
  "variables" JSONB[] NOT NULL,
  "variable_names" TEXT[] NOT NULL,
  "user" JSONB NOT NULL,
  "introductory_paper" JSONB
);

--> statement-breakpoint
CREATE OR REPLACE FUNCTION refresh_dataset_view ("source_dataset_id" INTEGER DEFAULT NULL) RETURNS void AS $$
BEGIN
WITH
  "computed" AS (
    SELECT
      "d"."id",
      "d"."title",
      "d"."year_created",
      "d"."subtitle",
      "d"."doi",
      "d"."description",
      "d"."subject_area",
      "d"."instance_count",
      "d"."feature_count",
      "d"."has_graphics",
      "d"."is_available_python",
      "d"."external_link",
      "d"."slug",
      "d"."status",
      "d"."view_count",
      "d"."download_count",
      "d"."data_types",
      "d"."tasks",
      "d"."feature_types",
      "d"."size",
      "d"."file_count",
      "d"."user_id",
      "d"."donated_at",
      COALESCE(
        (
          SELECT
            ARRAY_AGG("k"."name")
          FROM
            "keyword" "k"
            JOIN "dataset_keyword" "dk" ON "dk"."keyword_id" = "k"."id"
          WHERE
            "dk"."dataset_id" = "d"."id"
        ),
        ARRAY[]::TEXT[]
      ) AS "keywords",
      COALESCE(
        (
          SELECT
            ARRAY_AGG(
              JSONB_BUILD_OBJECT(
                'id',
                "a"."id",
                'firstName',
                "a"."first_name",
                'lastName',
                "a"."last_name",
                'email',
                "a"."email",
                'institution',
                "a"."institution"
              )
            )
          FROM
            "author" "a"
          WHERE
            "a"."dataset_id" = "d"."id"
        ),
        ARRAY[]::JSONB[]
      ) AS "authors",
      COALESCE(
        (
          SELECT
            ARRAY_AGG(
              JSONB_BUILD_OBJECT(
                'id',
                "v"."id",
                'name',
                "v"."name",
                'description',
                "v"."description",
                'role',
                "v"."role",
                'type',
                "v"."type",
                'missingValues',
                "v"."missing_values",
                'units',
                "v"."units"
              )
            )
          FROM
            "variable" "v"
          WHERE
            "v"."dataset_id" = "d"."id"
        ),
        ARRAY[]::JSONB[]
      ) AS "variables",
      COALESCE(
        (
          SELECT
            ARRAY_AGG(LOWER("v"."name"))
          FROM
            "variable" "v"
          WHERE
            "v"."dataset_id" = "d"."id"
        ),
        ARRAY[]::TEXT[]
      ) AS "variable_names",
      (
        SELECT
          JSONB_BUILD_OBJECT(
            'id',
            "u"."id",
            'name',
            "u"."name",
            'email',
            "u"."email",
            'emailVerified',
            "u"."email_verified",
            'image',
            "u"."image",
            'role',
            "u"."role",
            'createdAt',
            "u"."created_at"
          )
        FROM
          "user" "u"
        WHERE
          "u"."id" = "d"."user_id"
      ) AS "user",
      (
        SELECT
          JSONB_BUILD_OBJECT(
            'title',
            "p"."title",
            'authors',
            "p"."authors",
            'venue',
            "p"."venue",
            'year',
            "p"."year",
            'citationCount',
            "p"."citation_count",
            'url',
            "p"."url",
            'datasetId',
            "p"."dataset_id"
          )
        FROM
          "paper" "p"
        WHERE
          "p"."dataset_id" = "d"."id"
      ) AS "introductory_paper"
    FROM
      "dataset" "d"
    WHERE
      (
        "source_dataset_id" IS NULL
        OR "d"."id" = "source_dataset_id"
      )
  )
INSERT INTO
  "dataset_view" (
    "id",
    "title",
    "year_created",
    "subtitle",
    "doi",
    "description",
    "subject_area",
    "instance_count",
    "feature_count",
    "has_graphics",
    "is_available_python",
    "external_link",
    "slug",
    "status",
    "view_count",
    "download_count",
    "data_types",
    "tasks",
    "feature_types",
    "size",
    "file_count",
    "user_id",
    "donated_at",
    "keywords",
    "authors",
    "variables",
    "variable_names",
    "user",
    "introductory_paper"
  )
SELECT
  "id",
  "title",
  "year_created",
  "subtitle",
  "doi",
  "description",
  "subject_area",
  "instance_count",
  "feature_count",
  "has_graphics",
  "is_available_python",
  "external_link",
  "slug",
  "status",
  "view_count",
  "download_count",
  "data_types",
  "tasks",
  "feature_types",
  "size",
  "file_count",
  "user_id",
  "donated_at",
  "keywords",
  "authors",
  "variables",
  "variable_names",
  "user",
  "introductory_paper"
FROM
  "computed"
ON CONFLICT ("id") DO UPDATE
SET
  (
    "title",
    "year_created",
    "subtitle",
    "doi",
    "description",
    "subject_area",
    "instance_count",
    "feature_count",
    "has_graphics",
    "is_available_python",
    "external_link",
    "slug",
    "status",
    "view_count",
    "download_count",
    "data_types",
    "tasks",
    "feature_types",
    "size",
    "file_count",
    "user_id",
    "donated_at",
    "keywords",
    "authors",
    "variables",
    "variable_names",
    "user",
    "introductory_paper"
  ) = (
    EXCLUDED."title",
    EXCLUDED."year_created",
    EXCLUDED."subtitle",
    EXCLUDED."doi",
    EXCLUDED."description",
    EXCLUDED."subject_area",
    EXCLUDED."instance_count",
    EXCLUDED."feature_count",
    EXCLUDED."has_graphics",
    EXCLUDED."is_available_python",
    EXCLUDED."external_link",
    EXCLUDED."slug",
    EXCLUDED."status",
    EXCLUDED."view_count",
    EXCLUDED."download_count",
    EXCLUDED."data_types",
    EXCLUDED."tasks",
    EXCLUDED."feature_types",
    EXCLUDED."size",
    EXCLUDED."file_count",
    EXCLUDED."user_id",
    EXCLUDED."donated_at",
    EXCLUDED."keywords",
    EXCLUDED."authors",
    EXCLUDED."variables",
    EXCLUDED."variable_names",
    EXCLUDED."user",
    EXCLUDED."introductory_paper"
  );

END;
$$ LANGUAGE plpgsql;

--> statement-breakpoint
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

--> statement-breakpoint
CREATE TABLE "discussion_comment" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "content" TEXT NOT NULL,
  "user_id" uuid NOT NULL,
  "discussion_id" uuid NOT NULL,
  "upvote_count" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP
);

--> statement-breakpoint
CREATE TABLE "discussion_comment_report" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "comment_id" uuid NOT NULL,
  "reason" "discussion_report_reason" NOT NULL,
  "details" TEXT,
  "user_id" uuid,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

--> statement-breakpoint
CREATE TABLE "discussion_comment_upvote" (
  "user_id" uuid NOT NULL,
  "comment_id" uuid NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "discussion_comment_upvote_user_id_comment_id_pk" PRIMARY KEY ("user_id", "comment_id")
);

--> statement-breakpoint
CREATE TABLE "discussion_report" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "discussion_id" uuid NOT NULL,
  "reason" "discussion_report_reason" NOT NULL,
  "details" TEXT,
  "user_id" uuid,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

--> statement-breakpoint
CREATE TABLE "discussion_upvote" (
  "user_id" uuid NOT NULL,
  "discussion_id" uuid NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "discussion_upvote_user_id_discussion_id_pk" PRIMARY KEY ("user_id", "discussion_id")
);

--> statement-breakpoint
CREATE TABLE "email_verification_token" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "user_id" uuid NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP NOT NULL
);

--> statement-breakpoint
CREATE TABLE "keyword" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "status" "approval_status" NOT NULL,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

--> statement-breakpoint
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

--> statement-breakpoint
CREATE TABLE "password_reset_token" (
  "token" TEXT PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL,
  "expires" TIMESTAMP NOT NULL
);

--> statement-breakpoint
CREATE TABLE "session" (
  "session_token" TEXT PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL,
  "expires" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

--> statement-breakpoint
CREATE TABLE "user" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "email_verified" TIMESTAMP,
  "password" TEXT,
  "image" TEXT,
  "role" "user_role" DEFAULT 'basic' NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "user_email_unique" UNIQUE ("email")
);

--> statement-breakpoint
CREATE TABLE "variable" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
  "name" TEXT NOT NULL,
  "role" "dataset_feature_role" NOT NULL,
  "type" "dataset_feature_type" NOT NULL,
  "missing_values" BOOLEAN NOT NULL,
  "description" TEXT,
  "units" TEXT,
  "dataset_id" INTEGER NOT NULL
);

--> statement-breakpoint
ALTER TABLE "account"
ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "author"
ADD CONSTRAINT "author_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "bookmark"
ADD CONSTRAINT "bookmark_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "bookmark"
ADD CONSTRAINT "bookmark_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "dataset"
ADD CONSTRAINT "dataset_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE SET DEFAULT ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "dataset_keyword"
ADD CONSTRAINT "dataset_keyword_keyword_id_keyword_id_fk" FOREIGN KEY ("keyword_id") REFERENCES "public"."keyword" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "dataset_keyword"
ADD CONSTRAINT "dataset_keyword_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "dataset_report"
ADD CONSTRAINT "dataset_report_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "dataset_report"
ADD CONSTRAINT "dataset_report_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "dataset_view"
ADD CONSTRAINT "dataset_view_id_dataset_id_fk" FOREIGN KEY ("id") REFERENCES "public"."dataset" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion"
ADD CONSTRAINT "discussion_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion"
ADD CONSTRAINT "discussion_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion_comment"
ADD CONSTRAINT "discussion_comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion_comment"
ADD CONSTRAINT "discussion_comment_discussion_id_discussion_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussion" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion_comment_report"
ADD CONSTRAINT "discussion_comment_report_comment_id_discussion_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."discussion" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion_comment_report"
ADD CONSTRAINT "discussion_comment_report_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE SET NULL ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion_comment_upvote"
ADD CONSTRAINT "discussion_comment_upvote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion_comment_upvote"
ADD CONSTRAINT "discussion_comment_upvote_comment_id_discussion_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."discussion_comment" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion_report"
ADD CONSTRAINT "discussion_report_discussion_id_discussion_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussion" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion_report"
ADD CONSTRAINT "discussion_report_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE SET NULL ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion_upvote"
ADD CONSTRAINT "discussion_upvote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "discussion_upvote"
ADD CONSTRAINT "discussion_upvote_discussion_id_discussion_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussion" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "email_verification_token"
ADD CONSTRAINT "email_verification_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "paper"
ADD CONSTRAINT "paper_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "password_reset_token"
ADD CONSTRAINT "password_reset_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "session"
ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE cascade ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "variable"
ADD CONSTRAINT "variable_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
CREATE INDEX "dataset_view_view_count_index" ON "dataset_view" USING btree ("view_count");

--> statement-breakpoint
CREATE INDEX "dataset_view_donated_at_index" ON "dataset_view" USING btree ("donated_at");

--> statement-breakpoint
CREATE INDEX "dataset_view_instance_count_index" ON "dataset_view" USING btree ("instance_count");

--> statement-breakpoint
CREATE INDEX "dataset_view_feature_count_index" ON "dataset_view" USING btree ("feature_count");

--> statement-breakpoint
CREATE INDEX "dataset_view_trgm_search_index" ON "dataset_view" USING gin ("title" gin_trgm_ops);

--> statement-breakpoint
CREATE INDEX "dataset_view_keywords_index" ON "dataset_view" USING gin ("keywords");

--> statement-breakpoint
CREATE INDEX "dataset_view_variable_names_index" ON "dataset_view" USING gin ("variable_names");

--> statement-breakpoint
CREATE INDEX "dataset_view_status_index" ON "dataset_view" USING btree ("status");

--> statement-breakpoint
CREATE INDEX "discussion_trgm_search_index" ON "discussion" USING gin ("title" gin_trgm_ops);

--> statement-breakpoint
CREATE INDEX "keyword_trgm_search_index" ON "keyword" USING gin ("name" gin_trgm_ops);

--> statement-breakpoint
CREATE INDEX "keyword_name_index" ON "keyword" USING btree ("name");

--> statement-breakpoint
CREATE INDEX "keyword_status_index" ON "keyword" USING btree ("status");

--> statement-breakpoint
CREATE INDEX "user_role_index" ON "user" USING btree ("role");

--> statement-breakpoint
CREATE INDEX "user_email_trgm_search_index" ON "user" USING gin ("email" gin_trgm_ops);

--> statement-breakpoint
CREATE INDEX "user_name_trgm_search_index" ON "user" USING gin ("name" gin_trgm_ops);

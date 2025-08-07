CREATE EXTENSION pg_trgm;

--> statement-breakpoint
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
CREATE TYPE "public"."user_role" AS ENUM('admin', 'librarian', 'curator', 'basic');

--> statement-breakpoint
CREATE TABLE "account" (
  "id" UUID PRIMARY KEY NOT NULL,
  "account_id" TEXT NOT NULL,
  "provider_id" TEXT NOT NULL,
  "user_id" UUID NOT NULL,
  "access_token" TEXT,
  "refresh_token" TEXT,
  "id_token" TEXT,
  "access_token_expires_at" TIMESTAMP,
  "refresh_token_expires_at" TIMESTAMP,
  "scope" TEXT,
  "password" TEXT,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL
);

--> statement-breakpoint
CREATE TABLE "session" (
  "id" UUID PRIMARY KEY NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "token" TEXT NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "user_id" UUID NOT NULL,
  CONSTRAINT "session_token_unique" UNIQUE ("token")
);

--> statement-breakpoint
CREATE TABLE "verification" (
  "id" UUID PRIMARY KEY NOT NULL,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

--> statement-breakpoint
CREATE TABLE "dataset" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" TEXT NOT NULL,
  "year_created" INTEGER,
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
  "download_count" INTEGER,
  "data_types" "dataset_characteristic" [] DEFAULT '{}' NOT NULL,
  "tasks" "dataset_task" [] DEFAULT '{}' NOT NULL,
  "feature_types" "dataset_feature_type" [] DEFAULT '{}' NOT NULL,
  "size" BIGINT,
  "file_count" INTEGER,
  "user_id" UUID DEFAULT '00000000-0000-0000-0000-000000000000' NOT NULL,
  "donated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "keywords" TEXT[] DEFAULT '{}' NOT NULL,
  "attributes" TEXT[] DEFAULT '{}' NOT NULL,
  CONSTRAINT "dataset_slug_unique" UNIQUE ("slug"),
  CONSTRAINT "external_check" CHECK (
    (
      "dataset"."external_link" IS NULL
      AND "dataset"."download_count" IS NOT NULL
    )
    OR (
      "dataset"."external_link" IS NOT NULL
      AND "dataset"."external_link" ~* '^https?://'
      AND "dataset"."download_count" IS NULL
    )
  ),
  CONSTRAINT "approved_check" CHECK (
    (
      "dataset"."status" = 'draft'
      OR (
        "dataset"."year_created" IS NOT NULL
        AND "dataset"."instance_count" IS NOT NULL
        AND "dataset"."description" IS NOT NULL
        AND "dataset"."subject_area" IS NOT NULL
      )
    )
    AND (
      "dataset"."status" != 'approved'
      OR "dataset"."doi" IS NOT NULL
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
  "keyword_id" UUID NOT NULL,
  "dataset_id" INTEGER NOT NULL,
  CONSTRAINT "dataset_keyword_keyword_id_dataset_id_pk" PRIMARY KEY ("keyword_id", "dataset_id")
);

--> statement-breakpoint
CREATE TABLE "keyword" (
  "id" UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID() NOT NULL,
  "status" "approval_status" NOT NULL,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "keyword_name_unique" UNIQUE ("name")
);

--> statement-breakpoint
CREATE TABLE "user" (
  "id" UUID PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "email_verified" BOOLEAN DEFAULT FALSE NOT NULL,
  "image" TEXT,
  "role" "user_role" DEFAULT 'basic' NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT "user_email_unique" UNIQUE ("email")
);

--> statement-breakpoint
ALTER TABLE "account"
ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "session"
ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "dataset"
ADD CONSTRAINT "dataset_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE SET DEFAULT ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "dataset_keyword"
ADD CONSTRAINT "dataset_keyword_keyword_id_keyword_id_fk" FOREIGN KEY ("keyword_id") REFERENCES "public"."keyword" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint
ALTER TABLE "dataset_keyword"
ADD CONSTRAINT "dataset_keyword_dataset_id_dataset_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."dataset" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

--> statement-breakpoint
CREATE INDEX "dataset_view_view_count_index" ON "dataset" USING btree ("view_count");

--> statement-breakpoint
CREATE INDEX "dataset_view_donated_at_index" ON "dataset" USING btree ("donated_at");

--> statement-breakpoint
CREATE INDEX "dataset_view_instance_count_index" ON "dataset" USING btree ("instance_count");

--> statement-breakpoint
CREATE INDEX "dataset_view_feature_count_index" ON "dataset" USING btree ("feature_count");

--> statement-breakpoint
CREATE INDEX "dataset_view_status_index" ON "dataset" USING btree ("status");

--> statement-breakpoint
CREATE INDEX "dataset_view_keywords_index" ON "dataset" USING gin ("keywords");

--> statement-breakpoint
CREATE INDEX "dataset_view_attributes_index" ON "dataset" USING gin ("attributes");

--> statement-breakpoint
CREATE INDEX "dataset_view_trgm_search_index" ON "dataset" USING gin ("title" gin_trgm_ops);

--> statement-breakpoint
CREATE INDEX "keyword_trgm_search_index" ON "keyword" USING gin ("name" gin_trgm_ops);

--> statement-breakpoint
CREATE INDEX "keyword_name_index" ON "keyword" USING btree ("name");

--> statement-breakpoint
CREATE INDEX "keyword_status_index" ON "keyword" USING btree ("status");

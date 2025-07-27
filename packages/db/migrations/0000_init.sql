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
  CONSTRAINT "dataset_slug_unique" UNIQUE ("slug")
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

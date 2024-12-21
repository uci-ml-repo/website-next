ALTER TYPE users_role RENAME TO user_role;

CREATE TYPE "approval_status" AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE "dataset_area" AS ENUM ('biology', 'business', 'climate_and_environment', 'computer_science', 'education', 'engineering', 'games', 'health_and_medicine', 'law', 'physics_and_chemistry', 'social_science', 'other');

CREATE TYPE "dataset_task" AS ENUM ('classification', 'regression', 'clustering');

CREATE TYPE "dataset_characteristic" AS ENUM ('tabular', 'sequential', 'multivariate', 'time_series', 'text', 'image', 'spatiotemporal');

CREATE TYPE "feature_type" AS ENUM ('categorical', 'integer', 'real');

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

UPDATE users
SET email_verified = CURRENT_TIMESTAMP;

ALTER TABLE users
    ALTER COLUMN name SET NOT NULL,
    DROP COLUMN firstname,
    DROP COLUMN lastname,
    DROP COLUMN institution,
    DROP COLUMN address,
    DROP COLUMN resetpasswordexpiration,
    DROP COLUMN resetpasswordtoken,
    DROP COLUMN status,
    DROP COLUMN deletedat;

-------------------------------------------------------------------------------
-- datasets + donated_datasets -> datasets
-------------------------------------------------------------------------------

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
-- dataset_creators JOIN creators -> dataset_authors
-------------------------------------------------------------------------------


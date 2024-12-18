CREATE TYPE "user_role" AS ENUM ('admin', 'librarian', 'curator', 'basic');

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
DROP TABLE models;

DROP TABLE dataset_papers;
DROP TABLE native_papers;
DROP TABLE foreign_papers;
DROP TABLE papers;
DROP TABLE reviews;
DROP TABLE requests;
DROP TABLE tables;
DROP TABLE tabular;
DROP TABLE variables;
DROP TABLE variable_info;

DELETE
FROM auth_session;
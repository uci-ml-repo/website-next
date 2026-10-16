# Dataset donations

Signed-in users can create a private draft at `/contribute/donation/form` with a
title and description. Drafts appear in My datasets and can be edited in dataset
settings. Submitting saves the current edits and changes the existing approval
status to `pending` (displayed as “In review”); further donor edits are locked.

Review requires a subject area, creation year, instance count, and either an
uploaded ZIP archive or an external dataset URL. ZIP uploads support archives up
to 100 MB with at most 10,000 entries. Archives are downloaded as ZIPs; browsing
their contents online is not currently supported.

SST provisions a private `DatasetUploads` bucket and passes its name through
`DATASET_UPLOAD_BUCKET`. Uploads use short-lived signed URLs, validate the ZIP
directory, then copy to a separate key before attaching the archive to the draft.
Downloads use the existing dataset access checks. Unfinished uploads expire after
one day. The `0001_dataset_archive` migration adds the archive reference; apply it
before running the updated application locally. Deployed migrations use the
existing SST database migrator.

Run `pnpm --filter @apps/website test` for the donation workflow and ZIP validation
tests. They apply the database migrations to an isolated in-memory PostgreSQL
instance and mock object storage, without using AWS credentials or a deployed
database.

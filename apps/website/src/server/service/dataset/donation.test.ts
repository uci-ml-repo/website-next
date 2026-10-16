import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { after, before, mock, test } from "node:test";

import type { GetObjectCommand } from "@aws-sdk/client-s3";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { PGlite } from "@electric-sql/pglite";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import type { Session } from "@packages/auth";
import { Enums } from "@packages/db/enum";
import * as schema from "@packages/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";

import type { CreateDatasetDraft, DatasetDraftFields } from "@/server/types/dataset/donation";
import {
  createDatasetDraft,
  datasetArchiveUpload,
  datasetDraftFields,
  datasetReviewFields,
  MAX_DATASET_ARCHIVE_SIZE,
} from "@/server/types/dataset/donation";

const postgres = new PGlite({ extensions: { pg_trgm } });
const db = drizzle(postgres, { schema });
mock.module("@packages/db", { exports: { db } });

const objects = new Map<string, Buffer>();
const signingClient = new S3Client({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  requestChecksumCalculation: "WHEN_REQUIRED",
});
const storage = {
  config: signingClient.config,
  middlewareStack: signingClient.middlewareStack,
  async send(
    command: HeadObjectCommand | GetObjectCommand | CopyObjectCommand | DeleteObjectCommand,
  ) {
    const key = command.input.Key ?? "";
    if (command instanceof CopyObjectCommand) {
      const source = command.input.CopySource?.replace("test-uploads/", "") ?? "";
      const body = objects.get(source);
      assert.ok(body);
      assert.equal(command.input.CopySourceIfMatch, "test-etag");
      objects.set(key, Buffer.from(body));
      return {};
    }
    if (command instanceof DeleteObjectCommand) {
      objects.delete(key);
      return {};
    }
    const body = objects.get(key);
    assert.ok(body, `Missing test object: ${key}`);
    if (command instanceof HeadObjectCommand)
      return { ContentLength: body.length, ETag: "test-etag" };
    assert.equal(command.input.IfMatch, "test-etag");
    const range = command.input.Range?.match(/^bytes=(\d+)-(\d+)$/);
    assert.ok(range);
    return {
      Body: {
        transformToByteArray: async () => body.subarray(Number(range[1]), Number(range[2]) + 1),
      },
    };
  },
};
mock.module(new URL("../file/index.ts", import.meta.url), { exports: { s3: storage } });
process.env.DATASET_UPLOAD_BUCKET = "test-uploads";

const { datasetDonationService: donation } = await import("./donation");
const { fileUploadService: uploads } = await import("../file/upload");
const { datasetFindService: find } = await import("./find");
mock.module(new URL("../index.ts", import.meta.url), {
  exports: { service: { dataset: { donation, find } } },
});
const { datasetDonationRouter } = await import("../../trpc/router/dataset/donation");
const { datasetAccessProcedure } = await import("../../trpc/middleware/dataset");
const { router } = await import("../../trpc");
const accessRouter = router({ read: datasetAccessProcedure.query(({ ctx }) => ctx.dataset) });

const ownerId = "00000000-0000-4000-8000-000000000001";
const strangerId = "00000000-0000-4000-8000-000000000002";
const basics: CreateDatasetDraft = {
  title: "Research observations",
  description: "A research dataset.",
};
const fields: DatasetDraftFields = {
  ...basics,
  yearCreated: 2025,
  subjectArea: Enums.DatasetSubjectArea.BIOLOGY,
  instanceCount: 100,
  featureCount: 4,
  externalLink: null,
  citation: null,
  dataTypes: [Enums.DatasetDataType.TABULAR],
  tasks: [Enums.DatasetTask.CLASSIFICATION],
  featureTypes: [Enums.DatasetFeatureType.CONTINUOUS],
};

function hasCode(code: TRPCError["code"]) {
  return (error: unknown) => error instanceof TRPCError && error.code === code;
}

function sessionFor(id: string, role = Enums.UserRole.BASIC): Session {
  const now = new Date();
  return {
    user: {
      id,
      name: "Test user",
      email: "user@example.org",
      emailVerified: true,
      role,
      image: null,
      createdAt: now,
      updatedAt: now,
    },
    session: {
      id: "test-session",
      token: "test-token",
      userId: id,
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(now.getTime() + 60_000),
      ipAddress: null,
      userAgent: null,
    },
  };
}

before(async () => {
  const migrations = new URL("../../../../../../packages/db/migrations/", import.meta.url);
  await postgres.exec(await readFile(new URL("0000_init.sql", migrations), "utf8"));
  await postgres.exec(await readFile(new URL("0001_dataset_archive.sql", migrations), "utf8"));
  await db.insert(schema.user).values([
    { id: ownerId, name: "Owner", email: "owner@example.org" },
    { id: strangerId, name: "Other user", email: "other@example.org" },
  ]);
});
after(() => postgres.close());

test("creates an owned private draft with only the required basics and a unique stable URL", async () => {
  const first = await donation.create(ownerId, basics);
  const second = await donation.create(ownerId, basics);
  assert.equal(first.userId, ownerId);
  assert.equal(first.status, Enums.ApprovalStatus.DRAFT);
  assert.equal(first.downloadCount, 0);
  assert.equal(first.yearCreated, null);
  assert.equal(first.archiveKey, null);
  assert.notEqual(first.slug, second.slug);
  const saved = await donation.save(ownerId, first.id, { ...fields, title: "Renamed" });
  assert.equal(saved.title, "Renamed");
  assert.equal(saved.slug, first.slug);
});

test("the owner can save an incomplete draft and resume it from their datasets", async () => {
  const draft = await donation.create(ownerId, basics);
  const incomplete = { ...fields, yearCreated: null, subjectArea: null, instanceCount: null };
  const saved = await donation.save(ownerId, draft.id, incomplete);
  assert.equal(saved.status, Enums.ApprovalStatus.DRAFT);
  assert.equal(saved.subjectArea, null);
  assert.ok((await find.byUserId(ownerId)).some((value) => value.id === draft.id));
  assert.ok(!(await find.byUserId(strangerId)).some((value) => value.id === draft.id));
});

test("all donation mutations reject signed-out callers", async () => {
  const caller = datasetDonationRouter.createCaller({ session: null });
  await assert.rejects(caller.create(basics), hasCode("UNAUTHORIZED"));
  await assert.rejects(caller.save({ datasetId: 1, fields }), hasCode("UNAUTHORIZED"));
  await assert.rejects(
    caller.submit({ datasetId: 1, fields: datasetReviewFields.parse(fields) }),
    hasCode("UNAUTHORIZED"),
  );
});

test("another user cannot save or submit an owner's draft", async () => {
  const draft = await donation.create(ownerId, basics);
  await assert.rejects(donation.save(strangerId, draft.id, fields), hasCode("CONFLICT"));
  await assert.rejects(donation.submit(strangerId, draft.id, fields), hasCode("CONFLICT"));
  assert.equal((await find.simpleById(draft.id))?.title, basics.title);
});

test("private drafts cannot be read anonymously or by other users", async () => {
  const draft = await donation.create(ownerId, basics);
  const anonymous = accessRouter.createCaller({ session: null });
  await assert.rejects(anonymous.read({ datasetId: draft.id }), hasCode("UNAUTHORIZED"));
  const stranger = accessRouter.createCaller({ session: sessionFor(strangerId) });
  await assert.rejects(stranger.read({ datasetId: draft.id }), hasCode("FORBIDDEN"));
  const owner = accessRouter.createCaller({ session: sessionFor(ownerId) });
  assert.equal((await owner.read({ datasetId: draft.id })).id, draft.id);
  const reviewer = accessRouter.createCaller({
    session: sessionFor(strangerId, Enums.UserRole.CURATOR),
  });
  assert.equal((await reviewer.read({ datasetId: draft.id })).id, draft.id);
});

test("incomplete metadata and missing dataset files cannot enter review", async () => {
  const draft = await donation.create(ownerId, basics);
  await assert.rejects(
    donation.submit(ownerId, draft.id, { ...fields, yearCreated: null }),
    hasCode("BAD_REQUEST"),
  );
  await assert.rejects(donation.submit(ownerId, draft.id, fields), hasCode("BAD_REQUEST"));
  assert.equal((await find.simpleById(draft.id))?.status, Enums.ApprovalStatus.DRAFT);
});

test("submission saves current edits and enters review using persisted archive metadata", async () => {
  const draft = await donation.create(ownerId, basics);
  await db
    .update(schema.dataset)
    .set({ archiveKey: `datasets/${draft.id}/archive.zip`, fileCount: 2, size: 256 })
    .where(eq(schema.dataset.id, draft.id));
  const submitted = await donation.submit(ownerId, draft.id, {
    ...fields,
    title: "Updated before review",
  });
  assert.equal(submitted.title, "Updated before review");
  assert.equal(submitted.status, Enums.ApprovalStatus.PENDING);
  assert.equal(submitted.fileCount, 2);
  assert.equal(submitted.size, 256);
  await assert.rejects(donation.save(ownerId, draft.id, fields), hasCode("CONFLICT"));
  await assert.rejects(donation.submit(ownerId, draft.id, fields), hasCode("CONFLICT"));
});

test("external datasets enter review without local file metadata", async () => {
  const draft = await donation.create(ownerId, basics);
  const submitted = await donation.submit(ownerId, draft.id, {
    ...fields,
    externalLink: "https://example.org/data",
  });
  assert.equal(submitted.status, Enums.ApprovalStatus.PENDING);
  assert.equal(submitted.archiveKey, null);
  assert.equal(submitted.downloadCount, null);
  assert.equal(submitted.fileCount, null);
  assert.equal(submitted.size, null);
});

test("switching a hosted draft to an external source clears archive metadata", async () => {
  const draft = await donation.create(ownerId, basics);
  await db
    .update(schema.dataset)
    .set({ archiveKey: "datasets/archive.zip", fileCount: 1, size: 128 })
    .where(eq(schema.dataset.id, draft.id));
  const linked = await donation.save(ownerId, draft.id, {
    ...fields,
    externalLink: "https://example.org/data",
  });
  assert.equal(linked.archiveKey, null);
  assert.equal(linked.fileCount, null);
  assert.equal(linked.size, null);
  assert.equal(linked.downloadCount, null);
  const hosted = await donation.save(ownerId, draft.id, fields);
  assert.equal(hosted.downloadCount, 0);
  await assert.rejects(donation.submit(ownerId, draft.id, fields), hasCode("BAD_REQUEST"));
});

test("signed uploads bind the size and never sign an empty-body checksum", async () => {
  const draft = await donation.create(ownerId, basics);
  const upload = await uploads.start(ownerId, { datasetId: draft.id, name: "data.zip", size: 260 });
  const url = new URL(upload.url);
  assert.ok(url.searchParams.get("X-Amz-SignedHeaders")?.includes("content-length"));
  assert.equal(url.searchParams.has("x-amz-checksum-crc32"), false);
  assert.equal(url.searchParams.get("X-Amz-Expires"), "300");
  await assert.rejects(
    uploads.start(strangerId, { datasetId: draft.id, name: "data.zip", size: 260 }),
    hasCode("CONFLICT"),
  );
});

test("uploaded ZIP archives are validated, counted, and copied beyond the upload URL's reach", async () => {
  const draft = await donation.create(ownerId, basics);
  const upload = await uploads.start(ownerId, { datasetId: draft.id, name: "data.zip", size: 260 });
  const archive = Buffer.from(
    "UEsDBBQAAAAAAMoJUF2dKfu9EAAAABAAAAAOAAAAZGF0YS90cmFpbi5jc3Z2YWx1ZSxsYWJlbAoxLGEKUEsDBBQAAAAAAMoJUF2w1WOEEAAAABAAAAANAAAAZGF0YS90ZXN0LmNzdnZhbHVlLGxhYmVsCjIsYgpQSwECFAMUAAAAAADKCVBdnSn7vRAAAAAQAAAADgAAAAAAAAAAAAAAgAEAAAAAZGF0YS90cmFpbi5jc3ZQSwECFAMUAAAAAADKCVBdsNVjhBAAAAAQAAAADQAAAAAAAAAAAAAAgAE8AAAAZGF0YS90ZXN0LmNzdlBLBQYAAAAAAgACAHcAAAB3AAAAAAA=",
    "base64",
  );
  objects.set(upload.key, archive);
  const completed = await uploads.complete(ownerId, draft.id, upload.key);
  assert.equal(completed.fileCount, 2);
  assert.equal(completed.size, archive.length);
  assert.equal(completed.externalLink, null);
  assert.ok(completed.archiveKey?.startsWith(`datasets/${draft.id}/`));
  assert.notEqual(completed.archiveKey, upload.key);
  assert.equal(objects.has(upload.key), false);
  assert.deepEqual(objects.get(completed.archiveKey ?? ""), archive);
  const download = new URL(await uploads.download(completed));
  assert.equal(download.searchParams.get("X-Amz-Expires"), "60");
  await donation.submit(ownerId, draft.id, fields);
  await assert.rejects(uploads.complete(ownerId, draft.id, upload.key), hasCode("CONFLICT"));
});

test("invalid uploads never attach archive metadata to a draft", async () => {
  const draft = await donation.create(ownerId, basics);
  const key = `temporary/${draft.id}/00000000-0000-4000-8000-000000000001.zip`;
  objects.set(key, Buffer.alloc(100, "not a ZIP"));
  await assert.rejects(uploads.complete(ownerId, draft.id, key), hasCode("BAD_REQUEST"));
  await assert.rejects(uploads.complete(strangerId, draft.id, key), hasCode("CONFLICT"));
  await assert.rejects(
    uploads.complete(
      ownerId,
      draft.id,
      `temporary/${draft.id + 1}/00000000-0000-4000-8000-000000000001.zip`,
    ),
    hasCode("BAD_REQUEST"),
  );
  assert.equal((await find.simpleById(draft.id))?.archiveKey, null);
});

test("shared validation rejects blank basics, unsafe URLs, invalid counts, and oversize uploads", () => {
  assert.equal(createDatasetDraft.safeParse({ title: "   ", description: " " }).success, false);
  assert.equal(
    createDatasetDraft.parse({ title: " Example ", description: " Description " }).title,
    "Example",
  );
  assert.equal(
    datasetDraftFields.safeParse({ ...fields, externalLink: "javascript:alert(1)" }).success,
    false,
  );
  assert.equal(datasetDraftFields.safeParse({ ...fields, instanceCount: -1 }).success, false);
  assert.equal(datasetDraftFields.safeParse({ ...fields, featureCount: 1.5 }).success, false);
  assert.equal(
    datasetDraftFields.safeParse({ ...fields, yearCreated: new Date().getFullYear() + 1 }).success,
    false,
  );
  assert.equal(
    datasetArchiveUpload.safeParse({ datasetId: 1, name: "data.txt", size: 10 }).success,
    false,
  );
  assert.equal(
    datasetArchiveUpload.safeParse({
      datasetId: 1,
      name: "data.zip",
      size: MAX_DATASET_ARCHIVE_SIZE + 1,
    }).success,
    false,
  );
});

import { randomUUID } from "node:crypto";

import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { db } from "@packages/db";
import { dataset } from "@packages/db/schema";
import type { DatasetSelect } from "@packages/db/types";
import { TRPCError } from "@trpc/server";
import type { z } from "zod";

import { ownedDraftCondition } from "@/server/service/dataset/donation";
import { s3 } from "@/server/service/file";
import { countZipFiles, zipDirectoryLocation } from "@/server/service/file/zip";
import type { datasetArchiveUpload } from "@/server/types/dataset/donation";
import { MAX_DATASET_ARCHIVE_SIZE } from "@/server/types/dataset/donation";

function uploadBucket() {
  if (!process.env.DATASET_UPLOAD_BUCKET) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Dataset uploads are not configured",
    });
  }
  return process.env.DATASET_UPLOAD_BUCKET;
}

async function start(userId: string, input: z.infer<typeof datasetArchiveUpload>) {
  const draft = await db.query.dataset.findFirst({
    where: ownedDraftCondition(input.datasetId, userId),
  });
  if (!draft) {
    throw new TRPCError({ code: "CONFLICT", message: "Only your own drafts can receive uploads" });
  }

  const key = `temporary/${input.datasetId}/${randomUUID()}.zip`;
  const url = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: uploadBucket(),
      Key: key,
      ContentType: "application/zip",
      ContentLength: input.size,
    }),
    { expiresIn: 300 },
  );

  return { key, url };
}

async function complete(userId: string, datasetId: number, key: string) {
  if (!new RegExp(`^temporary/${datasetId}/[a-f0-9-]{36}\\.zip$`).test(key)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid dataset upload" });
  }

  const Bucket = uploadBucket();
  const ownedDraft = await db.query.dataset.findFirst({
    where: ownedDraftCondition(datasetId, userId),
  });
  if (!ownedDraft) {
    throw new TRPCError({ code: "CONFLICT", message: "Only your own drafts can receive uploads" });
  }

  const head = await s3.send(new HeadObjectCommand({ Bucket, Key: key }));
  const size = head.ContentLength ?? 0;
  if (size < 22 || size > MAX_DATASET_ARCHIVE_SIZE || !head.ETag) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Choose a valid ZIP archive up to 100 MB",
    });
  }

  async function readRange(range: string) {
    const result = await s3.send(
      new GetObjectCommand({ Bucket, Key: key, Range: range, IfMatch: head.ETag }),
    );
    if (!result.Body) throw new Error("Unable to read uploaded ZIP archive");
    return Buffer.from(await result.Body.transformToByteArray());
  }

  let fileCount: number;
  try {
    const tail = await readRange(`bytes=${Math.max(0, size - 65_557)}-${size - 1}`);
    const directory = zipDirectoryLocation(tail, size);
    const bytes = await readRange(
      `bytes=${directory.start}-${directory.start + directory.size - 1}`,
    );
    fileCount = countZipFiles(bytes, directory.entries);
  } catch (error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: error instanceof Error ? error.message : "Unable to validate the ZIP archive",
    });
  }

  // Copy to a new key so a still-valid upload URL cannot modify a submitted archive.
  const archiveKey = `datasets/${datasetId}/${randomUUID()}.zip`;
  await s3.send(
    new CopyObjectCommand({
      Bucket,
      Key: archiveKey,
      CopySource: `${Bucket}/${key}`,
      CopySourceIfMatch: head.ETag,
      ContentType: "application/zip",
      MetadataDirective: "REPLACE",
    }),
  );

  let updated: DatasetSelect;
  try {
    const results = await db
      .update(dataset)
      .set({
        archiveKey,
        size,
        fileCount,
        externalLink: null,
        downloadCount: 0,
      })
      .where(ownedDraftCondition(datasetId, userId))
      .returning();

    if (results.length === 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "The dataset is no longer an editable draft",
      });
    }
    updated = results[0];
  } catch (error) {
    await s3.send(new DeleteObjectCommand({ Bucket, Key: archiveKey })).catch(() => {});
    throw error;
  }

  await s3.send(new DeleteObjectCommand({ Bucket, Key: key })).catch(() => {});
  return updated;
}

async function download(current: DatasetSelect) {
  if (!current.archiveKey) {
    throw new TRPCError({ code: "NOT_FOUND", message: "No uploaded archive found" });
  }

  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: uploadBucket(),
      Key: current.archiveKey,
      ResponseContentDisposition: `attachment; filename="${current.slug}.zip"`,
    }),
    { expiresIn: 60 },
  );
}

export const fileUploadService = { start, complete, download };

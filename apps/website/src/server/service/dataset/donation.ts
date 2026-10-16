import { randomUUID } from "node:crypto";

import { db } from "@packages/db";
import { Enums } from "@packages/db/enum";
import { dataset } from "@packages/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import type { CreateDatasetDraft, DatasetDraftFields } from "@/server/types/dataset/donation";
import { datasetReviewFields } from "@/server/types/dataset/donation";

export function ownedDraftCondition(datasetId: number, userId: string) {
  return and(
    eq(dataset.id, datasetId),
    eq(dataset.userId, userId),
    eq(dataset.status, Enums.ApprovalStatus.DRAFT),
  );
}

function draftConflict(): never {
  throw new TRPCError({
    code: "CONFLICT",
    message: "This draft is no longer editable or does not belong to you. Refresh and try again.",
  });
}

async function create(userId: string, fields: CreateDatasetDraft) {
  const titleSlug = fields.title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);

  const [created] = await db
    .insert(dataset)
    .values({
      ...fields,
      userId,
      slug: `${titleSlug || "dataset"}-${randomUUID()}`,
      status: Enums.ApprovalStatus.DRAFT,
      downloadCount: 0,
    })
    .returning();

  return created;
}

async function save(userId: string, datasetId: number, fields: DatasetDraftFields) {
  const updated = await db
    .update(dataset)
    .set({
      ...fields,
      // A linked dataset has no locally hosted archive or download count.
      ...(fields.externalLink
        ? { archiveKey: null, size: null, fileCount: null, downloadCount: null }
        : { downloadCount: 0 }),
    })
    .where(ownedDraftCondition(datasetId, userId))
    .returning();

  if (updated.length === 0) return draftConflict();
  return updated[0];
}

async function submit(userId: string, datasetId: number, fields: DatasetDraftFields) {
  const result = datasetReviewFields.safeParse(fields);
  if (!result.success) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Complete the required dataset details" });
  }

  // Lock the draft while checking its persisted archive and moving it to review.
  return db.transaction(async (tx) => {
    const drafts = await tx
      .select()
      .from(dataset)
      .where(ownedDraftCondition(datasetId, userId))
      .for("update");

    if (drafts.length === 0) return draftConflict();
    const draft = drafts[0];

    if (!fields.externalLink && (!draft.fileCount || !draft.size)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Upload a dataset ZIP archive or provide an external dataset URL before review",
      });
    }

    const [submitted] = await tx
      .update(dataset)
      .set({
        ...result.data,
        status: Enums.ApprovalStatus.PENDING,
        ...(fields.externalLink
          ? { archiveKey: null, size: null, fileCount: null, downloadCount: null }
          : { downloadCount: 0 }),
      })
      .where(ownedDraftCondition(datasetId, userId))
      .returning();

    return submitted;
  });
}

export const datasetDonationService = { create, save, submit };

import { db } from "@packages/db";
import { bookmark, dataset } from "@packages/db/schema";
import { and, eq } from "drizzle-orm";

async function byUserId({ userId }: { userId: string }) {
  return db
    .select()
    .from(dataset)
    .innerJoin(bookmark, eq(bookmark.datasetId, dataset.id))
    .where(eq(bookmark.userId, userId));
}

async function isDatasetBookmarked({ userId, datasetId }: { userId: string; datasetId: number }) {
  const result = await db
    .select()
    .from(bookmark)
    .where(and(eq(bookmark.datasetId, datasetId), eq(bookmark.userId, userId)));

  return !!result.length;
}

export const bookmarkFindService = { byUserId, isDatasetBookmarked };

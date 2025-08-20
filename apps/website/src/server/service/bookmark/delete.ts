import { db } from "@packages/db";
import { bookmark } from "@packages/db/schema";
import { and, eq } from "drizzle-orm";

async function removeBookmark({ userId, datasetId }: { userId: string; datasetId: number }) {
  return db
    .delete(bookmark)
    .where(and(eq(bookmark.datasetId, datasetId), eq(bookmark.userId, userId)))
    .returning();
}

export const bookmarkDeleteService = { removeBookmark };

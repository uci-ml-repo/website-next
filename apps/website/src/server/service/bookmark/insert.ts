import { db } from "@packages/db";
import { bookmark } from "@packages/db/schema";

async function addBookmark({ userId, datasetId }: { userId: string; datasetId: number }) {
  return db.insert(bookmark).values({ userId, datasetId }).onConflictDoNothing().returning();
}

export const bookmarkInsertService = { addBookmark };

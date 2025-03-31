import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { bookmark } from "@/db/schema";

export namespace bookmarkRemoveService {
  export async function removeBookmark({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    return db
      .delete(bookmark)
      .where(and(eq(bookmark.datasetId, datasetId), eq(bookmark.userId, userId)));
  }
}

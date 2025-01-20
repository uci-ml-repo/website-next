import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { bookmark } from "@/db/schema";

export default class BookmarksRemoveService {
  async removeBookmark({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    return await db
      .delete(bookmark)
      .where(
        and(eq(bookmark.datasetId, datasetId), eq(bookmark.userId, userId)),
      );
  }
}

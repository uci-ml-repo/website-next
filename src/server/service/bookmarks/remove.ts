import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { bookmarks } from "@/db/schema";

export default class BookmarksRemoveService {
  async removeBookmark({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    const bookmark = await db
      .delete(bookmarks)
      .where(
        and(eq(bookmarks.datasetId, datasetId), eq(bookmarks.userId, userId)),
      );
    return bookmark;
  }
}

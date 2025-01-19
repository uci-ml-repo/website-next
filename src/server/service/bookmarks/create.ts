import { db } from "@/db";
import { bookmarks } from "@/db/schema";

export default class BookmarksCreateService {
  async addBookmark({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    const bookmark = await db.insert(bookmarks).values({
      datasetId,
      userId,
    });

    return bookmark;
  }
}

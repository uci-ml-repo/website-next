import { db } from "@/db";

export default class BookmarksFindService {
  async byUserId(userId: string) {
    const bookmarks = await db.query.bookmarks.findMany({
      where: (bookmarks, { eq }) => eq(bookmarks.userId, userId),
      with: {
        dataset: true,
      },
    });

    return bookmarks;
  }

  async isBookmarked({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    const bookmark = await db.query.bookmarks.findFirst({
      where: (bookmarks, { and, eq }) =>
        and(eq(bookmarks.datasetId, datasetId), eq(bookmarks.userId, userId)),
    });

    return !!bookmark;
  }
}

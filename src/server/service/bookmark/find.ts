import { db } from "@/db";

export default class BookmarkFindService {
  async byUserId(userId: string) {
    const bookmarks = await db.query.bookmark.findMany({
      where: (bookmark, { eq }) => eq(bookmark.userId, userId),
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
    const bookmark = await db.query.bookmark.findFirst({
      where: (bookmark, { and, eq }) =>
        and(eq(bookmark.datasetId, datasetId), eq(bookmark.userId, userId)),
    });

    return !!bookmark;
  }
}

import type { Session } from "next-auth";

import { db } from "@/db";
import type { BookmarkQuery } from "@/server/service/schema/bookmark";

export default class BookmarkFindService {
  async byUserQuery(query: BookmarkQuery, user: Session["user"]) {
    const bookmarks = await db.query.bookmark.findMany({
      where: (bookmark, { eq }) => eq(bookmark.userId, user.id),
      with: {
        dataset: {
          with: {
            datasetKeywords: { with: { keyword: true } },
            authors: true,
            introductoryPaper: true,
            variables: true,
            user: true,
          },
        },
      },
      limit: query.limit ? query.limit + 1 : undefined,
      offset: query.cursor ?? 0,
    });

    let nextCursor: number | undefined = undefined;
    if (query.limit && bookmarks.length > query.limit) {
      bookmarks.pop();
      nextCursor = (query.cursor ?? 0) + query.limit;
    }

    return { bookmarks, nextCursor };
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

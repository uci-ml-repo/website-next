import { and, desc, eq, sql } from "drizzle-orm";
import type { Session } from "next-auth";

import { db } from "@/db";
import { bookmark, dataset } from "@/db/schema";
import type { BookmarkQuery } from "@/server/service/schema/bookmark";

const DATASET_WEIGHTS = sql`(SETWEIGHT(TO_TSVECTOR('simple', ${dataset.title}), 'A'))`;

export default class BookmarkFindService {
  async batch(ids: string[]) {
    return db.query.bookmark.findMany({
      where: (bookmark, { inArray }) => inArray(bookmark.id, ids),
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
      orderBy: desc(bookmark.createdAt),
    });
  }

  async byUserQuery(query: BookmarkQuery, user: Session["user"]) {
    if (query.search) {
      return this.byUserSearchQuery(query, user);
    }

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
      orderBy: desc(bookmark.createdAt),
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

  private async byUserSearchQuery(query: BookmarkQuery, user: Session["user"]) {
    const tsQuery = sql`(PLAINTO_TSQUERY('simple', ${query.search ?? ""}))`;
    const normalizedTsQuery = sql`(CASE WHEN NUMNODE(${tsQuery}) > 0 THEN TO_TSQUERY('simple', ${tsQuery}::TEXT || ':*') ELSE '' END)`;
    const rank = sql`(TS_RANK(${DATASET_WEIGHTS}, ${normalizedTsQuery}))`;
    const trigramSimilarity = sql`(similarity(${dataset.title}, ${query.search}))`;

    const bookmarkIds = await db
      .select({
        id: bookmark.id,
        createdAt: bookmark.createdAt,
        rank: rank.mapWith(Number),
        similarity: trigramSimilarity.mapWith(Number),
      })
      .from(bookmark)
      .innerJoin(dataset, eq(bookmark.datasetId, dataset.id))
      .where(
        and(
          eq(bookmark.userId, user.id),
          query.search
            ? sql`((${DATASET_WEIGHTS} @@ ${normalizedTsQuery})
                      OR (similarity(${dataset.title}, ${query.search}) > 0.1))`
            : undefined,
        ),
      )
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 10)
      .orderBy((t) => [desc(t.rank), desc(t.similarity), desc(t.createdAt)]);

    const bookmarks = await this.batch(bookmarkIds.map(({ id }) => id));

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

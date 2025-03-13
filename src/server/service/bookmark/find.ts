import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  sql,
} from "drizzle-orm";
import type { Session } from "next-auth";

import { db } from "@/db";
import { datasetPreviewSelect } from "@/db/lib/types";
import { bookmark, dataset, datasetView } from "@/db/schema";
import type { BookmarkQuery } from "@/server/schema/bookmark";

export namespace bookmarkFindService {
  export async function batch(ids: string[]) {
    return db
      .select({
        bookmark: getTableColumns(bookmark),
        dataset: datasetPreviewSelect,
      })
      .from(bookmark)
      .where(inArray(bookmark.id, ids))
      .innerJoin(datasetView, eq(bookmark.datasetId, datasetView.id))
      .orderBy(desc(bookmark.createdAt));
  }

  export async function byUserQuery(
    query: BookmarkQuery,
    user: Session["user"],
  ) {
    let bookmarks;

    if (query.search) {
      bookmarks = await byUserSearchQuery(query, user);
    } else {
      bookmarks = await byUserRawQuery(query, user);
    }

    let nextCursor: number | undefined = undefined;
    if (query.limit && bookmarks.length > query.limit) {
      bookmarks.pop();
      nextCursor = (query.cursor ?? 0) + query.limit;
    }

    const [countQuery] = await db
      .select({ count: count() })
      .from(bookmark)
      .where(eq(bookmark.userId, user.id));

    return { bookmarks, nextCursor, count: countQuery.count };
  }

  async function byUserRawQuery(query: BookmarkQuery, user: Session["user"]) {
    return db
      .select({
        bookmark: getTableColumns(bookmark),
        dataset: datasetPreviewSelect,
      })
      .from(bookmark)
      .where(eq(bookmark.userId, user.id))
      .innerJoin(datasetView, eq(bookmark.datasetId, datasetView.id))
      .orderBy(desc(bookmark.createdAt))
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 11);
  }

  async function byUserSearchQuery(
    query: BookmarkQuery,
    user: Session["user"],
  ) {
    const trigramSimilarity = sql`
      similarity (
        ${dataset.title},
        ${query.search}
      )
    `;

    const bookmarkIds = await db
      .select({
        id: bookmark.id,
        createdAt: bookmark.createdAt,
        similarity: trigramSimilarity.mapWith(Number),
      })
      .from(bookmark)
      .innerJoin(dataset, eq(bookmark.datasetId, dataset.id))
      .where(
        and(
          eq(bookmark.userId, user.id),
          query.search
            ? sql`
                (
                  similarity (
                    ${dataset.title},
                    ${query.search}
                  ) > 0.1
                )
              `
            : undefined,
        ),
      )
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 10)
      .orderBy((t) => [desc(t.similarity), desc(t.createdAt)]);

    return batch(bookmarkIds.map(({ id }) => id));
  }

  export async function isBookmarked({
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

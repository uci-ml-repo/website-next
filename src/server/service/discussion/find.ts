import type { Session } from "@auth/core/types";
import { and, asc, count, desc, eq, getTableColumns, sql } from "drizzle-orm";

import { db } from "@/db";
import type {
  DatasetIdentificationSelect,
  DiscussionSelect,
  DiscussionUpvoteSelect,
  UserSelect,
} from "@/db/lib/types";
import {
  datasetIdentificationSelect,
  datasetIdentificationSelectColumns,
  userColumns,
  userSelect,
} from "@/db/lib/types";
import { datasetView, discussion, discussionUpvote, user } from "@/db/schema";
import type { DiscussionQuery } from "@/server/schema/discussion";
import { sortFunction } from "@/server/schema/lib/order";

function buildQuery(query: DiscussionQuery) {
  let conditions = [];

  if (query.datasetId) {
    conditions.push(eq(discussion.datasetId, query.datasetId));
  }

  if (query.userId) {
    conditions.push(eq(discussion.userId, query.userId));
  }

  return and(...conditions);
}

type RawDiscussion = DiscussionSelect & {
  user: UserSelect;
  dataset: DatasetIdentificationSelect;
  upvotes: DiscussionUpvoteSelect[] | DiscussionUpvoteSelect | null;
};

function transformRow({ upvotes, ...discussion }: RawDiscussion) {
  return {
    ...discussion,
    upvoted: Array.isArray(upvotes) ? upvotes.length > 0 : !!upvotes,
  };
}

export namespace discussionFindService {
  export async function byId(id: string, session?: Session | null) {
    return db.query.discussion
      .findFirst({
        where: (discussion, { eq }) => eq(discussion.id, id),
        with: {
          user: {
            columns: userColumns,
          },
          dataset: {
            columns: datasetIdentificationSelectColumns,
          },
          upvotes: session
            ? {
                where: (upvote, { eq }) => eq(upvote.userId, session.user.id),
              }
            : undefined,
        },
      })
      .then((discussion) => (discussion ? transformRow(discussion) : null));
  }

  export async function byQuery(query: DiscussionQuery, session?: Session | null) {
    let discussions;

    if (query.search) {
      discussions = await bySearchQuery(query, session);
    } else {
      discussions = await byRawQuery(query, session);
    }

    let nextCursor: number | undefined = undefined;
    if (query.limit && discussions.length > query.limit) {
      discussions.pop();
      nextCursor = (query.cursor ?? 0) + query.limit;
    }

    const [countQuery] = await db
      .select({ count: count() })
      .from(discussion)
      .where(buildQuery(query));

    return {
      discussions,
      count: countQuery.count,
      nextCursor,
    };
  }

  export async function countByQuery(query: DiscussionQuery) {
    const [countQuery] = await db
      .select({ count: count() })
      .from(discussion)
      .where(buildQuery(query));

    return countQuery.count;
  }

  async function byRawQuery(query: DiscussionQuery, session?: Session | null) {
    const orderBy = query.order
      ? Object.entries(query.order).map(([orderBy, sort]) =>
          sortFunction(sort)(discussion[orderBy as keyof typeof query.order]),
        )
      : [asc(discussion.createdAt)];

    return await db.query.discussion
      .findMany({
        where: buildQuery(query),
        orderBy: orderBy,
        with: {
          user: {
            columns: userColumns,
          },
          dataset: {
            columns: datasetIdentificationSelectColumns,
          },
          upvotes: session
            ? {
                where: (upvote, { eq }) => eq(upvote.userId, session.user.id),
              }
            : undefined,
        },
        offset: query.cursor ?? 0,
        limit: query.limit ? query.limit + 1 : undefined,
      })
      .then((discussions) => discussions.map(transformRow));
  }

  async function bySearchQuery(query: DiscussionQuery, session?: Session | null) {
    const trigramSimilarity = sql`
      similarity (
        ${discussion.title},
        ${query.search}
      )
    `;

    return db
      .select({
        ...getTableColumns(discussion),
        user: userSelect,
        dataset: datasetIdentificationSelect,
        upvotes: getTableColumns(discussionUpvote),
        similarity: trigramSimilarity.mapWith(Number),
      })
      .from(discussion)
      .innerJoin(user, eq(discussion.userId, user.id))
      .innerJoin(datasetView, eq(discussion.datasetId, datasetView.id))
      .leftJoin(
        discussionUpvote,
        and(
          eq(discussion.id, discussionUpvote.discussionId),
          session ? eq(discussion.userId, session.user.id) : undefined,
        ),
      )
      .where(
        and(
          buildQuery(query),
          query.search
            ? sql`
                similarity (
                  ${discussion.title},
                  ${query.search}
                ) > 0.05
              `
            : undefined,
        ),
      )
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 10)
      .orderBy((t) => [desc(t.similarity), desc(t.createdAt)])
      .then((rows) => rows.map(transformRow));
  }
}

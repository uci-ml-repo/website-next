import type { Session } from "@auth/core/types";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { discussion } from "@/db/schema";
import type {
  DatasetSelect,
  DiscussionUpvoteSelect,
  UserSelect,
} from "@/db/types";
import type {
  DiscussionQuery,
  DiscussionSearchQuery,
} from "@/server/service/schema/discussions";
import { sortFunction } from "@/server/service/schema/lib/order";

const DISCUSSION_WEIGHTS = sql`(SETWEIGHT(TO_TSVECTOR('english', ${discussion.title}), 'A') ||
                                   SETWEIGHT(TO_TSVECTOR('english', ${discussion.content}), 'B'))`;

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

type RawDiscussion = typeof discussion.$inferSelect & {
  user: UserSelect;
  dataset: DatasetSelect;
  upvotes: DiscussionUpvoteSelect[];
};

function transformRow({ upvotes, ...discussion }: RawDiscussion) {
  return {
    ...discussion,
    upvoted: upvotes ? upvotes.length > 0 : false,
  };
}

export default class DiscussionFindService {
  async byId(id: string, session?: Session | null) {
    return db.query.discussion
      .findFirst({
        where: (discussion, { eq }) => eq(discussion.id, id),
        with: {
          user: true,
          dataset: true,
          upvotes: session
            ? {
                where: (upvote, { eq }) => eq(upvote.userId, session.user.id),
              }
            : undefined,
        },
      })
      .then((discussion) => (discussion ? transformRow(discussion) : null));
  }

  async batch(ids: string[], session?: Session | null) {
    return db.query.discussion
      .findMany({
        where: (discussion, { inArray }) => inArray(discussion.id, ids),
        with: {
          user: true,
          dataset: true,
          upvotes: session
            ? {
                where: (upvote, { eq }) => eq(upvote.userId, session.user.id),
              }
            : undefined,
        },
      })
      .then((discussions) => discussions.map(transformRow));
  }

  async byQuery(query: DiscussionQuery, session?: Session | null) {
    const orderBy = query.order
      ? Object.entries(query.order).map(([orderBy, sort]) =>
          sortFunction(sort)(discussion[orderBy as keyof typeof query.order]),
        )
      : [asc(discussion.createdAt)];

    const discussions = await db.query.discussion
      .findMany({
        where: buildQuery(query),
        orderBy: orderBy,
        with: {
          user: true,
          dataset: true,
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

  async byUserId(userId: string, session: Session | null) {
    return db.query.discussion
      .findMany({
        where: (discussion, { eq }) => eq(discussion.userId, userId),
        with: {
          user: true,
          dataset: true,
          upvotes: session
            ? {
                where: (upvote, { eq }) => eq(upvote.userId, session.user.id),
              }
            : undefined,
        },
      })
      .then((discussions) => discussions.map(transformRow));
  }

  async search(query: DiscussionSearchQuery, session: Session | null) {
    const tsQuery = sql`(PLAINTO_TSQUERY('english', ${query.search}))`;
    const normalizedTsQuery = sql`(CASE WHEN NUMNODE(${tsQuery}) > 0 THEN TO_TSQUERY('english', ${tsQuery}::TEXT || ':*') ELSE '' END)`;
    const rank = sql`(TS_RANK(${DISCUSSION_WEIGHTS}, ${normalizedTsQuery}))`;

    const discussions = await db
      .select({
        id: discussion.id,
        rank: rank.mapWith(Number),
      })
      .from(discussion)
      .where(sql`(${DISCUSSION_WEIGHTS} @@ ${normalizedTsQuery})`)
      .offset(query.cursor ?? 0)
      .limit(query.limit ? query.limit + 1 : 100)
      .orderBy((t) => [desc(t.rank), asc(t.id)]);

    return await this.batch(
      discussions.map((x) => x.id),
      session,
    );
  }
}

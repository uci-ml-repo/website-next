import type { Session } from "@auth/core/types";
import { and, asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { dataset, discussion } from "@/db/schema";
import type {
  DatasetSelect,
  DiscussionUpvoteSelect,
  UserSelect,
} from "@/db/types";
import type { DiscussionQuery } from "@/server/service/schema/discussions";
import { sortFunction } from "@/server/service/schema/lib/order";

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

function transformDiscussion({ upvotes, ...discussion }: RawDiscussion) {
  return {
    ...discussion,
    upvoted: upvotes.length > 0,
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
      .then((discussion) =>
        discussion ? transformDiscussion(discussion) : null,
      );
  }

  async byQuery(query: DiscussionQuery, session: Session | null) {
    const orderBy = query.order
      ? Object.entries(query.order).map(([orderBy, sort]) =>
          sortFunction(sort)(discussion[orderBy as keyof typeof query.order]),
        )
      : [asc(dataset.id)];

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
        limit: query.limit,
        offset: query.offset,
      })
      .then((discussions) => discussions.map(transformDiscussion));

    const [countQuery] = await db
      .select({ count: count() })
      .from(discussion)
      .where(buildQuery(query));

    return {
      discussions,
      count: countQuery.count,
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
      .then((discussions) => discussions.map(transformDiscussion));
  }
}

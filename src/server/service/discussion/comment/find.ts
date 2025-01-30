import type { Session } from "@auth/core/types";
import { and, asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { dataset, discussionComment } from "@/db/schema";
import type {
  DiscussionCommentUpvoteSelect,
  DiscussionSelect,
  UserSelect,
} from "@/db/types";
import type { DiscussionCommentQuery } from "@/server/service/schema/discussions";
import { sortFunction } from "@/server/service/schema/lib/order";

function buildQuery(query: DiscussionCommentQuery) {
  let conditions = [];
  if (query.userId) {
    conditions.push(eq(discussionComment.userId, query.userId));
  }

  if (query.discussionId) {
    conditions.push(eq(discussionComment.discussionId, query.discussionId));
  }

  return and(...conditions);
}

type RawDiscussionComment = typeof discussionComment.$inferSelect & {
  user: UserSelect;
  discussion: DiscussionSelect;
  upvotes: DiscussionCommentUpvoteSelect[];
};

function transformRow({ upvotes, ...comment }: RawDiscussionComment) {
  return {
    ...comment,
    upvoted: upvotes ? upvotes.length > 0 : false,
  };
}

export default class DiscussionCommentFindService {
  async byId(id: string, session?: Session | null) {
    return db.query.discussionComment
      .findFirst({
        where: (discussionComment, { eq }) => eq(discussionComment.id, id),
        with: {
          user: true,
          discussion: true,
          upvotes: session
            ? {
                where: (upvote, { eq }) => eq(upvote.userId, session.user.id),
              }
            : undefined,
        },
      })
      .then((comment) => (comment ? transformRow(comment) : null));
  }

  async byQuery(query: DiscussionCommentQuery, session?: Session | null) {
    const orderBy = query.order
      ? Object.entries(query.order).map(([orderBy, sort]) =>
          sortFunction(sort)(
            discussionComment[orderBy as keyof typeof query.order],
          ),
        )
      : [asc(dataset.id)];

    const discussionComments = await db.query.discussionComment
      .findMany({
        where: buildQuery(query),
        orderBy: orderBy,
        with: {
          user: true,
          discussion: true,
          upvotes: session
            ? {
                where: (upvote, { eq }) => eq(upvote.userId, session.user.id),
              }
            : undefined,
        },
        limit: query.limit,
        offset: query.offset,
      })
      .then((comments) => comments.map(transformRow));

    const [countQuery] = await db
      .select({ count: count() })
      .from(discussionComment)
      .where(buildQuery(query));

    return {
      discussionComments,
      count: countQuery.count,
    };
  }
}

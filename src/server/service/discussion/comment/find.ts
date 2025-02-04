import type { Session } from "@auth/core/types";
import { and, asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { discussionComment } from "@/db/schema";
import type {
  DiscussionCommentUpvoteSelect,
  DiscussionSelect,
  UserSelect,
} from "@/db/types";
import type { DiscussionCommentQuery } from "@/server/schema/discussion";
import { sortFunction } from "@/server/schema/lib/order";

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
      : [asc(discussionComment.createdAt)];

    const discussionComments = await db.query.discussionComment
      .findMany({
        where: buildQuery(query),
        orderBy,
        with: {
          user: true,
          discussion: true,
          upvotes: session
            ? {
                where: (upvote, { eq }) => eq(upvote.userId, session.user.id),
              }
            : undefined,
        },
        limit: query.limit ? query.limit + 1 : undefined,
        offset: query.cursor ?? 0,
      })
      .then((comments) => comments.map(transformRow));

    let nextCursor: number | undefined = undefined;
    if (query.limit && discussionComments.length > query.limit) {
      discussionComments.pop();
      nextCursor = (query.cursor ?? 0) + query.limit;
    }

    const [countQuery] = await db
      .select({ count: count() })
      .from(discussionComment)
      .where(buildQuery(query));

    return {
      discussionComments,
      count: countQuery.count,
      nextCursor,
    };
  }
}

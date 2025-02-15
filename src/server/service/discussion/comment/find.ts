import type { Session } from "@auth/core/types";
import { and, asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import type {
  CommentUpvoteSelect,
  DiscussionSelect,
  UserSelect,
} from "@/db/lib/types";
import { comment } from "@/db/schema";
import type { CommentQuery } from "@/server/schema/discussion";
import { sortFunction } from "@/server/schema/lib/order";

function buildQuery(query: CommentQuery) {
  let conditions = [];
  if (query.userId) {
    conditions.push(eq(comment.userId, query.userId));
  }

  if (query.discussionId) {
    conditions.push(eq(comment.discussionId, query.discussionId));
  }

  return and(...conditions);
}

type RawComment = typeof comment.$inferSelect & {
  user: UserSelect;
  discussion: DiscussionSelect;
  upvotes: CommentUpvoteSelect[];
};

function transformRow({ upvotes, ...comment }: RawComment) {
  return {
    ...comment,
    upvoted: upvotes ? upvotes.length > 0 : false,
  };
}

export class DiscussionCommentFindService {
  async byId(id: string, session?: Session | null) {
    return db.query.comment
      .findFirst({
        where: (comment, { eq }) => eq(comment.id, id),
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

  async byQuery(query: CommentQuery, session?: Session | null) {
    const orderBy = query.order
      ? Object.entries(query.order).map(([orderBy, sort]) =>
          sortFunction(sort)(comment[orderBy as keyof typeof query.order]),
        )
      : [asc(comment.createdAt)];

    const comments = await db.query.comment
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
    if (query.limit && comments.length > query.limit) {
      comments.pop();
      nextCursor = (query.cursor ?? 0) + query.limit;
    }

    const [countQuery] = await db
      .select({ count: count() })
      .from(comment)
      .where(buildQuery(query));

    return {
      comments,
      count: countQuery.count,
      nextCursor,
    };
  }
}

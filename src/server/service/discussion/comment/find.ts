import type { Session } from "@auth/core/types";
import { and, asc, count, eq } from "drizzle-orm";

import { db } from "@/db";
import type { CommentUpvoteSelect, UserSelect } from "@/db/lib/types";
import { userColumns } from "@/db/lib/types";
import { discussionComment, discussionCommentUpvote } from "@/db/schema";
import type { CommentQuery } from "@/server/schema/discussion";
import { sortFunction } from "@/server/schema/lib/order";

function buildQuery(query: CommentQuery) {
  let conditions = [];
  if (query.userId) {
    conditions.push(eq(discussionComment.userId, query.userId));
  }

  if (query.discussionId) {
    conditions.push(eq(discussionComment.discussionId, query.discussionId));
  }

  return and(...conditions);
}

type RawComment = typeof discussionComment.$inferSelect & {
  user: UserSelect;
  upvotes: CommentUpvoteSelect[];
};

function transformRow({ upvotes, ...comment }: RawComment) {
  return {
    ...comment,
    upvoted: upvotes ? upvotes.length > 0 : false,
  };
}

export namespace discussionCommentFindService {
  export async function byId(id: string, session?: Session | null) {
    return db.query.discussionComment
      .findFirst({
        where: eq(discussionComment.id, id),
        with: {
          user: {
            columns: userColumns,
          },
          upvotes: session
            ? {
                where: eq(discussionCommentUpvote.userId, session.user.id),
              }
            : undefined,
        },
      })
      .then((comment) => (comment ? transformRow(comment) : null));
  }

  export async function byQuery(query: CommentQuery, session?: Session | null) {
    const orderBy = query.order
      ? Object.entries(query.order).map(([orderBy, sort]) =>
          sortFunction(sort)(discussionComment[orderBy as keyof typeof query.order]),
        )
      : [asc(discussionComment.createdAt)];

    const comments = await db.query.discussionComment
      .findMany({
        where: buildQuery(query),
        orderBy,
        with: {
          user: {
            columns: userColumns,
          },
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
      .from(discussionComment)
      .where(buildQuery(query));

    return {
      comments,
      count: countQuery.count,
      nextCursor,
    };
  }
}

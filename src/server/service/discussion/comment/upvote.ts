import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { comment, commentUpvote } from "@/db/schema";

export class DiscussionCommentUpvoteService {
  async create({ commentId, userId }: { commentId: string; userId: string }) {
    return await db.transaction(async (tx) => {
      await tx
        .update(comment)
        .set({
          upvoteCount: sql`${comment.upvoteCount} + 1`,
        })
        .where(eq(comment.id, commentId));

      return tx.insert(commentUpvote).values({
        commentId,
        userId,
      });
    });
  }

  async remove({ commentId, userId }: { commentId: string; userId: string }) {
    return await db.transaction(async (tx) => {
      await tx
        .update(comment)
        .set({
          upvoteCount: sql`${comment.upvoteCount} - 1`,
        })
        .where(eq(comment.id, commentId));

      return tx
        .delete(commentUpvote)
        .where(
          and(
            eq(commentUpvote.userId, userId),
            eq(commentUpvote.commentId, commentId),
          ),
        );
    });
  }
}

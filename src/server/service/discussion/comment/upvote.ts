import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { discussionComment, discussionCommentUpvote } from "@/db/schema";

export class DiscussionCommentUpvoteService {
  async create({
    discussionCommentId,
    userId,
  }: {
    discussionCommentId: string;
    userId: string;
  }) {
    return await db.transaction(async (tx) => {
      await tx
        .update(discussionComment)
        .set({
          upvoteCount: sql`${discussionComment.upvoteCount}
                    + 1`,
        })
        .where(eq(discussionComment.id, discussionCommentId));

      return tx.insert(discussionCommentUpvote).values({
        discussionCommentId,
        userId,
      });
    });
  }

  async remove({
    discussionCommentId,
    userId,
  }: {
    discussionCommentId: string;
    userId: string;
  }) {
    return await db.transaction(async (tx) => {
      await tx
        .update(discussionComment)
        .set({
          upvoteCount: sql`${discussionComment.upvoteCount}
                    - 1`,
        })
        .where(eq(discussionComment.id, discussionCommentId));

      return tx
        .delete(discussionCommentUpvote)
        .where(
          and(
            eq(discussionCommentUpvote.userId, userId),
            eq(
              discussionCommentUpvote.discussionCommentId,
              discussionCommentId,
            ),
          ),
        );
    });
  }
}

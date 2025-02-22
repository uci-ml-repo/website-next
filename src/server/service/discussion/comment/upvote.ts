import { TRPCError } from "@trpc/server";
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
      try {
        await tx.insert(discussionCommentUpvote).values({
          discussionCommentId,
          userId,
        });
      } catch {
        throw new TRPCError({
          code: "CONFLICT",
        });
      }

      await tx
        .update(discussionComment)
        .set({
          upvoteCount: sql`${discussionComment.upvoteCount} + 1`,
        })
        .where(eq(discussionComment.id, discussionCommentId));
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
      const [upvote] = await tx
        .delete(discussionCommentUpvote)
        .where(
          and(
            eq(discussionCommentUpvote.userId, userId),
            eq(
              discussionCommentUpvote.discussionCommentId,
              discussionCommentId,
            ),
          ),
        )
        .returning();

      if (!upvote) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await tx
        .update(discussionComment)
        .set({
          upvoteCount: sql`${discussionComment.upvoteCount} - 1`,
        })
        .where(eq(discussionComment.id, discussionCommentId));
    });
  }
}

import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { comment, commentUpvote } from "@/db/schema";

export class DiscussionCommentUpvoteService {
  async create({ commentId, userId }: { commentId: string; userId: string }) {
    return await db.transaction(async (tx) => {
      try {
        await tx.insert(commentUpvote).values({
          commentId,
          userId,
        });
      } catch {
        throw new TRPCError({
          code: "CONFLICT",
        });
      }

      await tx
        .update(comment)
        .set({
          upvoteCount: sql`${comment.upvoteCount} + 1`,
        })
        .where(eq(comment.id, commentId));
    });
  }

  async remove({ commentId, userId }: { commentId: string; userId: string }) {
    return await db.transaction(async (tx) => {
      const [upvote] = await tx
        .delete(commentUpvote)
        .where(
          and(
            eq(commentUpvote.userId, userId),
            eq(commentUpvote.commentId, commentId),
          ),
        )
        .returning();

      if (!upvote) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await tx
        .update(comment)
        .set({
          upvoteCount: sql`${comment.upvoteCount} - 1`,
        })
        .where(eq(comment.id, commentId));
    });
  }
}

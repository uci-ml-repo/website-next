import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { discussion, discussionUpvote } from "@/db/schema";

export namespace discussionUpvoteService {
  export async function create({ discussionId, userId }: { discussionId: string; userId: string }) {
    return await db.transaction(async (tx) => {
      try {
        await tx.insert(discussionUpvote).values({
          discussionId,
          userId,
        });
      } catch {
        throw new TRPCError({
          code: "CONFLICT",
        });
      }

      await tx
        .update(discussion)
        .set({
          upvoteCount: sql`${discussion.upvoteCount} + 1`,
        })
        .where(eq(discussion.id, discussionId));
    });
  }

  export async function remove({ discussionId, userId }: { discussionId: string; userId: string }) {
    return await db.transaction(async (tx) => {
      const [upvote] = await tx
        .delete(discussionUpvote)
        .where(
          and(eq(discussionUpvote.userId, userId), eq(discussionUpvote.discussionId, discussionId)),
        )
        .returning();

      if (!upvote) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await tx
        .update(discussion)
        .set({
          upvoteCount: sql`${discussion.upvoteCount} - 1`,
        })
        .where(eq(discussion.id, discussionId));
    });
  }
}

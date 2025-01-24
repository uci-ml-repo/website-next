import { and, count, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { discussion, discussionUpvote } from "@/db/schema";

export default class DiscussionUpvoteService {
  async create({
    userId,
    discussionId,
  }: {
    userId: string;
    discussionId: string;
  }) {
    return await db.transaction(async (tx) => {
      await tx
        .update(discussion)
        .set({
          upvoteCount: sql`${discussion.upvoteCount} + 1`,
        })
        .where(eq(discussion.id, discussionId));

      return tx.insert(discussionUpvote).values({
        discussionId,
        userId,
      });
    });
  }

  async remove({
    userId,
    discussionId,
  }: {
    userId: string;
    discussionId: string;
  }) {
    return await db.transaction(async (tx) => {
      await tx
        .update(discussion)
        .set({
          upvoteCount: sql`${discussion.upvoteCount} - 1`,
        })
        .where(eq(discussion.id, discussionId));

      return tx
        .delete(discussionUpvote)
        .where(
          and(
            eq(discussionUpvote.userId, userId),
            eq(discussionUpvote.discussionId, discussionId),
          ),
        );
    });
  }

  async find({
    userId,
    discussionId,
  }: {
    userId: string;
    discussionId: string;
  }) {
    return db.query.discussionUpvote.findFirst({
      where: (upvote, { and, eq }) =>
        and(eq(upvote.userId, userId), eq(upvote.discussionId, discussionId)),
    });
  }

  async count(discussionId: string) {
    return db
      .select({ count: count() })
      .from(discussionUpvote)
      .where(eq(discussionUpvote.discussionId, discussionId));
  }
}

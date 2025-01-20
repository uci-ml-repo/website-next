import { and, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { discussion, discussionUpvote } from "@/db/schema";
import { decrement, increment } from "@/db/util";

export default class DiscussionsUpvoteService {
  async create({
    userId,
    discussionId,
  }: {
    userId: string;
    discussionId: string;
  }) {
    return await db.transaction(async (tx) => {
      tx.update(discussion)
        .set({
          upvoteCount: increment(discussion.upvoteCount),
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
      tx.update(discussion)
        .set({
          upvoteCount: decrement(discussion.upvoteCount),
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

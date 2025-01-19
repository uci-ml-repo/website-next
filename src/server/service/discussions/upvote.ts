import { and, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { discussions, discussionUpvotes } from "@/db/schema";
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
      tx.update(discussions)
        .set({
          upvoteCount: increment(discussions.upvoteCount),
        })
        .where(eq(discussions.id, discussionId));

      return tx.insert(discussionUpvotes).values({
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
      tx.update(discussions)
        .set({
          upvoteCount: decrement(discussions.upvoteCount),
        })
        .where(eq(discussions.id, discussionId));

      return tx
        .delete(discussionUpvotes)
        .where(
          and(
            eq(discussionUpvotes.userId, userId),
            eq(discussionUpvotes.discussionId, discussionId),
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
    return db.query.discussionUpvotes.findFirst({
      where: (upvotes, { and, eq }) =>
        and(eq(upvotes.userId, userId), eq(upvotes.discussionId, discussionId)),
    });
  }

  async count(discussionId: string) {
    return db
      .select({ count: count() })
      .from(discussionUpvotes)
      .where(eq(discussionUpvotes.discussionId, discussionId));
  }
}

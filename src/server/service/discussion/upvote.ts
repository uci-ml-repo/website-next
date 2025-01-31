import { and, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { discussion, discussionUpvote } from "@/db/schema";
import service from "@/server/service";

export default class DiscussionUpvoteService {
  async create({
    userId,
    discussionId,
  }: {
    userId: string;
    discussionId: string;
  }) {
    const upvote = await db.insert(discussionUpvote).values({
      discussionId,
      userId,
    });

    await db
      .update(discussion)
      .set({
        upvoteCount: await service.discussion.upvote.count(discussionId),
      })
      .where(eq(discussion.id, discussionId));

    return upvote;
  }

  async remove({
    userId,
    discussionId,
  }: {
    userId: string;
    discussionId: string;
  }) {
    const upvote = await db
      .delete(discussionUpvote)
      .where(
        and(
          eq(discussionUpvote.userId, userId),
          eq(discussionUpvote.discussionId, discussionId),
        ),
      );

    await db
      .update(discussion)
      .set({
        upvoteCount: await service.discussion.upvote.count(discussionId),
      })
      .where(eq(discussion.id, discussionId));

    return upvote;
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
      .where(eq(discussionUpvote.discussionId, discussionId))
      .then((res) => res[0].count);
  }
}

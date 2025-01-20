import { eq } from "drizzle-orm";

import { db } from "@/db";
import type { DiscussionReportReason } from "@/db/enums";
import { discussion } from "@/db/schema";
import ServiceError from "@/server/service/errors";

export default class DiscussionsRemoveService {
  async byId({
    discussionId,
    userId,
    deletionReason,
  }: {
    discussionId: string;
    userId: string;
    deletionReason?: DiscussionReportReason;
  }) {
    const queriedDiscussion = await db.query.discussion.findFirst({
      where: (discussion, { eq }) => eq(discussion.id, discussionId),
      with: {
        replies: true,
      },
    });

    if (!queriedDiscussion) {
      throw new ServiceError({
        reason: "Dataset Not Found",
        origin: "Dataset",
      });
    }

    if (queriedDiscussion.replies.length > 0) {
      return db.update(discussion).set({
        content: "[Deleted]",
        deletedAt: new Date(),
        deletedByUserId: userId,
        deletionReason,
      });
    }

    return db.delete(discussion).where(eq(discussion.id, discussionId));
  }
}

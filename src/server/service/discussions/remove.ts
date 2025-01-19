import { eq } from "drizzle-orm";

import { db } from "@/db";
import { discussions } from "@/db/schema";
import type { DiscussionReportReason } from "@/db/types";
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
    const discussion = await db.query.discussions.findFirst({
      where: (discussions, { eq }) => eq(discussions.id, discussionId),
      with: {
        replies: true,
      },
    });

    if (!discussion) {
      throw new ServiceError({
        reason: "Dataset Not Found",
        origin: "Dataset",
      });
    }

    if (discussion.replies.length > 0) {
      return db.update(discussions).set({
        content: "[Deleted]",
        deletedAt: new Date(),
        deletedByUserId: userId,
        deletionReason,
      });
    }

    return db.delete(discussions).where(eq(discussions.id, discussionId));
  }
}

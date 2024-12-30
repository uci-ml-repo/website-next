import type { DiscussionReportReason, PrismaClient } from "@prisma/client";

import ServiceError from "@/server/service/errors";

export default class DiscussionsRemoveService {
  constructor(readonly prisma: PrismaClient) {}

  async byId({
    discussionId,
    userId,
    deletionReason,
  }: {
    discussionId: string;
    userId: string;
    deletionReason?: DiscussionReportReason;
  }) {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
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
      return this.prisma.discussion.update({
        where: { id: discussionId },
        data: {
          content: "[Deleted]",
          deletedAt: new Date(),
          deletedByUserId: userId,
          deletionReason,
        },
      });
    }

    return this.prisma.discussion.delete({
      where: { id: discussionId },
    });
  }
}

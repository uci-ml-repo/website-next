import type { DiscussionReportReason, PrismaClient } from "@prisma/client";

import ServiceError from "@/server/service/errors";

export default class DiscussionsRemoveService {
  constructor(readonly prisma: PrismaClient) {}

  async byId({
    id,
    userId,
    deletionReason,
  }: {
    id: string;
    userId: string;
    deletionReason?: DiscussionReportReason;
  }) {
    const discussion = await this.prisma.datasetDiscussion.findUnique({
      where: { id },
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
      return this.prisma.datasetDiscussion.update({
        where: { id },
        data: {
          content: "[Deleted]",
          deletedAt: new Date(),
          deletedByUserId: userId,
          deletionReason,
        },
      });
    }

    return this.prisma.datasetDiscussion.delete({
      where: { id },
    });
  }
}

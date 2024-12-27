import type { DiscussionReportReason, PrismaClient } from "@prisma/client";

export default class DiscussionsRemoveService {
  constructor(readonly prisma: PrismaClient) {}

  async byId({
    id,
    userId,
    reason,
  }: {
    id: string;
    userId: string;
    reason?: DiscussionReportReason;
  }) {
    return this.prisma.datasetDiscussion.update({
      where: { id },
      data: {
        text: "[Comment Deleted]",
        deletedAt: new Date(),
        deletedByUserId: userId,
        deletionReason: reason,
      },
    });
  }
}

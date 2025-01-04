import type { PrismaClient } from "@prisma/client";

export default class DiscussionsCreateService {
  constructor(readonly prisma: PrismaClient) {}

  async fromData({
    content,
    userId,
    datasetId,
    replyToId,
  }: {
    content: string;
    userId: string;
    datasetId: number;
    replyToId?: string;
  }) {
    return this.prisma.discussion.create({
      data: {
        content,
        userId,
        datasetId,
        replyToId,
      },
      include: {
        user: true,
        upvotes: true,
        replies: true,
      },
    });
  }
}

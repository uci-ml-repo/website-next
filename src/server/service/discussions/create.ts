import type { PrismaClient } from "@prisma/client";

export default class DiscussionsCreateService {
  constructor(readonly prisma: PrismaClient) {}

  async fromData({
    content,
    userId,
    datasetId,
  }: {
    content: string;
    userId: string;
    datasetId: number;
  }) {
    return this.prisma.datasetDiscussion.create({
      data: {
        content,
        userId,
        datasetId,
      },
      include: {
        user: true,
        upvotes: true,
      },
    });
  }
}

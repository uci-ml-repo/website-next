import type { PrismaClient } from "@prisma/client";

export default class DiscussionsCreateService {
  constructor(readonly prisma: PrismaClient) {}

  async fromData({
    text,
    userId,
    datasetId,
  }: {
    text: string;
    userId: string;
    datasetId: number;
  }) {
    return this.prisma.datasetDiscussion.create({
      data: {
        text,
        userId,
        datasetId,
      },
    });
  }
}

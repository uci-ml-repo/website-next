import type { PrismaClient } from "@prisma/client";

export default class BookmarksCreateService {
  constructor(readonly prisma: PrismaClient) {}

  async addBookmark({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    const bookmark = await this.prisma.bookmark.upsert({
      where: {
        userId_datasetId: {
          userId,
          datasetId,
        },
      },
      update: {},
      create: {
        datasetId,
        userId,
      },
    });

    return bookmark;
  }
}

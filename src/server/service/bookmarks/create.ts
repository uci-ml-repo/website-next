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
    const bookmark = await this.prisma.bookmark.create({
      data: {
        datasetId,
        userId,
      },
    });

    return bookmark;
  }
}

import { type PrismaClient } from "@prisma/client";

export default class BookmarksService {
  constructor(readonly prisma: PrismaClient) {}

  async byUserId(userId: string) {
    const bookmarks = await this.prisma.datasetBookmark.findMany({
      where: {
        userId,
      },
      include: {
        dataset: true,
      },
      orderBy: {
        bookmarkedAt: "desc",
      },
    });

    return bookmarks;
  }

  async addBookmark({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    const bookmark = await this.prisma.datasetBookmark.create({
      data: {
        datasetId,
        userId,
      },
    });

    return bookmark;
  }

  async removeBookmark({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    const bookmark = await this.prisma.datasetBookmark.delete({
      where: {
        userId_datasetId: {
          userId,
          datasetId,
        },
      },
    });

    return bookmark;
  }

  async isBookmarked({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    const bookmark = await this.prisma.datasetBookmark.findFirst({
      where: {
        datasetId,
        userId,
      },
    });

    return bookmark !== null;
  }
}

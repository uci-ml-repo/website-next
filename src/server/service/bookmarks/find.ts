import type { PrismaClient } from "@prisma/client";

export default class BookmarksFindService {
  constructor(readonly prisma: PrismaClient) {}

  async byUserId(userId: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
      include: {
        dataset: true,
      },
    });

    return bookmarks;
  }

  async isBookmarked({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_datasetId: {
          userId,
          datasetId,
        },
      },
    });

    return !!bookmark;
  }
}

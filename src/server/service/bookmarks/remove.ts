import type { PrismaClient } from "@prisma/client";

export default class BookmarksRemoveService {
  constructor(readonly prisma: PrismaClient) {}

  async removeBookmark({
    datasetId,
    userId,
  }: {
    datasetId: number;
    userId: string;
  }) {
    try {
      const bookmark = await this.prisma.bookmark.delete({
        where: {
          userId_datasetId: {
            userId,
            datasetId,
          },
        },
      });
      return bookmark;
    } catch {
      return null;
    }
  }
}

import { type PrismaClient } from "@prisma/client";

export default class DraftDatasetsFindService {
  constructor(readonly prisma: PrismaClient) {}

  async byId(id: string) {
    return this.prisma.draftDataset.findUnique({
      where: { id },
      include: {
        keywords: {
          include: {
            keyword: true,
          },
        },
        authors: true,
        introductoryPaper: true,
        user: true,
        variables: true,
      },
    });
  }

  async byUserId(userId: string) {
    return this.prisma.draftDataset.findMany({
      where: { userId },
      include: {
        keywords: {
          include: {
            keyword: true,
          },
        },
        authors: true,
        introductoryPaper: true,
        user: true,
        variables: true,
      },
    });
  }
}

import { type PrismaClient } from "@prisma/client";

import type { DiscussionQuery } from "@/server/schema/discussions";

export default class DiscussionsFindService {
  constructor(readonly prisma: PrismaClient) {}

  async byId(id: string) {
    return this.prisma.datasetDiscussion.findUnique({
      where: { id },
      include: {
        upvotes: true,
      },
    });
  }

  async byQuery(query: DiscussionQuery) {
    return this.prisma.datasetDiscussion.findMany({
      where: {
        datasetId: query.datasetId,
        userId: query.userId,
      },
      include: {
        upvotes: true,
      },
      orderBy: query.orderBy ? { [query.orderBy]: query.sort } : undefined,
      skip: query.skip,
      take: query.take,
      cursor: query.cursor ? { id: query.cursor } : undefined,
    });
  }
}

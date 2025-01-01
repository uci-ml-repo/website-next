import { type PrismaClient } from "@prisma/client";

import type { DiscussionQuery } from "@/server/schema/discussions";

export default class DiscussionsFindService {
  constructor(readonly prisma: PrismaClient) {}

  async byId(id: string) {
    return this.prisma.discussion.findUnique({
      where: { id },
      include: {
        upvotes: true,
        user: true,
        replies: true,
      },
    });
  }

  async byQuery(query: DiscussionQuery) {
    return this.prisma.discussion.findMany({
      where: {
        datasetId: query.datasetId,
        userId: query.userId,
      },
      include: {
        upvotes: true,
        user: true,
        replies: true,
      },
      orderBy: query.orderBy
        ? { [query.orderBy]: query.sort }
        : [{ upvoteCount: "desc" }, { createdAt: "desc" }],
      skip: query.skip,
      take: query.take,
      cursor: query.cursor ? { id: query.cursor } : undefined,
    });
  }

  async byUserId(userId: string) {
    return this.prisma.discussion.findMany({
      where: { userId },
      include: {
        upvotes: true,
        user: true,
        replies: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

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
        replies: {
          include: {
            user: true,
            upvotes: true,
          },
          orderBy: [{ createdAt: "asc" }],
        },
      },
    });
  }

  async byQuery(query: DiscussionQuery) {
    return this.prisma.discussion.findMany({
      where: {
        datasetId: query.datasetId,
        userId: query.userId,
        replyToId: query.excludeReplies ? null : undefined,
      },
      include: {
        upvotes: query.selectUpvoteUserId
          ? {
              where: {
                userId: query.selectUpvoteUserId,
              },
            }
          : false,
        user: true,
        replies: {
          include: {
            user: true,
            upvotes: true,
          },
          orderBy: [{ createdAt: "asc" }],
        },
      },
      orderBy: query.orderBy
        ? { [query.orderBy]: query.sort }
        : [{ upvoteCount: "desc" }, { createdAt: "asc" }],
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
        replies: {
          include: {
            user: true,
            upvotes: true,
          },
          orderBy: [{ createdAt: "asc" }],
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

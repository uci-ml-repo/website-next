import type { PrismaClient } from "@prisma/client";

export default class DiscussionsUpvoteService {
  constructor(readonly prisma: PrismaClient) {}

  async create({
    userId,
    discussionId,
  }: {
    userId: string;
    discussionId: string;
  }) {
    const [upvote] = await this.prisma.$transaction([
      this.prisma.datasetDiscussionUpvote.create({
        data: {
          discussionId,
          userId,
        },
      }),
      this.prisma.datasetDiscussion.update({
        where: {
          id: discussionId,
        },
        data: {
          upvoteCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return upvote;
  }

  async remove({
    userId,
    discussionId,
  }: {
    userId: string;
    discussionId: string;
  }) {
    const [upvote] = await this.prisma.$transaction([
      this.prisma.datasetDiscussionUpvote.delete({
        where: {
          userId_discussionId: {
            userId,
            discussionId,
          },
        },
      }),
      this.prisma.datasetDiscussion.update({
        where: {
          id: discussionId,
        },
        data: {
          upvoteCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return upvote;
  }
}

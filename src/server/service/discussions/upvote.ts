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
      this.prisma.discussionUpvote.create({
        data: {
          discussionId,
          userId,
        },
      }),
      this.prisma.discussion.update({
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
      this.prisma.discussionUpvote.delete({
        where: {
          userId_discussionId: {
            userId,
            discussionId,
          },
        },
      }),
      this.prisma.discussion.update({
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

  async find({
    userId,
    discussionId,
  }: {
    userId: string;
    discussionId: string;
  }) {
    return this.prisma.discussionUpvote.findUnique({
      where: {
        userId_discussionId: {
          userId,
          discussionId,
        },
      },
    });
  }

  async count(discussionId: string) {
    return this.prisma.discussionUpvote.count({
      where: {
        discussionId,
      },
    });
  }
}

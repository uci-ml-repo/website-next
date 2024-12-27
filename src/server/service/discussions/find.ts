import { type PrismaClient } from "@prisma/client";

export default class DiscussionsFindService {
  constructor(readonly prisma: PrismaClient) {}

  async byId(id: string) {
    return this.prisma.datasetDiscussion.findUnique({
      where: { id },
    });
  }
}

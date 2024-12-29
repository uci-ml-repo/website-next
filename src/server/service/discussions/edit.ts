import type { PrismaClient } from "@prisma/client";

export default class DiscussionsEditService {
  constructor(readonly prisma: PrismaClient) {}

  async byId({ id, content }: { id: string; content: string }) {
    return this.prisma.datasetDiscussion.update({
      where: { id },
      data: { content },
    });
  }
}

import type { PrismaClient } from "@prisma/client";

export default class DiscussionsEditService {
  constructor(readonly prisma: PrismaClient) {}

  async byId({ id, text }: { id: string; text: string }) {
    return this.prisma.datasetDiscussion.update({
      where: { id },
      data: { text },
    });
  }
}

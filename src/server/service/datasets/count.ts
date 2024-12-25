import { ApprovalStatus, type PrismaClient } from "@prisma/client";

export default class DatasetsCountService {
  constructor(readonly prisma: PrismaClient) {}

  async approved() {
    return this.prisma.dataset.count({
      where: {
        status: ApprovalStatus.APPROVED,
      },
    });
  }
}

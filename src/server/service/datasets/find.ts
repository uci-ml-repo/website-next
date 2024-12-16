import { $Enums, type PrismaClient } from "@prisma/client";

import type { DatasetQuery } from "@/server/schema/datasets";

export default class DatasetsFindService {
  constructor(readonly prisma: PrismaClient) {}

  async byId(id: number) {
    return this.prisma.dataset.findUnique({
      where: { id },
    });
  }

  async byQuery(query: DatasetQuery) {
    const [datasets, count] = await this.prisma.$transaction([
      this.prisma.dataset.findMany({
        where: {
          status: $Enums.DatasetStatus.APPROVED,
        },
        orderBy: query.orderBy ? { [query.orderBy]: query.sort } : undefined,
        cursor: query.cursor ? { id: query.cursor } : undefined,
        skip: query.skip,
        take: query.take ? query.take + 1 : undefined,
      }),

      this.prisma.dataset.count({
        where: { status: $Enums.DatasetStatus.APPROVED },
      }),
    ]);

    let nextCursor: number | undefined;

    if (query.take !== undefined && datasets.length > query.take) {
      const next = datasets.pop();
      nextCursor = next?.id;
    }

    return { datasets, count, nextCursor };
  }
}

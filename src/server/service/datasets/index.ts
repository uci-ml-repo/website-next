import type { PrismaClient } from "@prisma/client";

import DatasetsFindService from "@/server/service/datasets/find";

export default class DatasetsService {
  constructor(
    readonly prisma: PrismaClient,
    readonly find = new DatasetsFindService(prisma),
  ) {}
}

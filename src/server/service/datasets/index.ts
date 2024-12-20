import type { PrismaClient } from "@prisma/client";

import DatasetsCiteService from "@/server/service/datasets/cite";
import DatasetsFindService from "@/server/service/datasets/find";

export default class DatasetsService {
  constructor(
    readonly prisma: PrismaClient,
    readonly find = new DatasetsFindService(prisma),
    readonly cite = new DatasetsCiteService(prisma),
  ) {}
}

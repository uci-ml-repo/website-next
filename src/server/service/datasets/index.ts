import type { PrismaClient } from "@prisma/client";

import DatasetsBookmarkService from "@/server/service/datasets/bookmark";
import DatasetsCiteService from "@/server/service/datasets/cite";
import DatasetsCountService from "@/server/service/datasets/count";
import DatasetsFindService from "@/server/service/datasets/find";

export default class DatasetsService {
  constructor(
    readonly prisma: PrismaClient,
    readonly find = new DatasetsFindService(prisma),
    readonly cite = new DatasetsCiteService(prisma),
    readonly count = new DatasetsCountService(prisma),
    readonly bookmark = new DatasetsBookmarkService(prisma),
  ) {}
}

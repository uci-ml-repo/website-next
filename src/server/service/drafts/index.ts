import type { PrismaClient } from "@prisma/client";

import DraftDatasetsFindService from "@/server/service/drafts/find";

export default class DraftDatasetsService {
  constructor(
    readonly prisma: PrismaClient,
    readonly find = new DraftDatasetsFindService(prisma),
  ) {}
}

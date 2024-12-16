import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import DatasetsService from "@/server/service/datasets";

class RepositoryService {
  constructor(
    readonly prisma: PrismaClient,
    readonly datasets = new DatasetsService(prisma),
  ) {}
}

const service = new RepositoryService(prisma);

export default service;

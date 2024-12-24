import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import DatasetsService from "@/server/service/datasets";
import FilesService from "@/server/service/files";

class RepositoryService {
  constructor(
    readonly prisma: PrismaClient,
    readonly datasets = new DatasetsService(prisma),
    readonly files = new FilesService(prisma),
  ) {}
}

const service = new RepositoryService(prisma);

export default service;

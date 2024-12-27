import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import DatasetsService from "@/server/service/datasets";
import DiscussionsService from "@/server/service/discussions";
import DraftDatasetsService from "@/server/service/drafts";
import FilesService from "@/server/service/files";

class RepositoryService {
  constructor(
    readonly prisma: PrismaClient,
    readonly datasets = new DatasetsService(prisma),
    readonly draftDatasets = new DraftDatasetsService(prisma),
    readonly discussions = new DiscussionsService(prisma),
    readonly files = new FilesService(prisma),
  ) {}
}

const service = new RepositoryService(prisma);

export default service;

import type { PrismaClient } from "@prisma/client";

import FilesFindService from "@/server/service/files/find";
import FilesReadService from "@/server/service/files/read";

export default class FilesService {
  constructor(
    readonly prisma: PrismaClient,
    readonly find = new FilesFindService(prisma),
    readonly read = new FilesReadService(prisma),
  ) {}
}

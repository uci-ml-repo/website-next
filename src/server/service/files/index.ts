import type { PrismaClient } from "@prisma/client";

import FilesFindService from "@/server/service/files/find";

export default class FilesService {
  constructor(
    readonly prisma: PrismaClient,
    readonly find = new FilesFindService(prisma),
  ) {}
}

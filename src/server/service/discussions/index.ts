import type { PrismaClient } from "@prisma/client";

import DiscussionsFindService from "@/server/service/discussions/find";

export default class DiscussionsService {
  constructor(
    readonly prisma: PrismaClient,
    readonly find = new DiscussionsFindService(prisma),
  ) {}
}

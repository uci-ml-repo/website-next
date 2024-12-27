import type { PrismaClient } from "@prisma/client";

import DiscussionsCreateService from "@/server/service/discussions/create";
import DiscussionsEditService from "@/server/service/discussions/edit";
import DiscussionsFindService from "@/server/service/discussions/find";
import DiscussionsRemoveService from "@/server/service/discussions/remove";

export default class DiscussionsService {
  constructor(
    readonly prisma: PrismaClient,
    readonly find = new DiscussionsFindService(prisma),
    readonly edit = new DiscussionsEditService(prisma),
    readonly create = new DiscussionsCreateService(prisma),
    readonly remove = new DiscussionsRemoveService(prisma),
  ) {}
}

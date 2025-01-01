import { type PrismaClient } from "@prisma/client";

import BookmarksCreateService from "@/server/service/bookmarks/create";
import BookmarksFindService from "@/server/service/bookmarks/find";
import BookmarksRemoveService from "@/server/service/bookmarks/remove";

export default class BookmarksService {
  constructor(
    readonly prisma: PrismaClient,
    readonly create = new BookmarksCreateService(prisma),
    readonly find = new BookmarksFindService(prisma),
    readonly remove = new BookmarksRemoveService(prisma),
  ) {}
}

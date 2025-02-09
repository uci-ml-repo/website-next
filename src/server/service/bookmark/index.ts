import { BookmarkCreateService } from "@/server/service/bookmark/create";
import { BookmarkFindService } from "@/server/service/bookmark/find";
import { BookmarkRemoveService } from "@/server/service/bookmark/remove";

export class BookmarkService {
  constructor(
    readonly create = new BookmarkCreateService(),
    readonly find = new BookmarkFindService(),
    readonly remove = new BookmarkRemoveService(),
  ) {}
}

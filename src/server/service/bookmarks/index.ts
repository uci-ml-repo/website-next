import BookmarksCreateService from "@/server/service/bookmarks/create";
import BookmarksFindService from "@/server/service/bookmarks/find";
import BookmarksRemoveService from "@/server/service/bookmarks/remove";

export default class BookmarksService {
  constructor(
    readonly create = new BookmarksCreateService(),
    readonly find = new BookmarksFindService(),
    readonly remove = new BookmarksRemoveService(),
  ) {}
}

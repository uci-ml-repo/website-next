import { bookmarkCreateService } from "@/server/service/bookmark/create";
import { bookmarkFindService } from "@/server/service/bookmark/find";
import { bookmarkRemoveService } from "@/server/service/bookmark/remove";

export namespace bookmarkService {
  export const create = bookmarkCreateService;
  export const find = bookmarkFindService;
  export const remove = bookmarkRemoveService;
}

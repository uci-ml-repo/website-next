import { bookmarkDeleteService } from "@/server/service/bookmark/delete";
import { bookmarkFindService } from "@/server/service/bookmark/find";
import { bookmarkInsertService } from "@/server/service/bookmark/insert";

export const bookmarkService = {
  find: bookmarkFindService,
  insert: bookmarkInsertService,
  delete: bookmarkDeleteService,
};

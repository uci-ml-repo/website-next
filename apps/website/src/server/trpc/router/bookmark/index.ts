import { router } from "@/server/trpc";
import { bookmarkDeleteRouter } from "@/server/trpc/router/bookmark/delete";
import { bookmarkFindRouter } from "@/server/trpc/router/bookmark/find";
import { bookmarkInsertRouter } from "@/server/trpc/router/bookmark/insert";

export const bookmarkRouter = router({
  find: bookmarkFindRouter,
  insert: bookmarkInsertRouter,
  delete: bookmarkDeleteRouter,
});

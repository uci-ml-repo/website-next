import { router } from "@/server/trpc";
import bookmarksCreateRouter from "@/server/trpc/routers/bookmarks/create";
import bookmarksFindRouter from "@/server/trpc/routers/bookmarks/find";
import bookmarksRemoveRouter from "@/server/trpc/routers/bookmarks/remove";

const bookmarksRouter = router({
  find: bookmarksFindRouter,
  create: bookmarksCreateRouter,
  remove: bookmarksRemoveRouter,
});

export default bookmarksRouter;

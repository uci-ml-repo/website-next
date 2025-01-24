import { router } from "@/server/trpc";
import bookmarkCreateRouter from "@/server/trpc/routers/bookmark/create";
import bookmarkFindRouter from "@/server/trpc/routers/bookmark/find";
import bookmarkRemoveRouter from "@/server/trpc/routers/bookmark/remove";

const bookmarkRouter = router({
  find: bookmarkFindRouter,
  create: bookmarkCreateRouter,
  remove: bookmarkRemoveRouter,
});

export default bookmarkRouter;

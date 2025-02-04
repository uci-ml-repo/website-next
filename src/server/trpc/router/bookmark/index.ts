import { router } from "@/server/trpc";
import bookmarkCreateRouter from "@/server/trpc/router/bookmark/create";
import bookmarkFindRouter from "@/server/trpc/router/bookmark/find";
import bookmarkRemoveRouter from "@/server/trpc/router/bookmark/remove";

const bookmarkRouter = router({
  find: bookmarkFindRouter,
  create: bookmarkCreateRouter,
  remove: bookmarkRemoveRouter,
});

export default bookmarkRouter;
